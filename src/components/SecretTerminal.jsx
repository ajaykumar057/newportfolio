import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiTerminal, FiX, FiMinus, FiMaximize2 } from 'react-icons/fi';

const SecretTerminal = ({ isOpen, onClose, onHireModeToggle, onKonamiTrigger }) => {
  const [history, setHistory] = useState([
    { text: "Welcome to Ajay-OS v1.0.0 Terminal.", type: "system" },
    { text: "Type 'help' to see list of available Easter Egg commands.", type: "system" },
    { text: "", type: "empty" }
  ]);
  const [inputVal, setInputVal] = useState('');
  const terminalEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = inputVal.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { text: `ajay-user:~$ ${inputVal}`, type: "user" }];
    
    let output = "";
    let type = "output";

    switch(cmd) {
      case 'help':
        output = "Available commands:\n  help        - List terminal commands\n  about       - Get Ajay's background bio\n  skills      - Dump core technical competence\n  projects    - List active SaaS portfolio\n  konami      - Activate secret matrix particle storm\n  hire        - Unlock Premium offer modal\n  clear       - Wipe the CLI console logs\n  close       - Close terminal dashboard";
        break;
      case 'about':
        output = "Ajay Kumar is an Associate Product Manager + AI Engineer. He specializes in designing functional LLM automation pipelines, writing scalable full-stack React/Node.js web-apps, and coordinating agile Scrum sprints to ship user-centric products.";
        break;
      case 'skills':
        output = "=== ARCHITECTURE DUMP ===\n- PM Stack: Sprint Roadmapping, Figma, Jira, Funnel Metrics, Wireframes\n- AI Stack: Python, PyTorch, LangChain, OpenAI APIs, Gemini Orchestration\n- Web Dev: React.js, Vite, Tailwind CSS, Node.js, Express, MongoDB, REST";
        break;
      case 'projects':
        output = "=== ACTIVE PORTFOLIO ===\n1. HIRETRACK AI (2026) - AI Recruiting SaaS with LinkedIn pipeline engine.\n2. MINDEASE (2025) - Cognitive focus / AI mental companion application.\n3. CAREERPULSE (2025) - Job discovery search analytics & recommendation.\n4. MARKET RISK APP (2024) - Statistical risk models & Monte Carlo simulator.";
        break;
      case 'konami':
        output = "🚀 DETECTING KONAMI KEYCODE... MATCH FOUND!\nActivating retro synthwave soundscape and cybernetic visualizer mode. Enjoy the glow!";
        setTimeout(() => {
          onKonamiTrigger();
        }, 800);
        break;
      case 'hire':
        output = "⚡ DISPATCHING HIRE-MODE INTERRUPT...\nHidden Offer mode successfully unlocked! Gold theme and matrices loaded.";
        setTimeout(() => {
          onHireModeToggle();
        }, 800);
        break;
      case 'clear':
        setHistory([]);
        setInputVal('');
        return;
      case 'close':
        onClose();
        setInputVal('');
        return;
      default:
        output = `bash: command not found: '${cmd}'. Type 'help' for available commands.`;
        type = "error";
    }

    setHistory([...newHistory, { text: output, type }, { text: "", type: "empty" }]);
    setInputVal('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-xl bg-black border border-spotify-green/30 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(29,185,84,0.15)] flex flex-col h-80 font-mono text-xs text-[#1DB954]"
      >
        {/* Terminal Header */}
        <div className="bg-[#121212] border-b border-[#282828] px-4 py-2 flex items-center justify-between text-spotify-textMuted select-none">
          <div className="flex items-center gap-2">
            <FiTerminal className="text-spotify-green" />
            <span className="font-semibold text-[10px]">ajay@root:~ - Unix-OS Terminal</span>
          </div>
          <div className="flex gap-1.5">
            <button className="w-3 h-3 rounded-full bg-yellow-500/20 hover:bg-yellow-500/50 flex items-center justify-center transition-colors">
              <FiMinus className="text-[6px] text-black" />
            </button>
            <button className="w-3 h-3 rounded-full bg-blue-500/20 hover:bg-blue-500/50 flex items-center justify-center transition-colors">
              <FiMaximize2 className="text-[6px] text-black" />
            </button>
            <button 
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-red-500/20 hover:bg-red-500 flex items-center justify-center transition-colors"
            >
              <FiX className="text-[6px] text-black" />
            </button>
          </div>
        </div>

        {/* Scroll Output */}
        <div className="flex-1 p-4 overflow-y-auto no-scrollbar flex flex-col gap-1.5 bg-[#050505]">
          {history.map((line, index) => {
            if (line.type === "empty") return <div key={index} className="h-1" />;
            
            let color = "text-[#1DB954]";
            if (line.type === "user") color = "text-white";
            if (line.type === "system") color = "text-cyan-400 font-bold";
            if (line.type === "error") color = "text-red-500";
            if (line.type === "output") color = "text-spotify-textMuted";

            return (
              <div key={index} className={`${color} whitespace-pre-wrap leading-relaxed`}>
                {line.text}
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>

        {/* CLI Input form */}
        <form 
          onSubmit={handleCommandSubmit}
          className="bg-black border-t border-[#282828] p-3 flex items-center gap-1.5"
        >
          <span className="text-white select-none">ajay-user:~$</span>
          <input
            type="text"
            ref={inputRef}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-transparent text-white border-none outline-none caret-spotify-green"
            placeholder="Type 'help'..."
            title="Terminal input command"
          />
        </form>
      </motion.div>
    </div>
  );
};

export default SecretTerminal;
