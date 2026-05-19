import React from 'react';
import { FiHome, FiSearch, FiLayers, FiPlus, FiHeart, FiFolder, FiMusic, FiBookOpen, FiUser, FiChevronRight, FiBriefcase, FiMail } from 'react-icons/fi';
import { FaSpotify } from 'react-icons/fa';

const Sidebar = ({ activeSection, setActiveSection, onSearchClick, onChatbotToggle, isChatbotOpen }) => {
  
  const menuItems = [
    { id: 'hero', label: 'Home', icon: FiHome },
    { id: 'search', label: 'Search', icon: FiSearch, action: onSearchClick },
    { id: 'library', label: 'Your Library', icon: FiLayers, isHeader: true },
  ];

  const playlists = [
    { id: 'about', label: 'Product Mindset', type: 'Playlist • Ajay', icon: FiBookOpen, color: 'from-emerald-500 to-green-700' },
    { id: 'experience', label: 'Work Experience', type: 'Playlist • 2 Items', icon: FiBriefcase, color: 'from-blue-500 to-indigo-700' },
    { id: 'projects', label: 'Featured Projects', type: 'Playlist • 4 Items', icon: FiFolder, color: 'from-purple-500 to-pink-700' },
    { id: 'skills', label: 'AI & Full Stack Skills', type: 'Playlist • Skills', icon: FiLayers, color: 'from-cyan-500 to-blue-700' },
    { id: 'vibe', label: 'Music Lounge', type: 'Playlist • Coding Vibes', icon: FiMusic, color: 'from-spotify-green to-teal-900' },
    { id: 'contact', label: 'Get In Touch', type: 'Playlist • Collab', icon: FiMail, color: 'from-orange-500 to-red-600' }
  ];

  const albums = [
    { id: 'hiretrack', label: 'HireTrack AI', year: '2026', type: 'Project • SaaS' },
    { id: 'mindease', label: 'MindEase', year: '2025', type: 'Project • AI' },
    { id: 'careerpulse', label: 'CareerPulse', year: '2025', type: 'Project • Analytics' },
    { id: 'marketrisk', label: 'Market Risk App', year: '2024', type: 'Project • Finance' }
  ];

  const handleItemClick = (id, action) => {
    if (action) {
      action();
      return;
    }
    
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside className="w-64 bg-black h-[calc(100vh-90px)] p-2 flex flex-col gap-2 select-none text-spotify-textMuted hidden md:flex">
      {/* Brand & Main Nav */}
      <div className="bg-[#121212] rounded-lg p-5 flex flex-col gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-2 text-white font-satoshi font-extrabold text-xl px-2 mb-2 cursor-pointer hover:text-spotify-green transition-colors">
          <FaSpotify className="text-spotify-green text-2xl animate-pulse" />
          <span>APM + AI Builder</span>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-4 font-semibold text-sm">
          {menuItems.map((item) => {
            if (item.isHeader) return null;
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id, item.action)}
                className={`flex items-center gap-5 hover:text-white transition-colors duration-200 text-left w-full py-1 px-2 rounded ${
                  isActive ? 'text-white font-bold' : ''
                }`}
              >
                <Icon className={`text-xl ${isActive ? 'text-spotify-green' : ''}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Library Section */}
      <div className="bg-[#121212] rounded-lg flex-1 flex flex-col overflow-hidden">
        {/* Library Header */}
        <div className="flex items-center justify-between p-4 pb-2 text-sm font-bold">
          <button 
            onClick={() => handleItemClick('about')}
            className="flex items-center gap-3 hover:text-white transition-colors"
          >
            <FiLayers className="text-xl" />
            <span>Your Library</span>
          </button>
          <div className="flex gap-2 text-lg">
            <button className="hover:text-white p-1 rounded-full hover:bg-spotify-hover transition-colors" title="Create Playlist or Album">
              <FiPlus />
            </button>
            <button className="hover:text-white p-1 rounded-full hover:bg-spotify-hover transition-colors" title="Show More">
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-2 px-4 pb-3 pt-1 text-xs">
          <span className="bg-spotify-hover text-white px-3 py-1.5 rounded-full font-medium hover:bg-[#323232] cursor-pointer transition-colors">
            Playlists
          </span>
          <span className="bg-spotify-hover text-white px-3 py-1.5 rounded-full font-medium hover:bg-[#323232] cursor-pointer transition-colors">
            Projects
          </span>
          <span className="bg-spotify-hover text-white px-3 py-1.5 rounded-full font-medium hover:bg-[#323232] cursor-pointer transition-colors">
            Skills
          </span>
        </div>

        {/* Scrollable List container */}
        <div className="flex-1 overflow-y-auto px-2 pb-4 flex flex-col gap-1 no-scrollbar">
          
          {/* Creative AI DJ Playlist Link */}
          <button
            onClick={onChatbotToggle}
            className={`flex items-center gap-3 p-2 rounded-md hover:bg-spotify-hover/60 transition-all duration-200 text-left w-full group border border-spotify-green/10 bg-spotify-green/5 mb-1.5 ${
              isChatbotOpen ? 'bg-spotify-hover/80 text-white border-spotify-green/30' : ''
            }`}
          >
            <div className="w-12 h-12 rounded bg-gradient-to-tr from-spotify-green via-emerald-400 to-cyan-400 flex items-center justify-center text-black text-lg shadow-md group-hover:scale-105 transition-transform duration-300 relative">
              <span className="flex h-2 w-2 absolute -top-0.5 -right-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-spotify-green opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-spotify-green"></span>
              </span>
              <FiMusic className="text-black group-hover:rotate-12 transition-transform" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className={`text-sm font-extrabold truncate ${isChatbotOpen ? 'text-spotify-green' : 'text-white'}`}>
                  AskAI
                </p>
                <span className="text-[8px] bg-spotify-green/20 text-spotify-green px-1 rounded font-bold animate-pulse">LIVE</span>
              </div>
              <p className="text-xs text-spotify-textMuted font-medium truncate">Podcast • Live Co-Pilot</p>
            </div>
          </button>

          {/* Playlists */}
          <div className="flex flex-col gap-0.5">
            {playlists.map((playlist) => {
              const Icon = playlist.icon;
              const isActive = activeSection === playlist.id;

              return (
                <button
                  key={playlist.id}
                  onClick={() => handleItemClick(playlist.id)}
                  className={`flex items-center gap-3 p-2 rounded-md hover:bg-spotify-hover/60 transition-all duration-200 text-left w-full group ${
                    isActive ? 'bg-spotify-hover/80 text-white' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded bg-gradient-to-br ${playlist.color} flex items-center justify-center text-white text-lg shadow-md group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="group-hover:rotate-6 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${isActive ? 'text-spotify-green' : 'text-white'}`}>
                      {playlist.label}
                    </p>
                    <p className="text-xs text-spotify-textMuted font-medium truncate">{playlist.type}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Separator line */}
          <div className="border-t border-[#232323] my-2 mx-2"></div>

          {/* Custom Albums (Projects Sub-sections) */}
          <div className="flex flex-col gap-0.5 px-1">
            <p className="text-[10px] font-bold tracking-wider text-spotify-textMuted uppercase mb-1 px-2">PROJECT ARCHIVES</p>
            {albums.map((album) => {
              const isActive = activeSection === album.id;
              return (
                <button
                  key={album.id}
                  onClick={() => {
                    // Find the projects section
                    handleItemClick('projects');
                    // We can highlight or select that project in projects page if we want
                    setTimeout(() => {
                      const projElem = document.getElementById(`project-${album.id}`);
                      if (projElem) {
                        projElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        projElem.classList.add('ring-2', 'ring-spotify-green', 'scale-105');
                        setTimeout(() => {
                          projElem.classList.remove('ring-2', 'ring-spotify-green', 'scale-105');
                        }, 2000);
                      }
                    }, 500);
                  }}
                  className="p-2 rounded hover:bg-spotify-hover/40 transition-colors duration-200 text-left w-full"
                >
                  <p className="text-sm font-semibold text-white truncate">{album.label}</p>
                  <p className="text-xs text-spotify-textMuted truncate">{album.type} • {album.year}</p>
                </button>
              );
            })}
          </div>

          {/* Separator line */}
          <div className="border-t border-[#232323] my-2 mx-2"></div>

          {/* Artist link */}
          <button
            onClick={() => handleItemClick('about')}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-spotify-hover/40 transition-colors text-left w-full"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden bg-spotify-hover border border-white/5 flex items-center justify-center text-white text-lg relative">
              <FiUser />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">Ajay Kumar</p>
              <p className="text-xs text-spotify-textMuted truncate">Artist • APM & AI Engineer</p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
