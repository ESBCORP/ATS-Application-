import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';

const SPEECH_KEY = import.meta.env.VITE_AZURE_SPEECH_KEY;
const SPEECH_REGION = import.meta.env.VITE_AZURE_SPEECH_REGION;

// Event types for listeners
type SpeechEventType = 
  | 'speechStarted' 
  | 'speechCompleted' 
  | 'speechError'
  | 'recognitionStarted'
  | 'recognitionStopped'
  | 'textRecognized'
  | 'recognitionError'
  | 'stateChanged';

// Event data interfaces
interface SpeechEvent {
  type: SpeechEventType;
  data?: any;
  timestamp: Date;
  label?: string;
}

interface SpeechMessage {
  id: string;
  text: string;
  label: string;
  timestamp: Date;
  status: 'pending' | 'speaking' | 'completed' | 'error';
  duration?: number;
}

interface RecognitionResult {
  text: string;
  confidence: number;
  timestamp: Date;
  isInterim: boolean;
}

type EventListener = (event: SpeechEvent) => void;

class SpeechService {
  private recognizer: SpeechSDK.SpeechRecognizer | null = null;
  private speechConfig: SpeechSDK.SpeechConfig | null = null;
  private currentSynthesizer: SpeechSDK.SpeechSynthesizer | null = null;
  
  // State management
  private isListening: boolean = false;
  private isSpeaking: boolean = false;
  private microphonePermissionGranted: boolean = false;
  
  // Queue management
  private speakQueue: Promise<void> = Promise.resolve();
  private messageQueue: SpeechMessage[] = [];
  private currentMessage: SpeechMessage | null = null;
  
  // Event listeners
  private eventListeners: Map<SpeechEventType, EventListener[]> = new Map();
  private onResultCallback: ((text: string) => void) | null = null;
  
  // Message tracking
  private messageHistory: SpeechMessage[] = [];
  private recognitionHistory: RecognitionResult[] = [];
  
  constructor() {
    if (!SPEECH_KEY || !SPEECH_REGION) {
      console.error('Azure Speech credentials not found');
      this.emitEvent('speechError', { error: 'Missing credentials' });
      return;
    }

    try {
      console.log('🎤 Initializing Speech Service...');
      console.log('🔑 Using region:', SPEECH_REGION);
      
      this.speechConfig = SpeechSDK.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
      this.speechConfig.speechSynthesisVoiceName = "en-US-GuyNeural";
      
      // Enhanced speech recognition settings
      this.speechConfig.speechRecognitionLanguage = "en-US";
      this.speechConfig.enableDictation();
      
      // Initialize event listener maps
      this.initializeEventListeners();
      
      console.log('✅ Speech Service initialized successfully');
      this.emitEvent('stateChanged', { isInitialized: true });
    } catch (error) {
      console.error('❌ Failed to initialize Speech Service:', error);
      this.emitEvent('speechError', { error: error.message });
    }
  }

  // Event Listener Management
  private initializeEventListeners(): void {
    const eventTypes: SpeechEventType[] = [
      'speechStarted', 'speechCompleted', 'speechError',
      'recognitionStarted', 'recognitionStopped', 'textRecognized',
      'recognitionError', 'stateChanged'
    ];
    
    eventTypes.forEach(type => {
      this.eventListeners.set(type, []);
    });
  }

  public addEventListener(eventType: SpeechEventType, listener: EventListener): void {
    const listeners = this.eventListeners.get(eventType) || [];
    listeners.push(listener);
    this.eventListeners.set(eventType, listeners);
    console.log(`📡 Added listener for ${eventType}. Total listeners: ${listeners.length}`);
  }

