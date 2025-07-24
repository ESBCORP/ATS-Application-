import axios from 'axios';

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

class AnthropicService {
  private isConfigured = false;
  private apiUrl: string;
  private apiKey: string | undefined;

  constructor() {
    this.apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/anthropic-proxy`;
    this.apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    
    this.isConfigured = !!import.meta.env.VITE_SUPABASE_URL && 
                        !!import.meta.env.VITE_SUPABASE_ANON_KEY &&
                        !!import.meta.env.VITE_ANTHROPIC_API_KEY;
    
    if (!this.isConfigured) {
      console.warn('⚠️ Anthropic service configuration incomplete');
      if (!import.meta.env.VITE_SUPABASE_URL) {
        console.warn('⚠️ Missing VITE_SUPABASE_URL');
      }
      if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.warn('⚠️ Missing VITE_SUPABASE_ANON_KEY');
      }
      if (!import.meta.env.VITE_ANTHROPIC_API_KEY) {
        console.warn('⚠️ Missing VITE_ANTHROPIC_API_KEY');
      }
    } else {
      console.log('✅ Anthropic service configured successfully');
      console.log('🔑 Using API key:', this.apiKey ? `${this.apiKey.substring(0, 8)}...` : 'Not set');
    }
  }

  async generateResponse(messages: AnthropicMessage[], systemPrompt?: string): Promise<string> {
    if (!this.isConfigured) {
      console.warn('❌ Anthropic service not configured');
      return "I'm sorry, I'm not able to respond right now due to a configuration issue.";
    }

    try {
      // Log the complete messages array to ensure all messages are included
      console.log('📤 Complete messages array:', JSON.stringify(messages));
      
      // Log the system prompt
      console.log('🧠 System prompt:', systemPrompt ? systemPrompt.substring(0, 100) + '...' : 'None');
      
      // Add fallback response in case of network issues
      const fallbackResponse = "Could you elaborate more on your experience with this technology? I'm particularly interested in hearing about specific projects or challenges you've faced.";
      
      // Prepare the request payload for logging
      const requestPayload = {
        messages,
        systemPrompt
      };
      
      // Log the complete request payload
      console.log('📦 Complete request payload:', JSON.stringify(requestPayload));
      
      try {
        // Log the request URL
        console.log('🔗 Request URL:', this.apiUrl);
        
        // Log the request headers
        console.log('📋 Request headers:', {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 10)}...`,
        });
        
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(requestPayload)
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Anthropic proxy error:', response.status, errorData);
          console.log('Using fallback response due to API error');
          return fallbackResponse;
        }

        const data = await response.json();
        console.log('📥 Received response:', data.response ? data.response.substring(0, 100) + '...' : 'No response');
        
        // Additional post-processing on the client side
        const processedResponse = this.removeUnwantedPhrases(data.response || fallbackResponse);
        console.log('🔄 Post-processed response:', processedResponse.substring(0, 100) + '...');
        return processedResponse;
      } catch (error) {
        console.error('Error calling Anthropic API:', error);
        console.log('Using fallback response due to network error');
        return fallbackResponse;
      }
    } catch (error) {
      console.error('Error in generateResponse:', error);
      
      // Always return a fallback response instead of throwing
      return "Could you share more details about your experience? I'm particularly interested in hearing about specific projects or challenges you've faced.";
    }
  }

  // Additional client-side post-processing
  private removeUnwantedPhrases(response: string): string {
    const phrasesToRemove = [
      "I noticed your response",
      "Thank you for your response",
      "Thanks for sharing",
      "I appreciate your response",
      "Thank you for providing",
      "I see that you mentioned",
      "Based on your response",
      "From what you've shared",
      "I understand that you",
      "According to what you said",
      "As per your response",
      "From your answer",
      "Based on what you've told me",
      "From the information you provided"
    ];
    
    let processedResponse = response;
    
    // Remove phrases at the beginning of the response
    for (const phrase of phrasesToRemove) {
      if (processedResponse.toLowerCase().startsWith(phrase.toLowerCase())) {
        processedResponse = processedResponse.substring(phrase.length).trim();
        // Remove any punctuation that might follow the phrase
        processedResponse = processedResponse.replace(/^[,.;:]\s*/, '');
        // Capitalize the first letter if needed
        processedResponse = processedResponse.charAt(0).toUpperCase() + processedResponse.slice(1);
      }
    }
    
    return processedResponse;
  }

  isServiceConfigured(): boolean {
    return this.isConfigured;
  }
}

export const anthropicService = new AnthropicService();
export default anthropicService;