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
import Chatbot from '../../components/ui/Chatbot';

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
        // In a real app, you would fetch the template from an API
        // For now, we'll use the demo template
        setTemplate(demoTemplate);
        
        // Add intro message
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
      // Stop speech recognition when component unmounts
      speechService.stopListening();
      
      // Clear any pending timeouts
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Check for speech silence
  useEffect(() => {
    if (isUserSpeaking && lastSpeechTimestamp > 0) {
      const silenceCheckInterval = setInterval(() => {
        const now = Date.now();
        const silenceDuration = now - lastSpeechTimestamp;
        
        // If silence for more than 4 seconds, consider speech done
        if (silenceDuration > 4000) {
          clearInterval(silenceCheckInterval);
          if (isUserSpeaking) {
            console.log(`🔊 Silence detected for ${silenceDuration}ms - completing response`);
            setIsUserSpeaking(false);
            if (currentUserResponse) {
              handleUserResponseComplete(currentUserResponse);
            }
          }
        }
      }, 1000);
      
      return () => clearInterval(silenceCheckInterval);
    }
  }, [isUserSpeaking, lastSpeechTimestamp, currentUserResponse]);

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

  const startInterview = async () => {
    setIsInterviewStarted(true);
    setIsPlaying(true);
    addDebugInfo("🚀 Starting interview");

    // Start listening for candidate responses with continuous updates
    speechService.startListening((text) => {
      if (text.trim()) {
        setIsUserSpeaking(true);
        setCurrentUserResponse(text.trim());
        setLastSpeechTimestamp(Date.now());
        addDebugInfo(`🎤 Speech detected: "${text.substring(0, 30)}..."`);
        
        // Reset the timeout each time we get new speech
        if (recognitionTimeoutRef.current) {
          clearTimeout(recognitionTimeoutRef.current);
          addDebugInfo("⏱️ Reset speech timeout");
        }
        
        // Set a timeout to consider the speech "done" after 4 seconds of silence
        recognitionTimeoutRef.current = setTimeout(() => {
          addDebugInfo("⏱️ Speech timeout triggered");
          setIsUserSpeaking(false);
          handleUserResponseComplete(text.trim());
        }, 4000);
      }
    });

    // Speak the intro
    try {
      setIsAISpeaking(true);
      await speechService.speak(template?.introScript || '');
      setIsAISpeaking(false);
      
      // Move to first question after intro
      setTimeout(() => {
        askNextQuestion();
      }, 1000);
      
    } catch (err) {
      console.error('Failed to speak intro:', err);
      setIsAISpeaking(false);
    }
  };

  const handleUserResponseComplete = (finalResponse: string) => {
    console.log("🎤 handleUserResponseComplete called with response:", finalResponse);
    addDebugInfo(`✅ Response complete: "${finalResponse.substring(0, 30)}..."`);
    
    // Create new arrays for messages and conversation history
    const newMessages = [...messages, {
      text: finalResponse,
      sender: 'USER'
    }];
    
    const newHistory = [...conversationHistory, {
      role: 'user',
      content: finalResponse
    }];
    
    // Update state
    setMessages(newMessages);
    setConversationHistory(newHistory);
    
    // Clear the current response
    setCurrentUserResponse('');
    
    // Process the response with Anthropic - passing the new history directly
    processResponseWithAI(finalResponse, newHistory);
  };

  const processResponseWithAI = async (userResponse: string, newHistory: Array<{ role: 'user' | 'assistant'; content: string }>) => {
    if (!template) return;
    
    console.log("🤖 processResponseWithAI called with response:", userResponse);
    console.log("💬 Processing with conversation history:", JSON.stringify(newHistory));
    addDebugInfo("🤖 Processing response with AI");
    
    setIsProcessingResponse(true);
    
    try {
      // Create system prompt based on current question
      const currentQuestion = currentQuestionIndex >= 0 && currentQuestionIndex < template.questions.length
        ? template.questions[currentQuestionIndex]
        : null;
      
      const systemPrompt = currentQuestion
        ? `
You are ${template.aiInterviewer}, an AI technical interviewer for a ${template.jobTitle} position.
You're conducting a supportive video interview with a candidate.

Current question: "${currentQuestion.question}"
Key topics to explore: ${currentQuestion.expectedKeywords.join(', ')}

Your approach:
1. Listen actively to the candidate's response and help them showcase their knowledge
2. If their answer seems incomplete, guide them with encouraging follow-up questions
3. When they mention interesting points, invite them to elaborate and share more details
4. If there are technical gaps, help them think through the concepts collaboratively
5. Be genuinely curious about their thought process and experience
6. Create a comfortable environment where they feel safe to think out loud
7. Keep responses under 75 words and maintain a conversational tone
8. Focus on understanding their reasoning rather than just checking boxes
9. NEVER start with "I noticed your response" or "Thank you for your response"
10. Use encouraging language that invites deeper discussion

Response strategies:
- If their answer is brief: "That's a good start! Can you walk me through your thinking on [specific aspect]?"
- If they mention something technical: "Interesting approach! How would you handle [related scenario]?"
- If concepts are missing: "I'd love to hear your thoughts on [missing concept] in this context"
- If there's a misunderstanding: "Let's explore that together - what's your understanding of [concept]?"

Goal: Help the candidate demonstrate their best technical thinking while accurately assessing their skills.
`
        : `You are ${template.aiInterviewer}, an AI interviewer focused on helping candidates showcase their abilities. Be supportive and encouraging while maintaining technical standards. Guide them to deeper thinking through curiosity rather than confrontation. NEVER start responses with "I noticed your response" or similar phrases.`;

      // Get AI response
      const aiResponse = await anthropicService.generateResponse(
        newHistory,
        systemPrompt
      );
      
      addDebugInfo(`🤖 AI response received: "${aiResponse.substring(0, 30)}..."`);
      
      // Add AI response to messages and conversation history
      const updatedMessages = [...messages, {
        text: userResponse,
        sender: 'USER'
      }, {
        text: aiResponse,
        sender: 'AI'
      }];
      
      setMessages(updatedMessages);
      
      const updatedHistory = [...newHistory, {
        role: 'assistant',
        content: aiResponse
      }];
      
      setConversationHistory(updatedHistory);
      
      // Speak the AI response
      try {
        setIsAISpeaking(true);
        await speechService.speak(aiResponse);
      } catch (err) {
        console.error('Failed to speak AI response:', err);
      } finally {
        setIsAISpeaking(false);
      }
      
    } catch (error) {
      console.error('Error processing response with AI:', error);
      addDebugInfo("❌ Error processing with AI, using fallback");
      
      // Add fallback response if AI processing fails
      const fallbackResponse = "Could you elaborate more on the technical aspects of your work?";
      
      const updatedMessages = [...messages, {
        text: userResponse,
        sender: 'USER'
      }, {
        text: fallbackResponse,
        sender: 'AI'
      }];
      
      setMessages(updatedMessages);
      
      const updatedHistory = [...newHistory, {
        role: 'assistant',
        content: fallbackResponse
      }];
      
      setConversationHistory(updatedHistory);
      
      // Speak the fallback response
      try {
        setIsAISpeaking(true);
        await speechService.speak(fallbackResponse);
      } catch (err) {
        console.error('Failed to speak fallback response:', err);
      } finally {
        setIsAISpeaking(false);
      }
      
    } finally {
      setIsProcessingResponse(false);
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

      // Speak the question
      try {
        setIsAISpeaking(true);
        await speechService.speak(question);
        setIsAISpeaking(false);
      } catch (err) {
        console.error('Failed to speak question:', err);
        setIsAISpeaking(false);
      }
    } else if (template) {
      // End of interview, speak outro
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
        await speechService.speak(template.outroScript);
        setIsAISpeaking(false);
        setIsPlaying(false);
      } catch (err) {
        console.error('Failed to speak outro:', err);
        setIsAISpeaking(false);
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
    console.log(info);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

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
            <div className="relative rounded-lg bg-gradient-to-br from-blue-900 to-blue-800 overflow-hidden aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="mb-4 w-24 h-24 rounded-full bg-blue-700 mx-auto flex items-center justify-center">
                    <Bot className="h-12 w-12 text-white" />
                  </div>
                  <div className="text-4xl font-bold mb-2">{template.aiInterviewer}</div>
                  <div className="text-lg opacity-80">
                    {isAISpeaking ? 'Speaking...' : isProcessingResponse ? 'Thinking...' : 'AI Interviewer'}
                  </div>
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
                  {isPlaying && !isAISpeaking && !isProcessingResponse && !isUserSpeaking && (
                    <div className="flex justify-end">
                      <Button 
                        onClick={askNextQuestion}
                      >
                        Next Question
                      </Button>
                    </div>
                  )}
                </div>
              ) : currentQuestionIndex === -1 ? (
                <div className="space-y-4">
                  <p className="text-gray-800 text-xl">
                    {template.introScript}
                  </p>
                  {isPlaying && !isAISpeaking && (
                    <div className="flex justify-end">
                      <Button onClick={askNextQuestion}>
                        Start Questions
                      </Button>
                    </div>
                  )}
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
                <p>Last Speech: {lastSpeechTimestamp ? new Date(lastSpeechTimestamp).toLocaleTimeString() : "None"}</p>
                <p>Silence Duration: {lastSpeechTimestamp ? `${(Date.now() - lastSpeechTimestamp) / 1000}s` : "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default VideoPreview;