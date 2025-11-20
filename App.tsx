import React, { useState } from 'react';
import { ViewMode } from './types';
import Concepts from './Concepts';
import Playground from './Playground';
import Chat from './Chat';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.CONCEPTS);
  
  // Helper to switch views, can be passed down
  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
  };

  // Specialized handler for "Ask Tutor" buttons in Concepts
  // In a real app with global state (Context/Redux), we would pre-fill the chat input.
  // For now, we just switch to chat.
  const handleAskTutor = (question: string) => {
    if (question === "NAVIGATE_PLAYGROUND") {
        setCurrentView(ViewMode.PLAYGROUND);
        return;
    }
    // Ideally we pass the question to the chat component via props or context
    // But given the constraints, let's just switch to Chat. 
    // The user can re-type or copy-paste, or we could implement a simple prop drill if Chat accepts initialMessage.
    // For this iteration, I will simply switch to Chat to encourage exploration.
    setCurrentView(ViewMode.CHAT);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Navigation Bar */}
      <nav className="h-16 border-b border-slate-700 flex items-center px-6 justify-between bg-slate-900/80 backdrop-blur z-10">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
            </div>
            <h1 className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Fractal Explorer AI
            </h1>
        </div>
        
        <div className="flex gap-1 bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setCurrentView(ViewMode.CONCEPTS)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              currentView === ViewMode.CONCEPTS 
                ? 'bg-slate-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Aprender
          </button>
          <button
            onClick={() => setCurrentView(ViewMode.PLAYGROUND)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              currentView === ViewMode.PLAYGROUND 
                ? 'bg-cyan-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Explorar
          </button>
          <button
            onClick={() => setCurrentView(ViewMode.CHAT)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              currentView === ViewMode.CHAT 
                ? 'bg-purple-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }`}
          >
            Tutor AI
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        {currentView === ViewMode.CONCEPTS && (
            <Concepts onAskTutor={handleAskTutor} />
        )}
        
        {/* Keep Playground mounted to preserve state if needed, or just conditional render */}
        {/* For performance, conditional render is fine for this scale */}
        {currentView === ViewMode.PLAYGROUND && (
            <Playground />
        )}

        {currentView === ViewMode.CHAT && (
            <Chat />
        )}
      </main>
    </div>
  );
};

export default App;