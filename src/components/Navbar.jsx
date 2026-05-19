import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiSearch, FiExternalLink, FiDownload, FiTerminal, FiLinkedin, FiGithub } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = ({ 
  searchQuery, 
  setSearchQuery, 
  onTerminalToggle, 
  onHireModeToggle, 
  isHireMode,
  activeSection
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleResumeDownload = () => {
    // We can create a mock resume download or link to a real pdf
    alert("Opening Resume PDF... (Mock file link triggers resume download / preview)");
  };

  return (
    <nav className="h-16 glass-nav px-6 flex items-center justify-between sticky top-0 z-40 select-none text-white">
      {/* Navigation Buttons and Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* Mock back/forward buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <button 
            className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:text-white text-[#b3b3b3] transition-colors"
            onClick={() => alert("History navigation: Going back in Ajay's timeline...")}
            title="Go back"
          >
            <FiChevronLeft className="text-xl" />
          </button>
          <button 
            className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center hover:text-white text-[#b3b3b3] transition-colors"
            onClick={() => alert("History navigation: Fast-forwarding to future APM roles...")}
            title="Go forward"
          >
            <FiChevronRight className="text-xl" />
          </button>
        </div>

        {/* Spotify Search Bar */}
        <div className="relative flex-1 group">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-spotify-textMuted group-focus-within:text-white text-lg transition-colors" />
          <input
            type="text"
            placeholder="Search projects, skills, tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#323232] rounded-full pl-10 pr-4 text-sm font-medium text-white placeholder-spotify-textMuted outline-none border border-transparent focus:border-white/10 transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-spotify-textMuted hover:text-white bg-white/10 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Profile & CTA Panel */}
      <div className="flex items-center gap-4">
        {/* Floating Glow CTA */}
        <button
          onClick={onHireModeToggle}
          className={`hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-300 ${
            isHireMode 
              ? 'bg-spotify-green text-black hover:scale-105 shadow-[0_0_15px_rgba(29,185,84,0.4)]'
              : 'bg-white text-black hover:bg-spotify-green hover:text-black hover:scale-105 hover:shadow-[0_0_15px_rgba(29,185,84,0.3)]'
          }`}
        >
          {isHireMode ? '⚡ Active Offer Mode' : 'Hire Ajay'}
        </button>

        {/* Interactive Profile Widget */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 bg-black/60 hover:bg-[#282828] p-1 pr-3 rounded-full transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-full bg-spotify-green text-black flex items-center justify-center font-bold text-xs overflow-hidden">
              AK
            </div>
            <span className="text-xs font-bold hidden sm:inline-block">Ajay Kumar</span>
            <span className="text-[10px] text-spotify-green font-semibold bg-spotify-green/10 border border-spotify-green/20 px-1.5 py-0.5 rounded-full uppercase scale-90">APM</span>
          </button>

          {/* Dropdown Menu */}
          {profileDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-[#181818] border border-white/5 rounded-md shadow-2xl p-1 z-50 animate-fadeIn text-sm">
                <button
                  onClick={() => {
                    handleResumeDownload();
                    setProfileDropdownOpen(false);
                  }}
                  className="flex items-center justify-between w-full text-left px-3 py-2 text-spotify-textMuted hover:text-white hover:bg-spotify-hover rounded transition-colors"
                >
                  <span>Download Resume</span>
                  <FiDownload className="text-xs" />
                </button>

                <a
                  href="https://www.linkedin.com/in/ajay-kumar-166b9824b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full text-left px-3 py-2 text-spotify-textMuted hover:text-white hover:bg-spotify-hover rounded transition-colors"
                >
                  <span>LinkedIn Profile</span>
                  <FiLinkedin className="text-xs" />
                </a>

                <a
                  href="https://github.com/ajaykumar057"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full text-left px-3 py-2 text-spotify-textMuted hover:text-white hover:bg-spotify-hover rounded transition-colors"
                >
                  <span>GitHub Profile</span>
                  <FiGithub className="text-xs" />
                </a>

                <button
                  onClick={() => {
                    onTerminalToggle();
                    setProfileDropdownOpen(false);
                  }}
                  className="flex items-center justify-between w-full text-left px-3 py-2 text-spotify-textMuted hover:text-white hover:bg-spotify-hover rounded transition-colors border-t border-white/5 pt-2 mt-1"
                >
                  <span className="text-spotify-green font-bold">Secret Terminal</span>
                  <FiTerminal className="text-spotify-green text-xs" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
