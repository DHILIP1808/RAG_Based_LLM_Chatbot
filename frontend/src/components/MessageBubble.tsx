// MessageBubble.tsx
import { useState } from 'react';
import { Copy, Check, UserCircle, Bot } from 'lucide-react';
import type { Message } from '../types';

interface Props {
  message: Message;
}

const MessageBubble = ({ message }: Props) => {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.sender === 'user';

  // Function to clean unwanted special characters from LLM response
  const cleanContent = (text: string): string => {
    return text
      // Remove markdown formatting
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold **text**
      .replace(/\*(.*?)\*/g, '$1') // Italic *text*
      .replace(/`(.*?)`/g, '$1') // Inline code `text`
      .replace(/```[\s\S]*?```/g, '') // Code blocks
      .replace(/#{1,6}\s/g, '') // Headers
      .replace(/^\s*[-*+]\s/gm, '') // List items
      .replace(/^\s*\d+\.\s/gm, '') // Numbered lists
      
      // Remove common special characters
      .replace(/[\u200B-\u200D\uFEFF]/g, '') // Zero-width characters
      .replace(/[""'']/g, '"') // Smart quotes to regular quotes
      .replace(/[–—]/g, '-') // Em/en dashes to regular dash
      .replace(/…/g, '...') // Ellipsis
      .replace(/[^\x00-\x7F]/g, (char) => {
        // Replace non-ASCII characters with ASCII equivalents where possible
        const replacements: { [key: string]: string } = {
          'á': 'a', 'à': 'a', 'ä': 'a', 'â': 'a', 'ā': 'a', 'ã': 'a',
          'é': 'e', 'è': 'e', 'ë': 'e', 'ê': 'e', 'ē': 'e',
          'í': 'i', 'ì': 'i', 'ï': 'i', 'î': 'i', 'ī': 'i',
          'ó': 'o', 'ò': 'o', 'ö': 'o', 'ô': 'o', 'ō': 'o', 'õ': 'o',
          'ú': 'u', 'ù': 'u', 'ü': 'u', 'û': 'u', 'ū': 'u',
          'ñ': 'n', 'ç': 'c'
        };
        return replacements[char] || char;
      })
      
      // Clean up whitespace
      .replace(/\s+/g, ' ') // Multiple spaces to single space
      .replace(/\n\s*\n/g, '\n\n') // Multiple line breaks to double line break
      .trim(); // Remove leading/trailing whitespace
  };

  const handleCopy = async () => {
    try {
      const cleanText = isUser ? message.text : cleanContent(message.text);
      await navigator.clipboard.writeText(cleanText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Clean the message text for display (only for LLM responses)
  const displayText = isUser ? message.text : cleanContent(message.text);

  return (
    <div className="group px-6 py-4 hover:bg-gray-100 transition-colors w-full">
      <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex items-start gap-4 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
            isUser 
              ? 'bg-black border border-black text-white' 
              : 'bg-black text-white'
          }`}>
            {isUser ? (
              <UserCircle size={20} />
            ) : (
              <Bot size={20} />
            )}
          </div>
          {/* Message Content */}
          <div className="flex-1 min-w-0">
            {/* Sender Label */}
            <div className={`mb-2 ${isUser ? 'text-right' : 'text-left'}`}>
              <span className="text-sm font-medium text-black">
                {isUser ? 'You' : 'Agri Chatbot'}
              </span>
            </div>
            {/* Message Bubble */}
            <div className={`rounded-2xl p-4 shadow-sm ${
              isUser 
                ? 'bg-white border border-gray-300 text-black' 
                : 'bg-white border border-gray-300 text-white'
            }`}>
              {/* Message Text */}
              <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''}`}>
                <div className={`leading-relaxed whitespace-pre-wrap break-words text-justify ${
                  isUser ? 'text-black' : 'text-black'
                }`}>
                  {displayText}
                </div>
              </div>
            </div>
            {/* Message Actions */}
            <div className={`flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity ${
              isUser ? 'justify-end' : 'justify-start'
            }`}>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-black hover:bg-gray-200 rounded transition-colors"
              >
                {isCopied ? (
                  <>
                    <Check size={12} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;