// app/api/chat/route.js
import { OpenAI } from 'openai';

export async function POST(request) {
  try {
    const { messages, systemPrompt } = await request.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Prepare the messages for OpenAI API
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo', 
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 800,
    });

    // Return the assistant's message
    return Response.json({
      message: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Error in OpenAI request:', error);
    return Response.json(
      { error: 'Error processing your request' },
      { status: 500 }
    );
  }
}