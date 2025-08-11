// InputBox.tsx
import { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';

interface InputBoxProps {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

const InputBox = ({ onSend, isLoading = false }: InputBoxProps) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return;
    
    onSend(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '24px';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Focus on textarea when not loading
  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isLoading]);

  return (
    <div className="p-4">
      <div className="relative">
        {/* Main Input Container */}
        <div className="flex items-end gap-3 bg-white border border-gray-400 rounded-2xl shadow-sm hover:border-gray-600 focus-within:border-black focus-within:shadow-md transition-all duration-200">
          {/* Textarea */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isLoading ? "Please wait..." : "Message Agri Chatbot..."}
              disabled={isLoading}
              className="w-full px-4 py-3 bg-transparent resize-none border-0 outline-none placeholder-gray-500 text-black disabled:placeholder-gray-400 disabled:cursor-not-allowed"
              style={{
                minHeight: '24px',
                maxHeight: '200px',
                lineHeight: '24px'
              }}
            />
          </div>

          {/* Send/Stop Button */}
          <div className="flex-shrink-0 p-2">
            <button
              onClick={handleSubmit}
              disabled={(!input.trim() && !isLoading)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                input.trim() && !isLoading
                  ? 'bg-black hover:bg-gray-800 text-white shadow-sm hover:shadow-md'
                  : isLoading
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <Square size={16} />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default InputBox;