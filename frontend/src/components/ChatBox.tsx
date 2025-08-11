// ChatBox.tsx
import { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import InputBox from './InputBox';
import type { Message } from '../types';

interface Props {
  messages: Message[];
  onSend: (message: string) => void;
  isLoading?: boolean;
}

const ChatBox = ({ messages, onSend, isLoading = false }: Props) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'end'
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-white w-full">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 w-full">
        <ChatHeader />
      </div>

      {/* Messages Area - Scrollable */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto bg-gray-50 w-full scrollbar-hide"
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}
      >
        <div className="w-full">
          <div className="py-6 w-full">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="group px-6 py-4 hover:bg-gray-100 transition-colors w-full">
                <div className="flex justify-start">
                  <div className="flex items-start gap-4 max-w-[80%]">
                    <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot size={20} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="mb-2 text-left">
                        <span className="text-sm font-medium text-black">
                          Agri Chatbot
                        </span>
                      </div>
                      <div className="bg-white border border-gray-300 rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center justify-center">
                          <div className="typing-indicator">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Input Area - Fixed */}
      <div className="flex-shrink-0 border-t border-gray-300 bg-white w-full">
        <div className="w-full">
          <InputBox onSend={onSend} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default ChatBox;