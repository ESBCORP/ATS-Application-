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
  Bot,
  AlertTriangle,
  Eye,
  Clock,
  ExternalLink
} from 'lucide-react';
import { fetchJobById } from '../../services/jobsService';
import speechService from '../../services/speechService';
import { anthropicService } from '../../services/anthropicService';
import Button from '../../components/ui/Button';
import { Job } from '../../types';
import JobDetailsView from './JobDetailsView';
import Chatbot from '../../components/ui/Chatbot';

const VideoInterviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showJobDetails, setShowJobDetails] = useState(true);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [isUserSpeaking, setIsUserSpeaking] = useState(false);
  const [isProcessingResponse, setIsProcessingResponse] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [messages, setMessages] = useState<Array<{ text: string; sender: 'AI' | 'USER' }>>([]);
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [currentUserResponse, setCurrentUserResponse] = useState('');
  const recognitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [introCompleted, setIntroCompleted] = useState(false);

  // Monitoring features
  const [tabFocused, setTabFocused] = useState(true);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [suspiciousActivity, setSuspiciousActivity] = useState<string[]>([]);
  const [eyeTrackingEnabled, setEyeTrackingEnabled] = useState(false);
  const [eyeMovements, setEyeMovements] = useState<{timestamp: number, direction: string, duration: number}[]>([]);
  const [lastEyeCheck, setLastEyeCheck] = useState(Date.now());
  const [faceDetectionInterval, setFaceDetectionInterval] = useState<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showMonitoringPanel, setShowMonitoringPanel] = useState(false);
  const [cheatingScore, setCheatingScore] = useState(0);
  const [cheatingDetected, setCheatingDetected] = useState(false);
  const [lastTabVisibilityChange, setLastTabVisibilityChange] = useState(Date.now());
  const [tabVisibilityHistory, setTabVisibilityHistory] = useState<{timestamp: number, visible: boolean}[]>([]);
  const [interviewStartTime, setInterviewStartTime] = useState<number | null>(null);
  const [monitoringStats, setMonitoringStats] = useState({
    offScreenLookDuration: 0,
    tabSwitchDuration: 0,
    suspiciousEyeMovementCount: 0,
    rapidEyeMovementCount: 0
  });
  
  // Debug logging
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  
  // Call duration timer
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'connected' | 'ended'>('idle');
  const [callSid, setCallSid] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const loadJob = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const jobData = await fetchJobById(id);
        setJob(jobData);

        const greeting = `Hello! I'm JACK, your AI interviewer for the ${jobData.title} position at ${jobData.customer}. Before we begin, please take a moment to review the job details and ensure your camera and microphone are working properly. When you're ready, click "Start Interview" to begin.`;

        setMessages([{
          text: greeting,
          sender: 'AI'
        }]);

        setConversationHistory([{
          role: 'assistant',
          content: greeting
        }]);

        // Speak the greeting
        try {
          setIsAISpeaking(true);
          await speechService.speak(greeting, "Initial greeting");
          setIsAISpeaking(false);
        } catch (err) {
          console.error('Failed to speak greeting:', err);
          addDebugInfo(`❌ Failed to speak greeting: ${err instanceof Error ? err.message : 'Unknown error'}`);
          setIsAISpeaking(false);
        }
      } catch (err) {
        setError('Failed to load interview questions');
        addDebugInfo(`❌ Failed to load job: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [id]);

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        addDebugInfo("🎤 Requesting camera and microphone access...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          addDebugInfo("✅ Camera and microphone access granted");
        }
        
        // Initialize eye tracking after video is available
        if (canvasRef.current) {
          initializeEyeTracking();
        }
      } catch (err) {
        console.error('Failed to access camera and microphone:', err);
        setError('Failed to access camera and microphone. Please ensure you have granted the necessary permissions.');
        addDebugInfo(`❌ Media access error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    initializeMedia();

    // Set up tab visibility monitoring
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    
    // Set up keyboard event monitoring
    document.addEventListener('keydown', handleKeyDown);
    
    // Set up mouse monitoring for detecting if user moves outside the window
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      if (localVideoRef.current?.srcObject) {
        const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
      // Stop speech recognition when component unmounts
      speechService.stopListening();
      addDebugInfo("🛑 Speech recognition stopped (component unmounting)");
      
      // Clear any pending timeouts
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
      }
      
      // Clean up monitoring event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      
      // Clear face detection interval
      if (faceDetectionInterval) {
        clearInterval(faceDetectionInterval);
      }
      
      // End call if still active when navigating away
      if (callStatus === 'connected' && callSid) {
        handleEndCall();
      }
    };
  }, []);

  // Update cheating score based on monitoring stats
  useEffect(() => {
    if (!isInterviewStarted) return;
    
    // Calculate cheating score based on various factors
    let score = 0;
    
    // Tab switching penalties
    score += tabSwitchCount * 10;
    score += monitoringStats.tabSwitchDuration / 1000; // 1 point per second
    
    // Eye movement penalties
    score += monitoringStats.suspiciousEyeMovementCount * 5;
    score += monitoringStats.rapidEyeMovementCount * 3;
    score += monitoringStats.offScreenLookDuration / 1000 * 2; // 2 points per second
    
    // Set cheating detected if score exceeds threshold
    const isCheating = score > 30;
    
    setCheatingScore(score);
    setCheatingDetected(isCheating);
    
    // Log severe cheating attempts
    if (isCheating && !cheatingDetected) {
      addSuspiciousActivity(`⚠️ CHEATING DETECTED - Score: ${score.toFixed(1)}`);
    }
  }, [monitoringStats, tabSwitchCount, isInterviewStarted]);

  // Call duration timer
  useEffect(() => {
    if (callStatus === 'connected') {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [callStatus]);

  const handleVisibilityChange = () => {
    const now = Date.now();
    const isVisible = !document.hidden;
    
    if (isInterviewStarted) {
      // Record tab visibility change
      setTabVisibilityHistory(prev => [...prev, {timestamp: now, visible: isVisible}]);
      
      // Update tab focus state
      setTabFocused(isVisible);
      
      if (!isVisible) {
        // Increment tab switch count when hiding tab
        setTabSwitchCount(prev => prev + 1);
        addSuspiciousActivity('Tab visibility changed - document hidden');
        setLastTabVisibilityChange(now);
      } else {
        // Calculate duration when tab becomes visible again
        const duration = now - lastTabVisibilityChange;
        if (duration > 500) { // Ignore very short visibility changes
          setMonitoringStats(prev => ({
            ...prev,
            tabSwitchDuration: prev.tabSwitchDuration + duration
          }));
          addSuspiciousActivity(`Tab returned to visible after ${(duration / 1000).toFixed(1)}s`);
        }
      }
    }
  };

  const handleWindowBlur = () => {
    if (isInterviewStarted) {
      const now = Date.now();
      setTabFocused(false);
      setTabSwitchCount(prev => prev + 1);
      addSuspiciousActivity('Window lost focus - possible tab/app switch');
      setLastTabVisibilityChange(now);
    }
  };

  const handleWindowFocus = () => {
    if (isInterviewStarted) {
      const now = Date.now();
      setTabFocused(true);
      
      // Calculate duration when window regains focus
      const duration = now - lastTabVisibilityChange;
      if (duration > 500) { // Ignore very short focus changes
        setMonitoringStats(prev => ({
          ...prev,
          tabSwitchDuration: prev.tabSwitchDuration + duration
        }));
        addSuspiciousActivity(`Window regained focus after ${(duration / 1000).toFixed(1)}s`);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isInterviewStarted) return;
    
    // Detect keyboard shortcuts that might indicate cheating
    if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'v')) {
      addSuspiciousActivity(`Keyboard shortcut detected: ${e.ctrlKey ? 'Ctrl' : 'Cmd'}+${e.key}`);
      setCheatingScore(prev => prev + 5);
    }
    
    // Detect Alt+Tab
    if (e.altKey && e.key === 'Tab') {
      addSuspiciousActivity('Alt+Tab detected - attempting to switch windows');
      setCheatingScore(prev => prev + 10);
    }
    
    // Detect PrintScreen
    if (e.key === 'PrintScreen') {
      addSuspiciousActivity('PrintScreen detected - attempting to capture screen');
      setCheatingScore(prev => prev + 15);
    }
  };

  const handleMouseLeave = (e: MouseEvent) => {
    if (!isInterviewStarted) return;
    
    // Check if mouse left the window through the top edge (might indicate switching to address bar)
    if (e.clientY <= 0) {
      addSuspiciousActivity('Mouse left window through top edge - possible navigation attempt');
      setCheatingScore(prev => prev + 3);
    }
  };

  const handleMouseEnter = () => {
    // No specific action needed when mouse re-enters
  };

  const addSuspiciousActivity = (activity: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setSuspiciousActivity(prev => [...prev, `${timestamp}: ${activity}`]);
  };

  const initializeEyeTracking = () => {
    if (!localVideoRef.current || !canvasRef.current) return;
    
    setEyeTrackingEnabled(true);
    
    // Load face-api.js or similar library here
    // For this example, we'll simulate eye tracking with random data
    const interval = setInterval(() => {
      if (isInterviewStarted) {
        simulateEyeTracking();
      }
    }, 1000);
    
    setFaceDetectionInterval(interval);
  };

  const simulateEyeTracking = () => {
    if (!canvasRef.current || !localVideoRef.current) return;
    
    const now = Date.now();
    const timeSinceLastCheck = now - lastEyeCheck;
    setLastEyeCheck(now);
    
    // Simulate eye movement detection
    // In a real implementation, this would use face-api.js or similar
    const directions = ['center', 'up', 'up-right', 'right', 'down-right', 'down', 'down-left', 'left', 'up-left'];
    
    // Weight the directions to make center more common
    const weightedDirections = [
      'center', 'center', 'center', 'center', 'center', 'center', 
      ...directions.filter(d => d !== 'center')
    ];
    
    const randomDirection = weightedDirections[Math.floor(Math.random() * weightedDirections.length)];
    const lookDuration = Math.floor(Math.random() * 1000) + 500; // 0.5-1.5 seconds
    
    // Add to eye movements log
    setEyeMovements(prev => [...prev, {timestamp: now, direction: randomDirection, duration: lookDuration}]);
    
    // Check for suspicious patterns
    if (randomDirection !== 'center') {
      // Check for sustained off-center looking
      const recentMovements = eyeMovements.slice(-5);
      const offCenterCount = recentMovements.filter(m => m.direction !== 'center').length;
      
      if (offCenterCount >= 3) {
        // Calculate total off-screen look duration
        const offScreenDuration = lookDuration;
        
        setMonitoringStats(prev => ({
          ...prev,
          offScreenLookDuration: prev.offScreenLookDuration + offScreenDuration,
          suspiciousEyeMovementCount: prev.suspiciousEyeMovementCount + 1
        }));
        
        addSuspiciousActivity(`Sustained eye movement detected: ${randomDirection} for ${(lookDuration/1000).toFixed(1)}s (possible off-screen reading)`);
      }
      
      // Check for rapid eye movements
      if (timeSinceLastCheck < 1000 && eyeMovements.length > 1) {
        setMonitoringStats(prev => ({
          ...prev,
          rapidEyeMovementCount: prev.rapidEyeMovementCount + 1
        }));
        
        addSuspiciousActivity('Rapid eye movements detected (possible scanning of external content)');
      }
    }
    
    // Draw eye tracking visualization on canvas
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      ctx.beginPath();
      
      // Draw different positions based on direction
      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2;
      
      let x = centerX;
      let y = centerY;
      
      if (randomDirection.includes('left')) x -= 20;
      if (randomDirection.includes('right')) x += 20;
      if (randomDirection.includes('up')) y -= 20;
      if (randomDirection.includes('down')) y += 20;
      
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const toggleMute = () => {
    if (localVideoRef.current?.srcObject) {
      const audioTracks = (localVideoRef.current.srcObject as MediaStream).getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isMuted; // Toggle to opposite of current state
      });
      setIsMuted(!isMuted);
      addDebugInfo(`🎤 Microphone ${isMuted ? 'unmuted' : 'muted'}`);
    }
  };

  const toggleVideo = () => {
    if (localVideoRef.current?.srcObject) {
      const videoTracks = (localVideoRef.current.srcObject as MediaStream).getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isVideoOn; // Toggle to opposite of current state
      });
      setIsVideoOn(!isVideoOn);
      addDebugInfo(`📹 Camera ${isVideoOn ? 'turned off' : 'turned on'}`);
    }
  };

  const startInterview = async () => {
  setShowJobDetails(false);
  setInterviewStartTime(Date.now());
  setIsInterviewStarted(true);
  setCallStatus('connected');
  setCallSid(`call-${Date.now()}`);
  addDebugInfo("🚀 Starting interview");

  // Start call duration timer
  timerRef.current = setInterval(() => {
    setCallDuration(prev => prev + 1);
  }, 1000);

  // Start listening for candidate responses with continuous updates
  speechService.startListening((text) => {
    if (text.trim()) {
      setIsUserSpeaking(true);
      setCurrentUserResponse(text.trim());
      addDebugInfo(`🎤 Speech detected: "${text.substring(0, 30)}..."`);
      
      // Reset the timeout each time we get new speech
      if (recognitionTimeoutRef.current) {
        clearTimeout(recognitionTimeoutRef.current);
        addDebugInfo("⏱️ Reset speech timeout");
      }
      
      // Set a timeout to consider the speech "done" after 6 seconds of silence
      recognitionTimeoutRef.current = setTimeout(() => {
        addDebugInfo("⏱️ Speech timeout triggered");
        setIsUserSpeaking(false);
        handleUserResponseComplete(text.trim());
      }, 6000);
    }
  });

  if (job?.qaItems?.[0]) {
    // REMOVED THE DUPLICATE INTRODUCTION - go straight to first question
    
    // Wait for 3 seconds to let the initial greeting finish
    addDebugInfo("⏱️ Waiting 3 seconds before first question");
    await new Promise(resolve => setTimeout(resolve, 3000));
    addDebugInfo("⏱️ 3-second delay completed - asking first question");
    
    const question = job.qaItems[0].question;
    
    // Add first question to messages
    setMessages(prev => [...prev, {
      text: question,
      sender: 'AI'
    }]);
    
    // Add first question to conversation history
    setConversationHistory(prev => [...prev, {
      role: 'assistant',
      content: question
    }]);
    
    // Speak the first question
    try {
      setIsAISpeaking(true);
      addDebugInfo("🗣️ AI speaking first question - START TIME: " + new Date().toISOString());
      await speechService.speak(question, "First question");
      addDebugInfo("✅ AI finished speaking first question - END TIME: " + new Date().toISOString());
      setIsAISpeaking(false);
      setIntroCompleted(true); // Set this after the first question
    } catch (err) {
      console.error('Failed to speak first question:', err);
      addDebugInfo(`❌ Failed to speak first question: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsAISpeaking(false);
    }
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
    if (!job?.qaItems) return;
    
    console.log("🤖 processResponseWithAI called with response:", userResponse);
    console.log("💬 Processing with conversation history:", JSON.stringify(newHistory));
    addDebugInfo("🤖 Processing response with AI");
    
    setIsProcessingResponse(true);
    
    try {
      // Create system prompt based on current question and job details
      const currentQuestion = job.qaItems[currentQuestionIndex];
      const systemPrompt = `
You are Jack, an AI technical interviewer for a ${job.title} position at ${job.customer}.
You're conducting a video interview with a candidate.

Current question: "${currentQuestion.question}"
Expected answer should include keywords: ${currentQuestion.answer}

Your task:
1. Analyze the candidate's response critically
2. If the candidate's answer is vague, contains inaccuracies, or misses key concepts, politely challenge them
3. Don't accept generic or superficial answers - probe deeper with follow-up questions
4. If they mention something technically incorrect, point it out and ask for clarification
5. Be conversational but professional - don't be overly harsh, but don't let inaccuracies slide
6. Keep your response under 75 words
7. Don't list or enumerate your thoughts
8. NEVER start your response with "I noticed your response" or similar phrases
9. NEVER say "I noticed your response" or similar phrases
10. NEVER start your response with "Thank you for your response" or similar phrases
11. Be direct and conversational in your follow-ups

If the candidate's answer is very short or unclear, ask them to elaborate.
If they mentioned something interesting, ask them to go deeper on that specific point.
If they missed key concepts from the expected answer, gently probe in that direction.
If they make technical errors or show misunderstanding, politely correct them and ask for their thoughts.
`;

      console.log("🔍 Sending conversation to Anthropic with history:", JSON.stringify(newHistory));
      console.log("🧠 System prompt being used:", systemPrompt);
      addDebugInfo(`🔍 Sending conversation to Anthropic - ${new Date().toISOString()}`);

      // Get AI response using the updated history
      const aiResponse = await anthropicService.generateResponse(
        newHistory,
        systemPrompt
      );
      
      addDebugInfo(`🤖 AI response received - ${new Date().toISOString()}`);
      
      // Add AI response to messages and conversation history
      const updatedMessages = [...newHistory.map(msg => ({
        text: msg.content,
        sender: msg.role === 'user' ? 'USER' : 'AI'
      })), {
        text: aiResponse,
        sender: 'AI'
      }];
      
      setMessages(updatedMessages);
      
      // Update conversation history with AI response
      const updatedHistory = [...newHistory, {
        role: 'assistant',
        content: aiResponse
      }];
      
      setConversationHistory(updatedHistory);
      
      // Log the updated conversation history after adding AI response
      console.log("💬 Conversation history after AI response:", JSON.stringify(updatedHistory));
      
      // Speak the AI response
      try {
        setIsAISpeaking(true);
        addDebugInfo("🗣️ AI speaking response - START TIME: " + new Date().toISOString());
        await speechService.speak(aiResponse, "AI response");
        addDebugInfo("✅ AI finished speaking response - END TIME: " + new Date().toISOString());
        setIsAISpeaking(false);
      } catch (err) {
        console.error('Failed to speak AI response:', err);
        addDebugInfo(`❌ Failed to speak AI response: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsAISpeaking(false);
      }
      
    } catch (error) {
      console.error('Error processing response with AI:', error);
      addDebugInfo(`❌ Error processing with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Add fallback response if AI processing fails
      const fallbackResponse = "Could you elaborate more on your experience with this technology? I'm particularly interested in hearing about specific projects or challenges you've faced.";
      
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
        addDebugInfo("🗣️ AI speaking fallback response - START TIME: " + new Date().toISOString());
        await speechService.speak(fallbackResponse, "Fallback response");
        addDebugInfo("✅ AI finished speaking fallback response - END TIME: " + new Date().toISOString());
        setIsAISpeaking(false);
      } catch (err) {
        console.error('Failed to speak fallback response:', err);
        addDebugInfo(`❌ Failed to speak fallback response: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsAISpeaking(false);
      }
      
    } finally {
      setIsProcessingResponse(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!job?.qaItems) return;
    
    // Don't proceed if speech is already in progress
    if (isAISpeaking) {
      addDebugInfo("⚠️ Cannot ask next question - speech already in progress");
      return;
    }
    
    if (currentQuestionIndex < job.qaItems.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      addDebugInfo(`🔄 Moving to question ${nextIndex + 1} at ${new Date().toISOString()}`);
      
      const question = job.qaItems[nextIndex].question;
      
      // Add next question to messages
      const updatedMessages = [...messages, {
        text: question,
        sender: 'AI'
      }];
      
      setMessages(updatedMessages);
      
      // Add next question to conversation history
      const updatedHistory = [...conversationHistory, {
        role: 'assistant',
        content: question
      }];
      
      setConversationHistory(updatedHistory);

      // Speak the next question
      try {
        setIsAISpeaking(true);
        addDebugInfo(`🗣️ AI speaking question ${nextIndex + 1} - START TIME: ${new Date().toISOString()}`);
        await speechService.speak(question, `Question ${nextIndex + 1}`);
        addDebugInfo(`✅ AI finished speaking question ${nextIndex + 1} - END TIME: ${new Date().toISOString()}`);
        setIsAISpeaking(false);
      } catch (err) {
        console.error('Failed to speak question:', err);
        addDebugInfo(`❌ Failed to speak question: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsAISpeaking(false);
      }
    } else {
      // End of interview, speak outro
      setCurrentQuestionIndex(job.qaItems.length);
      addDebugInfo("🏁 Reached end of interview questions");
      
      const conclusion = "Thank you for participating in this interview. Your responses have been recorded and will be reviewed by our hiring team. We appreciate your time and interest in the position.";
      
      // Add conclusion to messages
      const updatedMessages = [...messages, {
        text: conclusion,
        sender: 'AI'
      }];
      
      setMessages(updatedMessages);
      
      // Add conclusion to conversation history
      const updatedHistory = [...conversationHistory, {
        role: 'assistant',
        content: conclusion
      }];
      
      setConversationHistory(updatedHistory);

      try {
        setIsAISpeaking(true);
        addDebugInfo("🗣️ AI speaking conclusion - START TIME: " + new Date().toISOString());
        await speechService.speak(conclusion, "Conclusion");
        addDebugInfo("✅ AI finished speaking conclusion - END TIME: " + new Date().toISOString());
        setIsAISpeaking(false);
      } catch (err) {
        console.error('Failed to speak conclusion:', err);
        addDebugInfo(`❌ Failed to speak conclusion: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setIsAISpeaking(false);
      }
    }
  };

  const handleEndCall = async () => {
    addDebugInfo("☎️ Ending call");
    
    // Stop speech recognition
    speechService.stopListening();
    addDebugInfo("🛑 Speech recognition stopped");
    
    // Stop call duration timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Update call status
    setCallStatus('ended');
    
    // Save call record to history
    const callRecord = {
      id: callSid || `call-${Date.now()}`,
      candidateId: 'demo-candidate',
      candidateName: 'Demo Candidate',
      timestamp: new Date().toISOString(),
      duration: callDuration,
      notes: messages.map(m => `${m.sender}: ${m.text}`).join('\n\n'),
      status: 'completed'
    };
    
    // In a real implementation, you would save this to your backend
    const savedCalls = JSON.parse(localStorage.getItem('callHistory') || '[]');
    savedCalls.push(callRecord);
    localStorage.setItem('callHistory', JSON.stringify(savedCalls));
    
    addDebugInfo("✅ Call ended and saved to history");
  };

  // Format duration in minutes and seconds
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addDebugInfo = (info: string) => {
    console.log(info);
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${info}`]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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

  if (!job) {
    return (
      <div className="min-h-screen p-6">
        <div className="rounded-lg bg-red-50 p-4 text-red-800">
          Interview not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {showJobDetails && job && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 p-4">
          <div className="mx-auto max-w-4xl">
            <JobDetailsView job={job} onClose={() => setShowJobDetails(false)} />
            <div className="mt-4 flex justify-center">
              <Button onClick={startInterview} size="lg">
                Start Interview
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AI Interviewer - Full Screen */}
          <div className="md:col-span-2 space-y-6">
            <div className="relative rounded-lg bg-gradient-to-br from-blue-900 to-blue-800 overflow-hidden aspect-video">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="mb-4 w-24 h-24 rounded-full bg-blue-700 mx-auto flex items-center justify-center">
                    <Bot className="h-12 w-12 text-white" />
                  </div>
                  <div className="text-4xl font-bold mb-2">JACK</div>
                  <div className="text-lg opacity-80">
                    {isAISpeaking ? 'Speaking...' : isProcessingResponse ? 'Thinking...' : 'AI Interviewer'}
                  </div>
                </div>
              </div>
              
              {/* Local Video (Picture-in-Picture) */}
              <div className="absolute bottom-4 right-4 w-1/4 aspect-video rounded-lg overflow-hidden border-2 border-white shadow-lg">
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror"
                />
                
                {/* Overlay canvas for eye tracking visualization */}
                <canvas 
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  width={320}
                  height={240}
                />
                
                {/* Tab focus warning */}
                {!tabFocused && isInterviewStarted && (
                  <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-2 rounded-md text-red-600 text-xs font-bold">
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      RETURN TO INTERVIEW
                    </div>
                  </div>
                )}
                
                {/* Speech indicator */}
                {isUserSpeaking && (
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs flex items-center">
                    <Mic className="h-3 w-3 mr-1 animate-pulse" />
                    Speaking
                  </div>
                )}
              </div>
              
              {/* Cheating alert overlay */}
              {cheatingDetected && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-bold animate-pulse flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Suspicious Activity Detected
                </div>
              )}
            </div>
            
            {/* Current Question */}
            <div className="rounded-lg bg-white p-6 shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Question</h2>
              {job?.qaItems && job.qaItems[currentQuestionIndex] && (
                <div className="space-y-4">
                  <p className="text-gray-800 text-xl">
                    {job.qaItems[currentQuestionIndex].question}
                  </p>
                  {isInterviewStarted && !isAISpeaking && !isProcessingResponse && !isUserSpeaking && introCompleted && (
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleNextQuestion}
                        disabled={isAISpeaking}
                      >
                        Next Question
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Controls */}
            <div className="flex justify-center space-x-4">
              <Button
                onClick={toggleMute}
                variant={isMuted ? "danger" : "primary"}
                className="rounded-full p-3"
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              <Button
                onClick={toggleVideo}
                variant={isVideoOn ? "primary" : "danger"}
                className="rounded-full p-3"
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              {isInterviewStarted && (
                <Button
                  onClick={() => setShowMonitoringPanel(!showMonitoringPanel)}
                  variant="outline"
                  className="ml-4"
                >
                  {showMonitoringPanel ? "Hide Monitoring" : "Show Monitoring"}
                </Button>
              )}
            </div>
          </div>

          {/* Interview Panel */}
          <div className="space-y-6">
            {/* Current Response */}
            {currentUserResponse && (
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Mic className="h-5 w-5 mr-2 text-blue-600 animate-pulse" />
                  Your Current Response
                </h2>
                <p className="text-gray-800 italic">"{currentUserResponse}"</p>
              </div>
            )}

            {/* Chat/Transcript */}
            <div className="rounded-lg bg-white p-6 shadow-md h-[400px] flex flex-col">
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
                      {message.sender === 'AI' ? 'JACK' : 'You'}
                    </div>
                    <div>{message.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Monitoring Panel (Hidden by default) */}
            {showMonitoringPanel && (
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-yellow-600" />
                  Monitoring Panel
                </h2>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Interview Duration:</span>
                    <span className="text-gray-600">
                      {interviewStartTime ? formatDuration(Math.floor((Date.now() - interviewStartTime) / 1000)) : '0:00'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Tab Focus:</span>
                    <span className={tabFocused ? "text-green-600" : "text-red-600"}>
                      {tabFocused ? "Focused" : "Not Focused"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Tab Switch Count:</span>
                    <span className={tabSwitchCount > 2 ? "text-red-600" : "text-gray-600"}>
                      {tabSwitchCount}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Total Tab Switch Time:</span>
                    <span className={monitoringStats.tabSwitchDuration > 5000 ? "text-red-600" : "text-gray-600"}>
                      {formatDuration(Math.floor(monitoringStats.tabSwitchDuration / 1000))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Eye Tracking:</span>
                    <span className={eyeTrackingEnabled ? "text-green-600" : "text-gray-600"}>
                      {eyeTrackingEnabled ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Off-Screen Looking:</span>
                    <span className={monitoringStats.offScreenLookDuration > 10000 ? "text-red-600" : "text-gray-600"}>
                      {formatDuration(Math.floor(monitoringStats.offScreenLookDuration / 1000))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Suspicious Eye Movements:</span>
                    <span className={monitoringStats.suspiciousEyeMovementCount > 5 ? "text-red-600" : "text-gray-600"}>
                      {monitoringStats.suspiciousEyeMovementCount}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="font-medium">Cheating Score:</span>
                    <span className={
                      cheatingScore > 30 ? "text-red-600 font-bold" : 
                      cheatingScore > 15 ? "text-yellow-600" : 
                      "text-green-600"
                    }>
                      {cheatingScore.toFixed(1)} / 100
                    </span>
                  </div>
                  
                  {suspiciousActivity.length > 0 && (
                    <div>
                      <h3 className="font-medium text-red-600 mb-2">Suspicious Activity Log:</h3>
                      <div className="max-h-40 overflow-y-auto bg-red-50 p-2 rounded-md">
                        {suspiciousActivity.map((activity, index) => (
                          <div key={index} className="text-xs text-red-800 mb-1">
                            {activity}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-2">Recent Eye Movements:</h3>
                    <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded-md">
                      {eyeMovements.slice(-10).map((movement, index) => (
                        <div key={index} className="text-xs text-gray-700 mb-1 flex justify-between">
                          <span>{new Date(movement.timestamp).toLocaleTimeString()}</span>
                          <span className={movement.direction !== 'center' ? "text-yellow-600 font-medium" : ""}>
                            {movement.direction} ({(movement.duration/1000).toFixed(1)}s)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Debug Info Panel */}
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
                <p>AI Speaking: {isAISpeaking ? "Yes" : "No"}</p>
                <p>Processing Response: {isProcessingResponse ? "Yes" : "No"}</p>
                <p>Intro Completed: {introCompleted ? "Yes" : "No"}</p>
                <p>Speech Recognition: {speechService.isCurrentlyListening() ? "Active" : "Paused"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Chatbot />
    </div>
  );
};

export default VideoInterviewPage;