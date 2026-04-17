# 🤖 Mr. House - Lucky 38 Mainframe AI

An immersive, retro-futuristic AI chatbot experience themed after Fallout: New Vegas's Robert House and the Lucky 38 casino. Built with React, TypeScript, and Google's Gemini AI.

## ✨ Features

### 🎭 **Mr. House Persona**
- Fully in-character AI responses as Robert House, CEO of RobCo Industries
- Dynamic emotional states (NEUTRAL, AMUSED, ANNOYED, CALCULATING)
- Refined, arrogant, and visionary dialogue
- **Rate-limiting & Spam protection**: Hardened against automated bot transmissions

### 🖥️ **Retro-Futuristic UI**
- **Pip-Boy inspired design** with authentic Fallout aesthetics
- **CRT screen effects**: scanlines, phosphor glow, chromatic aberration, screen flicker
- **Monospaced terminal font** (Share Tech Mono)
- **Vibrant green-on-black** color scheme (#1aff1a)
- Custom scrollbars and glassmorphic elements

### 🤖 **Interactive Portrait System**
- Pixelated Mr. House portrait with dynamic facial expressions
- Real-time mood changes based on AI responses
- Responsive layout (sidebar on desktop, top on mobile)

### 📊 **Live System Metrics**
- **Session Uptime**: Real-time session timer
- **Memory Usage**: Dynamic calculation based on message count
- **Reactor Power**: Fluctuating power levels (98-100%)
- **Current Mood**: Visual mood indicator with animations

### 🎨 **Premium Design Elements**
- Smooth animations and hover effects
- Responsive design for all screen sizes
- Accessibility-focused with proper semantic HTML
- No placeholders - fully functional demo

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Samrude1/mr-house.git
   cd mr-house
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   - Create or edit `.env.local` in the project root
   - Add your Gemini API key:
     ```
     API_KEY=your_gemini_api_key_here
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS, Custom CSS (CRT effects)
- **AI**: Google Gemini AI (@google/genai)
- **Build Tool**: Vite
- **Fonts**: Share Tech Mono (Google Fonts)

## 📁 Project Structure

```
 mr-house/
├── components/
│   ├── ChatWindow.tsx      # Main chat interface & state management
│   ├── ChatMessage.tsx     # Individual message bubbles
│   ├── ChatInput.tsx       # User input field
│   └── MrHousePortrait.tsx # Dynamic AI portrait with moods
├── hooks/
│   └── useSoundEffects.ts  # Audio effects hook
├── index.css               # CRT effects & global styles
├── types.ts                # TypeScript type definitions
├── constants.ts            # App configuration
└── App.tsx                 # Root component
```

## 🎮 Usage

- Type your message in the terminal-style input field
- Press **Enter** or click **SEND** to submit
- Watch Mr. House's mood change based on the conversation
- Observe live system metrics in the sidebar (desktop) or header (mobile)

## 🎨 Customization

### Change AI Personality
Edit the `systemInstruction` in `components/ChatWindow.tsx` (line 62)

### Modify Colors
Update CSS variables in `index.css`:
```css
:root {
  --pip-green: #1aff1a;
  --pip-green-dim: #00b300;
  --pip-bg: #0a0a0a;
}
```

### Adjust CRT Effects
Modify animations and effects in `index.css` (lines 19-219)

## 📝 License

This project is for educational and demonstration purposes.

## 🙏 Acknowledgments

- Inspired by Fallout: New Vegas and the character Mr. House
- CRT effects inspired by retro terminal aesthetics
- Built with Google's Gemini AI

---

### 🛡️ Security Note

This is a client-side demonstration. The Gemini API key is configured via environment variables. For a production-ready application, it is recommended to:
1.  **Restrict API Key**: In the Google Cloud Console / AI Studio, restrict your API key to only allow requests from your specific domain (e.g., `mr-house.vercel.app`).
2.  **Backend Proxy**: Move the AI logic to a server-side function (like Vercel Functions) to keep the API key entirely hidden from the client.
3.  **Rate Limiting**: This app includes a frontend-level cooldown (2s) to prevent simple bot spam.

*RobCo Industries - Maintaining the future today.*
