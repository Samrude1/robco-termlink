
import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const SendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-6 h-6"
  >
    <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
  </svg>
);

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <span className="text-[#1aff1a] text-xl font-bold mr-2">&gt;</span>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="ENTER COMMAND..."
        disabled={isLoading}
        className="flex-1 bg-[#001100] border-2 border-[#1aff1a] rounded-none px-4 py-2 focus:ring-0 text-[#1aff1a] text-lg md:text-xl placeholder-[#1aff1a]/50 disabled:opacity-50 focus:outline-none uppercase caret-[#1aff1a] tracking-widest font-mono"
        autoFocus
      />
      <button
        type="submit"
        disabled={isLoading}
        className="p-2 rounded-none border-2 border-[#1aff1a] text-[#1aff1a] hover:bg-[#1aff1a] hover:text-[#001100] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 ease-in-out ml-2"
        aria-label="Send message"
      >
        <div className="w-8 h-8 flex items-center justify-center font-bold">
          SEND
        </div>
      </button>
    </form>
  );
};

// Add blinking cursor animation to tailwind config
// In a real project, this would go into tailwind.config.js
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
        @keyframes blink {
            50% { opacity: 0; }
        }
        .animate-blink {
            animation: blink 1s step-end infinite;
        }
    `;
  document.head.appendChild(style);
}

export default ChatInput;
