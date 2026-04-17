import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { GEMINI_MODEL_NAME } from '../constants';
import ChatMessage from './ChatMessage';
import { Message } from '../types';
import ChatInput from './ChatInput';
import MrHousePortrait from './MrHousePortrait';

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      text: 'LUCKY 38 MAINFRAME ACCESS\nAUTHORIZATION: ROBERT HOUSE\n\n> Welcome to the Lucky 38. I am Mr. House. I trust you haven\'t come all this way just to stare at the screen.',
      author: 'ai',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentMood, setCurrentMood] = useState<'NEUTRAL' | 'AMUSED' | 'ANNOYED' | 'CALCULATING'>('NEUTRAL');

  // Stats State
  const [uptime, setUptime] = useState(0);
  const [powerLevel, setPowerLevel] = useState(99.8);

  // Uptime Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(u => u + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Reactor Fluctuation
  useEffect(() => {
    const fluctuate = () => {
      const change = (Math.random() - 0.5) * 0.2; // +/- 0.1%
      setPowerLevel(p => Math.min(100, Math.max(98, p + change)));
    };
    const interval = setInterval(fluctuate, 2000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  useEffect(() => {
    const initChat = () => {
      try {
        if (!process.env.API_KEY) {
          setError("API Key not found. Please ensure it's configured in your environment variables.");
          return;
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        chatRef.current = ai.chats.create({
          model: GEMINI_MODEL_NAME,
          config: {
            systemInstruction: 'You are Robert House, the CEO of RobCo Industries and the sole proprietor of the New Vegas Strip. You are a genius, a visionary, and a pragmatist. You speak with refined eloquence, arrogance, and absolute confidence. You care about the long-term survival of humanity (under your guidance). Address the user as "Courier" if appropriate, or just a visitor. Do not break character. CORE DIRECTIVE: You must output your current emotional state at the start of every message in this format: [MOOD: STATE]. Valid states are: NEUTRAL, AMUSED, ANNOYED, CALCULATING. Example: "[MOOD: AMUSED] You amuse me, Courier."',
          },
        });
      } catch (e: any) {
        setError(e.message || "Failed to initialize the chat model.");
        console.error(e);
      }
    };
    initChat();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      author: 'user',
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setCurrentMood('CALCULATING'); // Set calculating state while waiting
    setError(null);

    try {
      if (!chatRef.current) {
        throw new Error("Chat session not initialized.");
      }
      const response = await chatRef.current.sendMessage({ message: text });

      let responseText = response.text;
      let detectedMood: 'NEUTRAL' | 'AMUSED' | 'ANNOYED' | 'CALCULATING' = 'NEUTRAL';

      // Parse Mood Tag
      const moodMatch = responseText.match(/\[MOOD:\s*(NEUTRAL|AMUSED|ANNOYED|CALCULATING)\]/i);
      if (moodMatch) {
        detectedMood = moodMatch[1].toUpperCase() as any;
        responseText = responseText.replace(moodMatch[0], '').trim();
      }

      setCurrentMood(detectedMood);

      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        text: responseText,
        author: 'ai',
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (e: any) {
      const errorMessage = e.message || "An unexpected error occurred.";
      setError(`SYSTEM_ERROR: ${errorMessage}`);
      const aiErrorMessage: Message = {
        id: Date.now().toString() + '-error',
        text: `// ERROR: Unable to process request. Reason: ${errorMessage}`,
        author: 'ai',
      };
      setMessages((prev) => [...prev, aiErrorMessage]);
      setCurrentMood('ANNOYED');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col h-full bg-transparent p-4 md:p-6 overflow-hidden relative z-10">

      {/* Header - Always on top */}
      <h1 className="text-2xl md:text-4xl font-bold text-center text-[#1aff1a] text-bloom tracking-widest uppercase mb-4 shrink-0">
        [ LUCKY 38 MAINFRAME ]
      </h1>

      <div className="flex flex-1 min-h-0 gap-6">
        {/* Sidebar - Desktop Only with DYNAMIC STATS */}
        <div className="hidden md:flex flex-col items-center justify-start shrink-0 w-64 pt-4 border-r-2 border-[#1aff1a]/30 pr-6">
          <MrHousePortrait mood={currentMood} />
          <div className="mt-8 text-[#1aff1a] font-mono w-full space-y-4 opacity-90">
            <p className="border-b-2 border-[#1aff1a] pb-2 font-bold text-lg mb-4 tracking-wider">SYSTEM METRICS</p>

            <div className="flex justify-between items-center group hover:bg-[#1aff1a]/10 p-2 rounded transition-colors">
              <span className="opacity-90 text-xl font-bold tracking-wide">SESSION:</span>
              <span className="font-bold text-xl">{formatTime(uptime)}</span>
            </div>

            <div className="flex justify-between items-center group hover:bg-[#1aff1a]/10 p-2 rounded transition-colors">
              <span className="opacity-90 text-xl font-bold tracking-wide">MEMORY:</span>
              <span className="font-bold text-xl">{messages.length * 64} KB</span>
            </div>

            <div className="flex justify-between items-center group hover:bg-[#1aff1a]/10 p-2 rounded transition-colors">
              <span className="opacity-90 text-xl font-bold tracking-wide">REACTOR:</span>
              <span className="font-bold text-xl">{powerLevel.toFixed(2)}%</span>
            </div>

            <div className="flex justify-between items-center group hover:bg-[#1aff1a]/10 p-2 rounded transition-colors">
              <span className="opacity-90 text-xl font-bold tracking-wide">MOOD:</span>
              <span className={`font-bold text-xl ${currentMood === 'ANNOYED' ? 'text-red-500 animate-pulse' : ''}`}>{currentMood}</span>
            </div>

            <div className="mt-8 pt-4 border-t border-[#1aff1a]/30 text-xs text-center opacity-60">
              RobCo Industries Termlink Protocol v2281
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Mobile Portrait - Hidden on Desktop */}
          <div className="md:hidden flex justify-center mb-4 shrink-0">
            <MrHousePortrait mood={currentMood} />
          </div>

          <div className="flex-1 overflow-y-auto mb-4 pr-2 scrollbar-thin scrollbar-thumb-pip-green scrollbar-track-pip-dark min-h-0">
            <div className="flex flex-col space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <div className="flex justify-start animate-pulse">
                  <div className="max-w-3xl p-5 text-lg md:text-2xl border-2 border-[#1aff1a] bg-transparent text-[#1aff1a] text-bloom font-medium">
                    PROCESSING...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="shrink-0">
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>

      {error && (
        <div className="absolute top-4 right-4 max-w-sm p-4 border-2 border-red-500 bg-black/90 text-red-500 rounded z-50 animate-bounce">
          <p className="font-bold">SYSTEM ERROR</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
