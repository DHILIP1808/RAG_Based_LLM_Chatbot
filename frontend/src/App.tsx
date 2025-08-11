import { useState } from 'react';
import ChatBox from './components/ChatBox';
import type { Message } from './types';
import { fetchBotResponse } from './api';
import { v4 as uuidv4 } from 'uuid';
import "./App.css"

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  // Add loading state to control the loading animation
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text: string) => {
    const userMessage: Message = {
      id: uuidv4(),
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMessage]);

    try {
      // START LOADING - This will show the loading animation
      setIsLoading(true);

      // Make API call to your backend
      const res = await fetchBotResponse({ query: text });

      // Create bot response message
      const botMessage: Message = {
        id: uuidv4(),
        sender: 'bot',
        text: res.answer,
        timestamp: Date.now(),
      };

      // Add bot response to messages
      setMessages((prev) => [...prev, botMessage]);

    } catch (err) {
      // Handle error case
      const errorMessage: Message = {
        id: uuidv4(),
        sender: 'bot',
        text: '⚠️ Failed to connect to the backend. Please try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      // STOP LOADING - This will hide the loading animation and show the response
      // Using finally ensures loading is stopped even if there's an error
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen overflow-hidden">
      <ChatBox 
        messages={messages} 
        onSend={handleSend} 
        isLoading={isLoading} // Pass loading state to ChatBox
      />
    </div>
  );
};

export default App;