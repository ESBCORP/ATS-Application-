import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  MessageSquare, 
  Loader,
  ArrowLeft,
  Play,
  Pause,
  Volume2,
  VolumeX,
  User,
  Bot
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { speechService } from '../../services/speechService';
import { anthropicService } from '../../services/anthropicService';

interface InterviewTemplate {
  id: number;
  name: string;
  description: string;
  jobId: string;
  jobTitle: string;
  aiInterviewer: string;
  aiVoice: string;
  duration: number;
  maxResponseTime: number;
  questions: {
    id: string;
    question: string;
    expectedKeywords: string[];
    followUp: string;
  }[];
  introScript: string;
  outroScript: string;
  active: boolean;
  usageCount: number;
}

const VideoPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<InterviewTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 for intro
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isProcessingResponse, setIsProcessingResponse] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'AI' | 'USER' }>>([]);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [currentUserResponse, setCurrentUserResponse] = useState('');
  const recognitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [lastSpeechTimestamp, setLastSpeechTimestamp] = useState<number>(0);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // 🔥 NEW: Enhanced state management to prevent race conditions
  const [responseProcessingId, setResponseProcessingId] = useState<string | null>(null);
  const [aiState, setAiState] = useState<'idle' | 'thinking' | 'speaking'>('idle');
  const [userState, setUserState] = useState<'idle' | 'thinking' | 'speaking'>('idle');
  const [lastProcessedResponse, setLastProcessedResponse] = useState<string>('');
  const [showContinuePrompt, setShowContinuePrompt] = useState(false);
  const [speechLockUntil, setSpeechLockUntil] = useState<number>(0);
  const [pendingUserResponses, setPendingUserResponses] = useState<string[]>([]);

  // Hardcoded template for preview
  const demoTemplate: InterviewTemplate = {
    id: 1,
    name: 'Standard Technical Interview',
    description: 'A general technical interview for software engineering positions',
    jobId: 'OOJ-4361',
    jobTitle: 'Salesforce Developer',
    aiInterviewer: 'Jack',
    aiVoice: 'en-US-GuyNeural',
    duration: 30,
    maxResponseTime: 120,
    questions: [
      {
        id: 'q1',
        question: 'Can you explain your experience with Salesforce development?',
        expectedKeywords: ['apex', 'lightning', 'visualforce', 'triggers', 'flows'],
        followUp: 'What was the most complex Salesforce solution you\'ve implemented?'
      },
      {
        id: 'q2',
        question: 'How do you approach testing in Salesforce?',
        expectedKeywords: ['unit tests', 'test coverage', 'test class', 'assertions'],
        followUp: 'Can you describe a situation where thorough testing prevented a production issue?'
      },
      {
        id: 'q3',
        question: 'What experience do you have with Salesforce integrations?',
        expectedKeywords: ['api', 'rest', 'soap', 'middleware', 'mulesoft'],
        followUp: 'What challenges did you face during integration projects?'
      }
    ],
    introScript: 'Hello, I\'m Jack, your AI interviewer today. I\'ll be asking you some questions about your experience with Salesforce development. Please take your time to answer thoroughly.',
    outroScript: 'Thank you for participating in this interview. Your responses have been recorded and will be reviewed by our hiring team. We appreciate your time and interest in the position.',
    active: true,
    usageCount: 42
  };

  useEffect(() => {
    const loadTemplate = async () => {
      try {
        setLoading(true);
        setTemplate(demoTemplate);
        
        setMessages([{
          text: demoTemplate.introScript,
          sender: 'AI'
        }]);
        
        setConversationHistory([{
          role: 'assistant',
          content: demoTemplate.introScript
        }]);
        
      } catch (err) {
        setError('Failed to load interview template');
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [id]);

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Failed to access camera and microphone. Please ensure you have granted the necessary permissions.');
      }
    };

    initializeMedia();

    return () => {
      if (localVideoRef.current?.srcObject) {
        const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      speechService.stopListening();
      
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🔥 ENHANCED: Better silence detection with longer timeout
  useEffect(() => {
    if (isUserSpeaking && lastSpeechTimestamp > 0) {
      const silenceCheckInterval = setInterval(() => {
        const now = Date.now();
        const silenceDuration = now - lastSpeechTimestamp;
        
        // Increased to 7 seconds for natural thinking pauses
        // Only process if we're not locked and have a meaningful response
        if (silenceDuration > 7000 && 
            !responseProcessingId && 
            !isAISpeaking &&
            !isProcessingResponse &&
            currentUserResponse && 
            currentUserResponse.length > 3 &&
            now > speechLockUntil) {
          
          clearInterval(silenceCheckInterval);
          console.log(`🔊 Silence detected for ${silenceDuration}ms - completing response`);
          addDebugInfo(`🔊 Silence detected (${silenceDuration}ms) - completing: "${currentUserResponse.substring(0, 30)}..."`);
          
          setIsUserSpeaking(false);
          setUserState('idle');
          
          // Create processing lock
          const processingId = `response_${Date.now()}`;
          setResponseProcessingId(processingId);
          
          // Lock speech processing for 10 seconds to prevent race conditions
          setSpeechLockUntil(now + 10000);
          
          handleUserResponseComplete(currentUserResponse, processingId);
        }
      }, 1000);
      
      return () => clearInterval(silenceCheckInterval);
    }
  }, [isUserSpeaking, lastSpeechTimestamp, currentUserResponse, responseProcessingId, speechLockUntil, isAISpeaking, isProcessingResponse]);

  const toggleMute = () => {
    if (localVideoRef.current?.srcObject) {
      const audioTrack = (localVideoRef.current.srcObject as MediaStream)
        .getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const videoTrack = (localVideoRef.current.srcObject as MediaStream)
        .getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOn(!isVideoOn);
    }
  };

  // 🔥 ENHANCED: Speech recognition with strict controls
  const startInterview = async () => {
    setIsInterviewStarted(true);
    setIsPlaying(true);
    addDebugInfo("🚀 Starting interview");

    speechService.startListening((text) => {
      const now = Date.now();
      
      // VERY strict conditions for processing speech
      if (text.trim() && 
          text.trim().length > 3 &&
          !responseProcessingId && 
          !isAISpeaking && 
          !isProcessingResponse &&
          aiState === 'idle' &&
          now > speechLockUntil) {
        
        // If we already have a response and this is significantly different, save it for later
        if (currentUserResponse && 
            currentUserResponse.length > 10 && 
            !text.toLowerCase().includes(currentUserResponse.toLowerCase().substring(0, 10))) {
          
          addDebugInfo(`🔄 Different topic detected - saving for later: "${text.substring(0, 30)}..."`);
          setPendingUserResponses(prev => [...prev, text.trim()]);
          return; // Don't process now, save for later
        }
        
        setIsUserSpeaking(true);
        setUserState('speaking');
        setCurrentUserResponse(text.trim());
        setLastSpeechTimestamp(now);
        addDebugInfo(`🎤 Speech accepted: "${text.substring(0, 30)}..."`);
        
        // Clear any existing timeout
        if (recognitionTimeoutRef.current) {
          clearTimeout(recognitionTimeoutRef.current);
        }
        
        // Set timeout for silence detection - increased to 7 seconds
        recognitionTimeoutRef.current = setTimeout(() => {
          if (!responseProcessingId && 
              !isAISpeaking && 
              !isProcessingResponse &&
              now > speechLockUntil) {
            addDebugInfo("⏱️ Speech timeout triggered");
            setIsUserSpeaking(false);
            setUserState('idle');
            
            const processingId = `response_${Date.now()}`;
            setResponseProcessingId(processingId);
            setSpeechLockUntil(Date.now() + 10000);
            
            handleUserResponseComplete(text.trim(), processingId);
          }
        }, 7000); // Increased to 7 seconds
        
      } else {
        // More detailed rejection logging
        if (responseProcessingId) {
          addDebugInfo(`⚠️ Speech rejected - processing ID: ${responseProcessingId}`);
        } else if (isAISpeaking) {
          addDebugInfo("⚠️ Speech rejected - AI is speaking");
        } else if (isProcessingResponse) {
          addDebugInfo("⚠️ Speech rejected - AI is processing");
        } else if (aiState !== 'idle') {
          addDebugInfo(`⚠️ Speech rejected - AI state: ${aiState}`);
        } else if (now <= speechLockUntil) {
          addDebugInfo(`⚠️ Speech rejected - locked until ${new Date(speechLockUntil).toLocaleTimeString()}`);
        } else if (text.trim().length <= 3) {
          addDebugInfo(`⚠️ Speech rejected - too short: "${text.trim()}"`);
        } else {
          addDebugInfo(`⚠️ Speech rejected - unknown reason: "${text.substring(0, 20)}..."`);
        }
      }
    });

    // Speak the intro
    try {
      setIsAISpeaking(true);
      setAiState('speaking');
      addDebugInfo("🗣️ Speaking intro");
      await speechService.speak(template?.introScript || '');
      addDebugInfo("✅ Intro complete");
      setIsAISpeaking(false);
      setAiState('idle');
      
      // Move to first question after intro
      setTimeout(() => {
        askNextQuestion();
      }, 1000);
      
    } catch (err) {
      console.error('Failed to speak intro:', err);
      setIsAISpeaking(false);
      setAiState('idle');
    }
  };

  // 🔥 ENHANCED: Response completion with better transcript handling
  const handleUserResponseComplete = (finalResponse: string, processingId: string) => {
    addDebugInfo(`✅ handleUserResponseComplete [${processingId}]: "${finalResponse.substring(0, 30)}..."`);
    
    // Check for duplicate or too similar responses
    if (finalResponse === lastProcessedResponse || 
        (lastProcessedResponse && finalResponse.includes(lastProcessedResponse)) ||
        (lastProcessedResponse && lastProcessedResponse.includes(finalResponse))) {
      addDebugInfo("⚠️ Duplicate/similar response detected - ignoring");
      setResponseProcessingId(null);
      setCurrentUserResponse('');
      // Process any pending responses
      processPendingResponses();
      return;
    }
    
    setLastProcessedResponse(finalResponse);
    
    // Add to transcript - this ensures it shows up
    setMessages(prev => [...prev, {
      text: finalResponse,
      sender: 'USER' as const
    }]);
    
    // Update conversation history
    const newHistory = [...conversationHistory, {
      role: 'user' as const,
      content: finalResponse
    }];
    
    setConversationHistory(newHistory);
    setCurrentUserResponse('');
    
    // Process with AI
    processResponseWithAI(finalResponse, newHistory, processingId);
  };

  // 🔥 NEW: Process pending responses after current one is complete
  const processPendingResponses = () => {
    if (pendingUserResponses.length > 0) {
      const nextResponse = pendingUserResponses[0];
      setPendingUserResponses(prev => prev.slice(1));
      
      setTimeout(() => {
        if (!responseProcessingId && !isAISpeaking && !isProcessingResponse) {
          addDebugInfo(`📋 Processing pending response: "${nextResponse.substring(0, 30)}..."`);
          const processingId = `response_${Date.now()}`;
          setResponseProcessingId(processingId);
          setSpeechLockUntil(Date.now() + 10000);
          handleUserResponseComplete(nextResponse, processingId);
        }
      }, 2000);
    }
  };

  // 🔥 ENHANCED: AI processing with better state management
  const processResponseWithAI = async (
    userResponse: string, 
    newHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
    processingId: string
  ) => {
    if (!template) return;
    
    addDebugInfo(`🤖 processResponseWithAI [${processingId}]: "${userResponse.substring(0, 30)}..."`);
    
    setIsProcessingResponse(true);
    setAiState('thinking');
    
    try {
      const currentQuestion = currentQuestionIndex >= 0 && currentQuestionIndex < template.questions.length
        ? template.questions[currentQuestionIndex]
        : null;
      
      const systemPrompt = currentQuestion
        ? `
You are Jack, a human interviewer. Keep responses under 15 words.

Question: "${currentQuestion.question}"
Keywords: ${currentQuestion.expectedKeywords.join(', ')}

Rules:
- Maximum 15 words per response
- Sound natural and human
- One simple follow-up question only
- No "Thank you" or "I see" starts

Examples:
- "Nice! Tell me more about that."
- "Interesting. What challenges did you face?"
- "Good. How did you solve it?"
- "Cool. What was your role?"
`
        : `You are Jack, a human interviewer. Keep responses under 15 words. Be natural and ask simple follow-up questions.`;

      const aiResponse = await anthropicService.generateResponse(newHistory, systemPrompt);
      
      addDebugInfo(`🤖 AI response [${processingId}]: "${aiResponse.substring(0, 30)}..."`);
      
      // Update messages (AI response only, user message already added)
      setMessages(prev => [...prev, {
        text: aiResponse,
        sender: 'AI' as const
      }]);
      
      const updatedHistory = [...newHistory, {
        role: 'assistant' as const,
        content: aiResponse
      }];
      
      setConversationHistory(updatedHistory);
      
      // Speak AI response
      try {
        setIsAISpeaking(true);
        setAiState('speaking');
        addDebugInfo(`🗣️ Speaking AI response [${processingId}]`);
        await speechService.speak(aiResponse);
        addDebugInfo(`✅ AI speech complete [${processingId}]`);
        
        setAiState('idle');
        setShowContinuePrompt(true);
        
        // Auto-progress after delay
        setTimeout(() => {
          setShowContinuePrompt(false);
          addDebugInfo("⏭️ Auto-progressing to next question");
          askNextQuestion();
        }, 3000);
        
      } catch (err) {
        console.error('Failed to speak AI response:', err);
        setAiState('idle');
      } finally {
        setIsAISpeaking(false);
        setResponseProcessingId(null);
        setIsProcessingResponse(false);
        
        // Process any pending responses
        processPendingResponses();
      }
      
    } catch (error) {
      console.error('Error processing response with AI:', error);
      addDebugInfo(`❌ AI processing error [${processingId}]`);
      
      const fallbackResponse = "Tell me more about that.";
      
      setMessages(prev => [...prev, {
        text: fallbackResponse,
        sender: 'AI' as const
      }]);
      
      const updatedHistory = [...newHistory, {
        role: 'assistant' as const,
        content: fallbackResponse
      }];
      
      setConversationHistory(updatedHistory);
      
      try {
        setIsAISpeaking(true);
        setAiState('speaking');
        await speechService.speak(fallbackResponse);
        
        setTimeout(() => {
          askNextQuestion();
        }, 2000);
        
      } catch (err) {
        console.error('Failed to speak fallback response:', err);
      } finally {
        setIsAISpeaking(false);
        setAiState('idle');
        setResponseProcessingId(null);
        setIsProcessingResponse(false);
        
        // Process any pending responses
        processPendingResponses();
      }
    }
  };

  const askNextQuestion = async () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (template && nextIndex < template.questions.length) {
      setCurrentQuestionIndex(nextIndex);
      
      const question = template.questions[nextIndex].question;
      setMessages(prev => [...prev, {
        text: question,
        sender: 'AI'
      }]);
      
      setConversationHistory(prev => [...prev, {
        role: 'assistant',
        content: question
      }]);

      try {
        setIsAISpeaking(true);
        setAiState('speaking');
        addDebugInfo(`🗣️ Speaking question ${nextIndex + 1}`);
        await speechService.speak(question);
        addDebugInfo(`✅ Question ${nextIndex + 1} complete`);
        setIsAISpeaking(false);
        setAiState('idle');
      } catch (err) {
        console.error('Failed to speak question:', err);
        setIsAISpeaking(false);
        setAiState('idle');
      }
    } else if (template) {
      setCurrentQuestionIndex(template.questions.length);
      
      setMessages(prev => [...prev, {
        text: template.outroScript,
        sender: 'AI'
      }]);
      
      setConversationHistory(prev => [...prev, {
        role: 'assistant',
        content: template.outroScript
      }]);

      try {
        setIsAISpeaking(true);
        setAiState('speaking');
        addDebugInfo("🗣️ Speaking outro");
        await speechService.speak(template.outroScript);
        addDebugInfo("✅ Interview complete");
        setIsAISpeaking(false);
        setAiState('idle');
        setIsPlaying(false);
      } catch (err) {
        console.error('Failed to speak outro:', err);
        setIsAISpeaking(false);
        setAiState('idle');
        setIsPlaying(false);
      }
    }
  };

  const togglePlayPause = () => {
    if (!isInterviewStarted) {
      startInterview();
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const addDebugInfo = (info: string) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${timestamp}: ${info}`);
    setDebugInfo(prev => [...prev.slice(-20), `${timestamp}: ${info}`]); // Keep last 20 entries
  };

  // 🔥 NEW: Status indicator component
  const StatusIndicator = () => (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* User Status */}
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">You:</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              userState === 'speaking' 
                ? 'bg-blue-100 text-blue-800' 
                : userState === 'thinking'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {userState === 'speaking' ? 'Speaking' : 
               userState === 'thinking' ? 'Thinking' : 'Listening'}
            </span>
            {responseProcessingId && (
              <span className="text-xs text-red-600">[LOCKED]</span>
            )}
            {pendingUserResponses.length > 0 && (
              <span className="text-xs text-orange-600">[{pendingUserResponses.length} PENDING]</span>
            )}
          </div>
          
          {/* AI Status */}
          <div className="flex items-center space-x-2">
            <Bot className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">Jack:</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              aiState === 'speaking' 
                ? 'bg-green-100 text-green-800' 
                : aiState === 'thinking'
                ? 'bg-purple-100 text-purple-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {aiState === 'speaking' ? 'Speaking' : 
               aiState === 'thinking' ? 'Thinking...' : 'Listening'}
            </span>
          </div>
        </div>
        
        {/* Continue Prompt */}
        {showContinuePrompt && (
          <div className="text-xs text-blue-600 flex items-center">
            <span>Moving to next question in 3s...</span>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => {
                setShowContinuePrompt(false);
                askNextQuestion();
              }}
              className="ml-2"
            >
              Continue Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          {error}
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          Interview template not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={() => navigate('/settings/video')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Settings
            </Button>
            <h1 className="text-2xl font-bold">Preview: {template.name}</h1>
          </div>
          <Button
            variant="outline"
            onClick={() => setDebugInfo([])}
          >
            Clear Debug Log
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* AI Interviewer - Full Screen */}
          <div className="col-span-2 space-y-6">
            {/* Status Indicator */}
            <StatusIndicator />
            
            <div className="relative rounded-lg bg-gradient-to-br from-blue-900 to-blue-800 overflow-hidden aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="mb-4 w-24 h-24 rounded-full bg-blue-700 mx-auto flex items-center justify-center">
                    <Bot className="h-12 w-12 text-white" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{template.aiInterviewer}</div>
                  <div className="text-lg opacity-80">
                    {aiState === 'speaking' ? 'Speaking...' : 
                     aiState === 'thinking' ? 'Thinking...' : 
                     'AI Interviewer'}
                  </div>
                  
                  {/* Thinking Animation */}
                  {aiState === 'thinking' && (
                    <div className="mt-2 flex justify-center space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Candidate Video (Picture-in-Picture) */}
              <div className="absolute bottom-4 right-4 w-1/4 aspect-video rounded-lg overflow-hidden border-2 border-white shadow-lg">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
                
                {/* Speech indicator */}
                {isUserSpeaking && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs flex items-center">
                    <Mic className="h-3 w-3 mr-1 animate-pulse" />
                    Speaking
                  </div>
                )}
              </div>
            </div>

            {/* Current Question */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Question</h2>
              {currentQuestionIndex >= 0 && currentQuestionIndex < template.questions.length ? (
                <div className="space-y-4">
                  <p className="text-gray-800 text-xl font-medium">
                    {template.questions[currentQuestionIndex].question}
                  </p>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <p className="text-sm text-blue-800 font-medium">Expected Keywords:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {template.questions[currentQuestionIndex].expectedKeywords.map((keyword, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  {template.questions[currentQuestionIndex].followUp && (
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-800 font-medium">Follow-up Question:</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {template.questions[currentQuestionIndex].followUp}
                      </p>
                    </div>
                  )}
                </div>
              ) : currentQuestionIndex === -1 ? (
                <div className="space-y-4">
                  <p className="text-gray-800 text-xl">
                    {template.introScript}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-800 text-xl">
                    {template.outroScript}
                  </p>
                  <div className="flex justify-end">
                    <Button onClick={() => navigate('/settings/video')}>
                      Finish Preview
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interview Panel */}
          <div className="space-y-6">
            {/* Interview Controls */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Interview Controls</h2>
              <div className="flex flex-col items-center">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-600 mb-2">
                    {!isInterviewStarted 
                      ? 'Click play to start the interview' 
                      : isPlaying 
                        ? 'Interview in progress' 
                        : 'Interview paused'}
                  </p>
                  <div className="text-3xl font-bold">
                    {currentQuestionIndex === -1 
                      ? 'Introduction' 
                      : currentQuestionIndex >= template.questions.length 
                        ? 'Conclusion' 
                        : `Question ${currentQuestionIndex + 1}/${template.questions.length}`}
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <Button
                    onClick={togglePlayPause}
                    variant="primary"
                    className="rounded-full p-4 w-16 h-16 flex items-center justify-center"
                  >
                    {!isPlaying ? <Play className="h-8 w-8" /> : <Pause className="h-8 w-8" />}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleMute}
                    className="flex items-center"
                  >
                    {isMuted ? <MicOff className="h-4 w-4 mr-1" /> : <Mic className="h-4 w-4 mr-1" />}
                    {isMuted ? 'Unmute' : 'Mute'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {}}
                    className="flex items-center"
                  >
                    <Volume2 className="h-4 w-4 mr-1" />
                    AI Volume
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleVideo}
                    className="flex items-center"
                  >
                    {isVideoOn ? <Video className="h-4 w-4 mr-1" /> : <VideoOff className="h-4 w-4 mr-1" />}
                    {isVideoOn ? 'Hide Video' : 'Show Video'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Current Response */}
            {currentUserResponse && (
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Mic className="h-5 w-5 mr-2 text-blue-600 animate-pulse" />
                  Your Current Response
                </h2>
                <p className="text-gray-800 italic">"{currentUserResponse}"</p>
                <p className="text-xs text-gray-500 mt-2">
                  {isUserSpeaking 
                    ? "Speaking... (will complete after 4 seconds of silence)" 
                    : "Processing response..."}
                </p>
              </div>
            )}

            {/* Chat/Transcript */}
            <div className="rounded-lg bg-white p-6 shadow-md h-[300px] flex flex-col">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Interview Transcript
              </h2>
              <div className="flex-1 overflow-y-auto space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.sender === 'AI'
                        ? 'bg-blue-50 text-blue-900'
                        : 'bg-gray-50 text-gray-900'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">
                      {message.sender === 'AI' ? template.aiInterviewer : 'You'}
                    </div>
                    <div>{message.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Debug Info */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                Debug Information
              </h2>
              <div className="h-[200px] overflow-y-auto bg-gray-50 p-3 rounded text-xs font-mono">
                {debugInfo.length === 0 ? (
                  <p className="text-gray-500">No debug information yet</p>
                ) : (
                  debugInfo.map((info, index) => (
                    <div key={index} className="mb-1">{info}</div>
                  ))
                )}
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <p>Speech Status: {isUserSpeaking ? "Speaking" : "Not Speaking"}</p>
                <p>Processing ID: {responseProcessingId || "None"}</p>
                <p>Speech Lock Until: {speechLockUntil > Date.now() ? new Date(speechLockUntil).toLocaleTimeString() : "Unlocked"}</p>
                <p>AI State: {aiState}</p>
                <p>Pending Responses: {pendingUserResponses.length}</p>
                <p>Last Speech: {lastSpeechTimestamp ? new Date(lastSpeechTimestamp).toLocaleTimeString() : "None"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPreview;
