
import React from 'react';
import ChatWindow from './components/ChatWindow';
import { useSoundEffects } from './hooks/useSoundEffects';

const App: React.FC = () => {
  const { initAudio } = useSoundEffects();

  return (
    <div
      onClick={initAudio}
      className="bg-black text-[#1aff1a] h-screen font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden cursor-crosshair"
    >
      <div className="scanlines pointer-events-none absolute inset-0 z-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(#1aff1a_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none"></div>

      <div className="w-full max-w-7xl h-full max-h-[95vh] z-10 flex flex-col border-[3px] border-[#1aff1a] bg-[#001100] shadow-[0_0_20px_rgba(26,255,26,0.3)] rounded-lg relative overflow-hidden">
        {/* Screen Glare */}
        <div className="absolute top-0 right-0 w-full h-[200px] bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-20"></div>
        <ChatWindow />
      </div>

      <footer className="z-10 text-center text-[#1aff1a] text-sm mt-4 tracking-widest text-bloom uppercase">
        <p>PROPERTY OF ROBERT HOUSE</p>
        <p>&copy; 2077 LUCKY 38 CASINO & RESORT</p>
      </footer>
    </div>
  );
};

export default App;
