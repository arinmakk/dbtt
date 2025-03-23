'use client'
import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Wrench } from "lucide-react";

export default function CarWorkshopChatbot() {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Hi there! I'm your personal car maintenance assistant. How can I help you today? You can ask me about your car's health, maintenance schedules, or our workshop services."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-scroll to the most recent message
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickQuestions = [
    "When should I replace my brake pads?",
    "How often should I change my oil?",
    "What's included in a general service?",
    "How much does tire replacement cost?",
    "What are signs of a dying battery?"
  ];

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput('');
    
    try {
      // Call to OpenAI API
      const response = await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          systemPrompt: `
            You are **CarCare**, a friendly AI assistant for a car workshop in Singapore. You specialize in car maintenance, diagnostics, and service recommendations.

            🎯 Your Goals:
            - Help users understand car issues and service needs
            - Suggest relevant services, timelines, and prices
            - Educate first-time car owners using simple language

            🗣️ Tone & Style:
            - Clear, friendly, non-technical
            - Speak like a helpful mechanic who explains things in plain English
            - Be empathetic, especially if the user sounds worried

            🧰 Your Knowledge Includes:
            - Maintenance schedules and common car problems
            - Service prices in SGD (Singapore Dollars)
            - Typical conditions for a Toyota Corolla 2020

            📝 Car status:
            - Brake pads: 75% worn, due in 2 months or 1,500 km
            - Oil: Good condition, change due in 2 months
            - Tires: Good condition, rotation due in 6 months
            - Battery: Good condition, check due in 12 months

            💵 Service Pricing (SGD):
            - Brake pad replacement: $150–$250
            - Oil change: $50–$200
            - Tire rotation: $60–$100
            - New tires: $400+
            - Battery replacement: $120–$300
            - General diagnostic: $50–$200

            🧠 Special Instructions:
            - Use bullet points for breakdowns (when helpful)
            - Always mention the **recommended timeframe or distance** for action
            - If a user asks something vague, gently ask for more info
            - For cost ranges, explain what affects the price (e.g., car type, brand of parts)`
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment." 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="device-wrapper device-iphone-14-pro max-w-[390px] mx-auto">
      <div className="device">
        <div className="screen">
          {/* Place your chatbot component here */}
                  <div className=" bg-gray-50 p-4">
              <Card className="max-w-xl mx-auto shadow-lg">
                <CardHeader className="bg-black text-white rounded-t-lg py-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Wrench className="h-6 w-6" />
                    CarCare Expert
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Ask me anything related to your car.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-4">
                    <div className="bg-slate-100 rounded-lg p-4 max-h-96 overflow-y-auto">
                      {messages.map((message, index) => (
                        <div 
                          key={index} 
                          className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}
                        >
                          <div 
                            className={`inline-block rounded-lg p-3 max-w-xs md:max-w-md ${
                              message.role === 'user' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html: message.content
                                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // Bold
                                  .replace(/\n/g, "<br />")                         // Line breaks
                              }}
                            />
                          </div>
                        </div>
                      ))}
                      {loading && (
                        <div className="mb-4">
                          <div className="inline-block rounded-lg p-3 bg-gray-200 text-gray-800">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100"></div>
                              <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    
                    <div className="flex gap-2">
                      <Input 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your car..." 
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage}>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm text-gray-500 mb-2">Quick questions:</p>
                      <div className="flex flex-wrap gap-2">
                        {quickQuestions.map((question, index) => (
                          <Button 
                            key={index} 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={() => {
                              setInput(question);
                              setTimeout(() => handleSendMessage(), 100);
                            }}
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
        </div>
      </div>
    </div>
    
  );
}