// Anthropic API proxy for Claude AI
// This Edge Function securely proxies requests to Anthropic's API

interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Parse and log the complete request body
    const requestBody = await req.json();
    console.log('📦 Complete request body received by Edge Function:', JSON.stringify(requestBody));

    const { messages, systemPrompt } = requestBody;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid messages format" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Get API key from environment
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    
    if (!apiKey) {
      console.error('❌ Anthropic API key not found in environment variables');
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    console.log('🔑 Using Anthropic API key:', apiKey.substring(0, 8) + '...');
    console.log('📤 Sending messages to Anthropic API:', JSON.stringify(messages));
    console.log('🧠 System prompt:', systemPrompt ? systemPrompt.substring(0, 100) + '...' : 'None');

    // Prepare the request payload for Anthropic API
    const anthropicPayload = {
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages,
      system: systemPrompt || "You are Jack, an AI interviewer for technical positions. You're professional, focused, and provide thoughtful follow-up questions based on candidate responses. Keep your responses concise and direct. NEVER start your response with 'I noticed your response' or similar phrases.",
      temperature: 0.7
    };
    
    console.log('📦 Anthropic API request payload:', JSON.stringify(anthropicPayload));

    // Make request to Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(anthropicPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      
      return new Response(
        JSON.stringify({ 
          error: `API request failed with status ${response.status}`,
          details: errorText 
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    const data: AnthropicResponse = await response.json();
    
    // Extract the text from the response
    const responseText = data.content[0]?.text || '';
    console.log('📥 Received response from Anthropic API:', responseText.substring(0, 100) + '...');
    
    // Post-process the response to remove unwanted phrases
    const processedResponse = removeUnwantedPhrases(responseText);
    console.log('🔄 Processed response:', processedResponse.substring(0, 100) + '...');
    
    return new Response(
      JSON.stringify({ response: processedResponse }),
      {
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Error in anthropic-proxy function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
});

// Function to remove unwanted phrases from AI responses
function removeUnwantedPhrases(response: string): string {
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