  public removeEventListener(eventType: SpeechEventType, listener: EventListener): void {
    const listeners = this.eventListeners.get(eventType) || [];
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
      this.eventListeners.set(eventType, listeners);
      console.log(`🗑️ Removed listener for ${eventType}. Remaining listeners: ${listeners.length}`);
    }
  }

  private emitEvent(eventType: SpeechEventType, data?: any, label?: string): void {
    const event: SpeechEvent = {
      type: eventType,
      data,
      timestamp: new Date(),
      label
    };

    const listeners = this.eventListeners.get(eventType) || [];
    listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error(`❌ Error in event listener for ${eventType}:`, error);
      }
    });

    console.log(`📡 Event emitted: ${eventType}`, data);
  }

  // Microphone Permission Management
  private async checkMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      this.microphonePermissionGranted = true;
      console.log('✅ Microphone permission granted');
      return true;
    } catch (error) {
      console.error('❌ Microphone permission denied:', error);
      this.microphonePermissionGranted = false;
      this.emitEvent('recognitionError', { error: 'Microphone permission denied' });
      return false;
    }
  }

  // Message Management
  private createMessage(text: string, label: string = ""): SpeechMessage {
    return {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      label,
      timestamp: new Date(),
      status: 'pending'
    };
  }

  private updateMessageStatus(messageId: string, status: SpeechMessage['status'], duration?: number): void {
    // Update in message history
    const historyMessage = this.messageHistory.find(m => m.id === messageId);
    if (historyMessage) {
      historyMessage.status = status;
      if (duration) historyMessage.duration = duration;
    }

    // Update current message
    if (this.currentMessage && this.currentMessage.id === messageId) {
      this.currentMessage.status = status;
      if (duration) this.currentMessage.duration = duration;
    }

    // Update in queue
    const queueMessage = this.messageQueue.find(m => m.id === messageId);
    if (queueMessage) {
      queueMessage.status = status;
      if (duration) queueMessage.duration = duration;
    }
  }

  // Enhanced Speech Synthesis
  public async speak(text: string, label: string = ""): Promise<void> {
    if (!this.speechConfig) {
      const error = new Error('Speech synthesizer not initialized');
      this.emitEvent('speechError', { error: error.message }, label);
      throw error;
    }

    const message = this.createMessage(text, label);
    this.messageHistory.push(message);

    // Stop any current speech first
    if (this.isSpeaking && this.currentSynthesizer) {
      console.log(`🛑 [${label}] Stopping current speech before starting new one`);
      this.currentSynthesizer.close();
      this.currentSynthesizer = null;
    }

    // Stop listening during speech
    if (this.isListening) {
      console.log(`⏸️ [${label}] Pausing listening during speech`);
      await this.pauseListening();
    }

    console.log(`🗣️ [${label}] START SPEAKING: "${text.substring(0, 50)}..."`);
    
    this.isSpeaking = true;
    this.currentMessage = message;
    this.updateMessageStatus(message.id, 'speaking');
    this.emitEvent('speechStarted', { message, text }, label);

    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
      this.currentSynthesizer = new SpeechSDK.SpeechSynthesizer(this.speechConfig!, audioConfig);

      this.currentSynthesizer.synthesisStarted = (s, e) => {
        console.log(`🎵 [${label}] Synthesis started`);
      };

      this.currentSynthesizer.synthesisCompleted = (s, e) => {
        console.log(`🎵 [${label}] Synthesis completed`);
      };

      this.currentSynthesizer.speakTextAsync(
        text,
        result => {
          const duration = Date.now() - startTime;
          console.log(`📢 [${label}] Speech result reason:`, result.reason);
          
          if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
            console.log(`✅ [${label}] Speech synthesis completed successfully`);
            
            let audioDuration = Math.max(2000, duration);
            if (result.audioDuration) {
              audioDuration = Math.max(2000, result.audioDuration / 10000);
            }
            
            setTimeout(() => {
              if (this.currentSynthesizer) {
                this.currentSynthesizer.close();
                this.currentSynthesizer = null;
              }
              
              this.isSpeaking = false;
              this.updateMessageStatus(message.id, 'completed', duration);
              this.emitEvent('speechCompleted', { message, duration }, label);
              
              // Resume listening if callback exists
              if (this.onResultCallback) {
                this.resumeListening();
              }
              
              setTimeout(() => {
                console.log(`✅ [${label}] Ready for next action`);
                resolve();
              }, 500);
              
            }, Math.min(audioDuration, 10000)); // Max 5 second wait
            
          } else {
            const error = new Error(`Speech synthesis failed: ${result.reason}`);
            console.error(`❌ [${label}] Speech synthesis failed:`, result.reason);
            
            if (this.currentSynthesizer) {
              this.currentSynthesizer.close();
              this.currentSynthesizer = null;
            }
            
            this.isSpeaking = false;
            this.updateMessageStatus(message.id, 'error');
            this.emitEvent('speechError', { message, error: error.message }, label);
            reject(error);
          }
        },
        error => {
          const duration = Date.now() - startTime;
          console.error(`❌ [${label}] Speech synthesis error:`, error);
          
          if (this.currentSynthesizer) {
            this.currentSynthesizer.close();
            this.currentSynthesizer = null;
          }
          
          this.isSpeaking = false;
          this.updateMessageStatus(message.id, 'error', duration);
          this.emitEvent('speechError', { message, error: error.message }, label);
          reject(error);
        }
      );
    });
  }

  // Queued Speech
  public queueSpeak(text: string, label: string = ""): Promise<void> {
    const message = this.createMessage(text, label);
    this.messageQueue.push(message);
    
    console.log(`📋 [${label}] Added to speech queue. Queue length: ${this.messageQueue.length}`);
    
    this.speakQueue = this.speakQueue.then(() => {
      // Remove from queue when starting
      const index = this.messageQueue.findIndex(m => m.id === message.id);
      if (index > -1) {
        this.messageQueue.splice(index, 1);
      }
      return this.speak(text, label);
    });
    
    return this.speakQueue;
  }

  // Sequential Speech
  public async speakSequentially(messages: Array<{text: string, label: string}>): Promise<void> {
    console.log(`📋 Speaking ${messages.length} messages sequentially`);
    
    for (const message of messages) {
      await this.speak(message.text, message.label);
      console.log(`✅ Completed: ${message.label}`);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log(`🏁 All sequential speech completed`);
  }

  // Enhanced Speech Recognition
  public async startListening(onResult: (text: string, result?: RecognitionResult) => void): Promise<void> {
    if (this.isSpeaking) {
      console.log('⚠️ Cannot start listening - currently speaking');
      this.onResultCallback = onResult;
      return;
    }

    if (this.isListening) {
      console.log('⚠️ Already listening');
      return;
    }

    if (!this.speechConfig) {
      const error = new Error('Speech config not initialized');
      this.emitEvent('recognitionError', { error: error.message });
      throw error;
    }

    const hasPermission = await this.checkMicrophonePermission();
    if (!hasPermission) {
      const error = new Error('Microphone permission required');
      this.emitEvent('recognitionError', { error: error.message });
      throw error;
    }

    this.onResultCallback = onResult;

    try {
      console.log('🎤 Starting speech recognition...');
      
      if (this.recognizer) {
        this.recognizer.close();
        this.recognizer = null;
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
      this.recognizer = new SpeechSDK.SpeechRecognizer(this.speechConfig, audioConfig);
      
      // Enhanced recognition handlers
      this.recognizer.recognized = (s, e) => {
        if (e.result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
          const recognizedText = e.result.text.trim();
          
          if (recognizedText && recognizedText.length > 1) {
            console.log(`🎤 Speech recognized: "${recognizedText}"`);
            
            const result: RecognitionResult = {
              text: recognizedText,
              confidence: e.result.properties?.getProperty(SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult) ? 
                JSON.parse(e.result.properties.getProperty(SpeechSDK.PropertyId.SpeechServiceResponse_JsonResult)).NBest?.[0]?.Confidence || 0.5 : 0.5,
              timestamp: new Date(),
              isInterim: false
            };
            
            this.recognitionHistory.push(result);
            
            if (this.isListening && !this.isSpeaking && this.onResultCallback) {
              console.log(`✅ Processing recognized speech`);
              this.onResultCallback(recognizedText, result);
              this.emitEvent('textRecognized', { text: recognizedText, result });
            }
          }
        }
      };

      this.recognizer.recognizing = (s, e) => {
        if (e.result.text.trim()) {
          console.log(`🎤 Recognizing: "${e.result.text}"`);
          
          const interimResult: RecognitionResult = {
            text: e.result.text,
            confidence: 0,
            timestamp: new Date(),
            isInterim: true
          };
          
          this.emitEvent('textRecognized', { text: e.result.text, result: interimResult, isInterim: true });
        }
      };

      this.recognizer.canceled = (s, e) => {
        console.log(`🎤 Recognition canceled: ${e.reason}`);
        if (e.reason === SpeechSDK.CancellationReason.Error) {
          console.error(`❌ Recognition error: ${e.errorDetails}`);
          this.emitEvent('recognitionError', { error: e.errorDetails });
        }
        this.isListening = false;
        this.emitEvent('recognitionStopped', { reason: e.reason });
      };

      this.recognizer.sessionStopped = (s, e) => {
        console.log('🎤 Recognition session stopped');
        this.isListening = false;
        this.emitEvent('recognitionStopped', {});
      };

      this.recognizer.sessionStarted = (s, e) => {
        console.log('🎤 Recognition session started');
        this.emitEvent('recognitionStarted', {});
      };

      this.recognizer.startContinuousRecognitionAsync(
        () => {
          console.log('✅ Speech recognition started successfully');
          this.isListening = true;
          this.emitEvent('stateChanged', { isListening: true });
        },
        (error) => {
          console.error('❌ Failed to start recognition:', error);
          this.isListening = false;
          this.emitEvent('recognitionError', { error: error.message });
          throw new Error(`Failed to start recognition: ${error}`);
        }
      );

    } catch (error) {
      console.error('❌ Error starting recognition:', error);
      this.isListening = false;
      this.emitEvent('recognitionError', { error: error.message });
      throw error;
    }
  }

  public async pauseListening(): Promise<void> {
    if (!this.recognizer || !this.isListening) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      try {
        console.log('⏸️ Pausing speech recognition...');
        
        this.recognizer!.stopContinuousRecognitionAsync(
          () => {
            console.log('✅ Speech recognition paused');
            resolve();
          },
          (error) => {
            console.error('❌ Error pausing recognition:', error);
            this.emitEvent('recognitionError', { error: error.message });
            reject(error);
          }
        );
      } catch (error) {
        console.error('❌ Error in pauseListening:', error);
        reject(error);
      }
    });
  }

  public async resumeListening(): Promise<void> {
    if (!this.recognizer || !this.onResultCallback) {
      return;
    }

    return new Promise<void>((resolve, reject) => {
      try {
        console.log('▶️ Resuming speech recognition...');
        
        this.recognizer!.startContinuousRecognitionAsync(
          () => {
            console.log('✅ Speech recognition resumed');
            this.isListening = true;
            this.emitEvent('stateChanged', { isListening: true });
            resolve();
          },
          (error) => {
            console.error('❌ Error resuming recognition:', error);
            this.emitEvent('recognitionError', { error: error.message });
            reject(error);
          }
        );
      } catch (error) {
        console.error('❌ Error in resumeListening:', error);
        reject(error);
      }
    });
  }

  public stopListening(): void {
    console.log('🛑 Stopping speech recognition...');
    
    if (this.recognizer && this.isListening) {
      try {
        this.recognizer.stopContinuousRecognitionAsync(
          () => {
            console.log('✅ Recognition stopped successfully');
            if (this.recognizer) {
              this.recognizer.close();
              this.recognizer = null;
            }
            this.isListening = false;
            this.emitEvent('recognitionStopped', {});
            this.emitEvent('stateChanged', { isListening: false });
          },
          (error) => {
            console.error('❌ Error stopping recognition:', error);
            this.cleanup();
          }
        );
      } catch (error) {
        console.error('❌ Exception stopping recognition:', error);
        this.cleanup();
      }
    } else {
      this.cleanup();
    }
    
    this.onResultCallback = null;
  }

  private cleanup(): void {
    if (this.recognizer) {
      this.recognizer.close();
      this.recognizer = null;
    }
    this.isListening = false;
    this.emitEvent('stateChanged', { isListening: false });
  }

  // Utility Methods
  public async startListeningWhenReady(onResult: (text: string, result?: RecognitionResult) => void): Promise<void> {
    console.log('🎤 Preparing to start listening when ready...');
    
    while (this.isSpeaking) {
      console.log('⏳ Waiting for speech to complete...');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('🎤 Starting listening now');
    await this.startListening(onResult);
  }

  public getStatus(): {
    isListening: boolean;
    isSpeaking: boolean;
    microphonePermission: boolean;
    queueLength: number;
    currentMessage: SpeechMessage | null;
  } {
    return {
      isListening: this.isListening,
      isSpeaking: this.isSpeaking,
      microphonePermission: this.microphonePermissionGranted,
      queueLength: this.messageQueue.length,
      currentMessage: this.currentMessage
    };
  }

  public getMessageHistory(): SpeechMessage[] {
    return [...this.messageHistory];
  }

  public getRecognitionHistory(): RecognitionResult[] {
    return [...this.recognitionHistory];
  }

  public clearHistory(): void {
    this.messageHistory = [];
    this.recognitionHistory = [];
    console.log('🧹 History cleared');
  }

  public forceStop(): void {
    console.log('🛑 Force stopping all operations');
    
    if (this.currentSynthesizer) {
      try {
        this.currentSynthesizer.close();
      } catch (error) {
        console.error('Error closing synthesizer:', error);
      }
      this.currentSynthesizer = null;
    }
    
    this.stopListening();
    this.isSpeaking = false;
    this.emitEvent('stateChanged', { isSpeaking: false, isListening: false });
  }

  public dispose(): void {
    console.log('🧹 Disposing speech service');
    this.forceStop();
    
    // Clear all event listeners
    this.eventListeners.clear();
    
    if (this.speechConfig) {
      try {
        this.speechConfig.close();
      } catch (error) {
        console.error('Error closing speech config:', error);
      }
      this.speechConfig = null;
    }
    
    // Clear queues and history
    this.messageQueue = [];
    this.messageHistory = [];
    this.recognitionHistory = [];
    this.currentMessage = null;
    this.onResultCallback = null;
  }

  public isInitialized(): boolean {
    return this.speechConfig !== null;
  }

  public async testMicrophone(): Promise<boolean> {
    console.log('🎤 Testing microphone access...');
    return await this.checkMicrophonePermission();
  }

  public reset(): void {
    console.log('🔄 Resetting speech service state');
    this.forceStop();
    this.microphonePermissionGranted = false;
    this.clearHistory();
  }

  // Advanced message text functionality
  public async speakWithCallback(
    text: string, 
    label: string = "",
    onStart?: () => void,
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      if (onStart) onStart();
      await this.speak(text, label);
      if (onComplete) onComplete();
    } catch (error) {
      if (onError) onError(error as Error);
      throw error;
    }
  }

  public getQueuedMessages(): SpeechMessage[] {
    return [...this.messageQueue];
  }

  public clearQueue(): void {
    this.messageQueue = [];
    console.log('🧹 Speech queue cleared');
  }
}

// Create and export instance
const speechService = new SpeechService();
export default speechService;
export { speechService, SpeechService };
export type { EventListener, RecognitionResult, SpeechEvent, SpeechEventType, SpeechMessage };