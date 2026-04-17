
import React from 'react';
import type { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.author === 'user';

  const wrapperClasses = `flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`;
  // Pip-Boy style: No rounded corners, solid backgrounds or borders, uppercase/terminal feel
  // Added trailing-wide and leading-loose for readability
  const bubbleClasses = `max-w-3xl p-5 text-lg md:text-2xl break-words border-2 tracking-wide leading-loose whitespace-pre-wrap ${isUser
    ? 'border-[#1aff1a] bg-[#1aff1a] text-black font-bold uppercase' // User input: Inverted block
    : 'border-[#1aff1a] bg-transparent text-[#1aff1a] text-bloom font-medium' // AI output: Terminal text
    }`;

  const TypingEffect: React.FC<{ text: string }> = ({ text }) => {
    const [displayedText, setDisplayedText] = React.useState('');

    React.useEffect(() => {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(text.substring(0, i + 1));
        i++;
        if (i > text.length) {
          clearInterval(interval);
        }
      }, 10); // Adjust speed of typing effect
      return () => clearInterval(interval);
    }, [text]);

    return <span>{displayedText}<span className="inline-block w-2 h-4 bg-[#1aff1a] animate-blink ml-1"></span></span>;
  }

  // Removed custom renderText in favor of whitespace-pre-wrap CSS class


  return (
    <div className={wrapperClasses}>
      {!isUser && (
        <div className="w-10 h-10 border-2 border-[#1aff1a] bg-[#001100] flex items-center justify-center text-[#1aff1a] font-bold text-lg shrink-0 rounded-none">
          OS
        </div>
      )}
      <div className={bubbleClasses}>
        {message.author === 'ai' ? message.text : <span>&gt; {message.text}</span>}
      </div>
      {isUser && (
        <div className="w-10 h-10 border-2 border-[#1aff1a] bg-[#1aff1a] flex items-center justify-center text-black font-bold text-lg shrink-0 rounded-none">
          YOU
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
