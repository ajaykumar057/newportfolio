import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { FaLinkedin, FaGithub, FaEnvelope, FaPlay, FaPause, FaFolder, FaCircle, FaInfoCircle, FaTerminal, FaTrophy, FaLightbulb, FaBriefcase, FaCode } from 'react-icons/fa';
import { FiVolume2, FiVolumeX, FiCheck, FiMail, FiSend, FiLock, FiInfo } from 'react-icons/fi';

import ThreeBackground from './components/ThreeBackground';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import MusicPlayer from './components/MusicPlayer';
import AskAjayAI from './components/AskAjayAI';
import SkillsRadar from './components/SkillsRadar';
import SecretTerminal from './components/SecretTerminal';

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isHireMode, setIsHireMode] = useState(false);
  const [isRetroMatrix, setIsRetroMatrix] = useState(false);

  // Track details passed to player
  const [currentTrack, setCurrentTrack] = useState({
    title: "HireTrack AI (APM Single)",
    artist: "Ajay Kumar (ft. AI Orchestra)"
  });

  // Soundboard state
  const [rainVolume, setRainVolume] = useState(0);
  const [coffeeVolume, setCoffeeVolume] = useState(0);
  const [typingVolume, setTypingVolume] = useState(0);

  // Audio elements for Soundboard
  const rainAudioRef = useRef(null);
  const coffeeAudioRef = useRef(null);
  const typingAudioRef = useRef(null);

  // Active Album/Project Details Modal
  const [selectedProject, setSelectedProject] = useState(null);

  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Typing effect content
  const typingRoles = ["Developer", "AI/ML Specialist", "Product Strategist", "AI Engineer", "Full Stack Developer", "SaaS Builder"];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentRoleText, setCurrentRoleText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Konami Code sequence
  const [konamiKeys, setKonamiKeys] = useState([]);

  // Initialize Lenis
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Konami Code Event Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const updatedKeys = [...konamiKeys, e.key].slice(-10);
      setKonamiKeys(updatedKeys);

      const targetSequence = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'b', 'a'
      ];

      if (updatedKeys.join(',') === targetSequence.join(',')) {
        setIsRetroMatrix(true);
        setIsTerminalOpen(true);
        alert("🎮 KONAMI CODE DETECTED! Booting Cyber Retro Terminal mode...");
      }

      // Backtick toggles Terminal
      if (e.key === '`') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiKeys]);

  // Typing effect loop
  useEffect(() => {
    let timer;
    const activeRole = typingRoles[currentRoleIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentRoleText(activeRole.substring(0, currentRoleText.length - 1));
      }, 50);
    } else {
      timer = setTimeout(() => {
        setCurrentRoleText(activeRole.substring(0, currentRoleText.length + 1));
      }, 100);
    }

    if (!isDeleting && currentRoleText === activeRole) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && currentRoleText === '') {
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % typingRoles.length);
    }

    return () => clearTimeout(timer);
  }, [currentRoleText, isDeleting, currentRoleIndex]);

  // IntersectionObserver to sync active section with left sidebar
  useEffect(() => {
    const sections = ['hero', 'about', 'experience', 'projects', 'skills', 'vibe', 'contact'];

    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Ambient sound controllers
  useEffect(() => {
    // Setup audio streams
    rainAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2522/2522-84.wav');
    rainAudioRef.current.loop = true;

    coffeeAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2433/2433-84.wav');
    coffeeAudioRef.current.loop = true;

    typingAudioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/1169/1169-84.wav');
    typingAudioRef.current.loop = true;

    return () => {
      rainAudioRef.current?.pause();
      coffeeAudioRef.current?.pause();
      typingAudioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    if (!rainAudioRef.current) return;
    rainAudioRef.current.volume = rainVolume;
    if (rainVolume > 0 && rainAudioRef.current.paused) {
      rainAudioRef.current.play().catch(() => { });
    } else if (rainVolume === 0) {
      rainAudioRef.current.pause();
    }
  }, [rainVolume]);

  useEffect(() => {
    if (!coffeeAudioRef.current) return;
    coffeeAudioRef.current.volume = coffeeVolume;
    if (coffeeVolume > 0 && coffeeAudioRef.current.paused) {
      coffeeAudioRef.current.play().catch(() => { });
    } else if (coffeeVolume === 0) {
      coffeeAudioRef.current.pause();
    }
  }, [coffeeVolume]);

  useEffect(() => {
    if (!typingAudioRef.current) return;
    typingAudioRef.current.volume = typingVolume;
    if (typingVolume > 0 && typingAudioRef.current.paused) {
      typingAudioRef.current.play().catch(() => { });
    } else if (typingVolume === 0) {
      typingAudioRef.current.pause();
    }
  }, [typingVolume]);

  // Form submission via Web3Forms (ideal for static React portfolios)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setFormSubmitted(true);
    setSubmitStatus(null);

    // Setup the Access Key. You can get a free Access Key at: https://web3forms.com
    // You can define this in your .env file as VITE_WEB3FORMS_KEY, or simply paste it here!
    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY || "c598cfdd-3573-4ee5-8699-8a3f7bd585b4";

    if (accessKey === "YOUR_ACCESS_KEY_HERE" || !accessKey || accessKey.trim() === "") {
      // Mock sending if no key is configured yet
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setFormSubmitted(false);
        setSubmitStatus('success');
        setTimeout(() => setSubmitStatus(null), 4000);
      }, 1500);
      return;
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: "New Inquiry from Ajay's Spotify Portfolio",
          from_name: "Ajay's Spotify Portfolio"
        })
      });

      const res = await response.json();
      if (res.success) {
        setFormData({ name: '', email: '', message: '' });
        setSubmitStatus('success');
        setTimeout(() => setSubmitStatus(null), 4000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus(null), 4000);
      }
    } catch (err) {
      console.error("Form submission failure", err);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 4000);
    } finally {
      setFormSubmitted(false);
    }
  };

  // Projects list
  const projects = [
    {
      id: 'hiretrack',
      title: "HireTrack AI",
      category: "SaaS • AI Recruitment",
      year: "2026",
      desc: "An enterprise-grade, highly visual AI-driven job application and candidate networking visualizer.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      color: "from-[#1DB954] to-black",
      features: [
        { track: "01", name: "AI Insight Engine (Resume matching scores)", duration: "0:45" },
        { track: "02", name: "Dynamic Recruiting Kanban Board", duration: "1:15" },
        { track: "03", name: "Smart automated LinkedIn cold-outreach templates", duration: "1:05" },
        { track: "04", name: "Analytical charts tracking interview conversion", duration: "0:50" }
      ],
      tech: ["React.js", "Node.js", "Express", "MongoDB", "OpenAI API", "Tailwind CSS"],
      live: "https://hiretrack-ai-mtgx.onrender.com/",
      github: "https://github.com/ajaykumar057/hiretrack-ai.git"
    },
    {
      id: 'mindease',
      title: "MindEase AI",
      category: "Mobile App • HealthTech",
      year: "2025",
      desc: "Interactive cognitive companion app providing users real-time mindfulness tracks guided by localized emotional classifiers.",
      image: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80",
      color: "from-cyan-500 to-black",
      features: [
        { track: "01", name: "Real-time user voice-pitch emotional classifier", duration: "1:02" },
        { track: "02", name: "Contextual AI guided cognitive behavioral routines", duration: "1:24" },
        { track: "03", name: "Ambient mindfulness audio generative loops", duration: "2:02" }
      ],
      tech: ["React Native", "Python", "TensorFlow", "FastAPI", "MongoDB"],
      live: "https://mindease-app-7vkv-22okiprx3-ajays-projects-cfbb1a47.vercel.app/",
      github: "https://github.com/ajaykumar057/Mindease--app.git"
    },
    {
      id: 'careerpulse',
      title: "CareerPulse Analytics",
      category: "Web Platform • Analytics",
      year: "2025",
      desc: "Robust career discovery and market trend predictor plotting real-time vacancy indexes using deep sector scrapers.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
      color: "from-purple-500 to-black",
      features: [
        { track: "01", name: "Distributed web scrapers feeding job indexes", duration: "1:35" },
        { track: "02", name: "Vector similarity search matching skills to job descriptions", duration: "1:10" },
        { track: "03", name: "Predictive index on salary increments using SARIMA", duration: "0:55" }
      ],
      tech: ["React.js", "Python", "Flask", "PostgreSQL", "Milvus DB", "Recharts"],
      live: "https://huggingface.co/spaces/ajaykumar1/Careerpulse1",
      github: "https://github.com/ajaykumar057/Careerpulse.git"
    },
    {
      id: 'marketrisk',
      title: "Market Risk App",
      category: "Desktop Tool • FinTech",
      year: "2024",
      desc: "Quantitative risk modeling system that performs Monte Carlo simulations to predict stock portfolio depletion thresholds.",
      image: "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=600&auto=format&fit=crop&q=80",
      color: "from-red-500 to-black",
      features: [
        { track: "01", name: "Monte Carlo simulation pipeline for 500+ assets", duration: "2:10" },
        { track: "02", name: "Value at Risk (VaR) and Conditional VaR calculator", duration: "1:15" },
        { track: "03", name: "Interactive matrix correlations graph", duration: "1:05" }
      ],
      tech: ["Python", "Streamlit", "NumPy", "Pandas", "Matplotlib", "yFinance"],
      live: "#",
      github: "#"
    }
  ];

  // Filtering projects and skills by search query
  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tech.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`flex flex-col h-screen overflow-hidden font-satoshi ${isHireMode ? 'bg-[#0f0b00] border-amber-500/20' : 'bg-spotify-black'}`}>

      {/* 3D background visualizer */}
      <ThreeBackground />

      {/* Screen noise texture */}
      <div className="noise-overlay" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-spotify-green rounded-full glow-orb animate-pulse-slow -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-purple rounded-full glow-orb animate-float -z-10" />

      {/* Main shell: Sidebar + Main Frame */}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-90px)] relative">

        {/* Spotify-inspired sidebar */}
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onSearchClick={() => {
            const searchInput = document.querySelector('input[placeholder*="Search"]');
            searchInput?.focus();
          }}
          onChatbotToggle={() => setIsAiOpen(prev => !prev)}
          isChatbotOpen={isAiOpen}
        />

        {/* Dynamic viewport scroll frame */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col pb-24" id="main-scroll-viewport">

          {/* Top Navbar */}
          <Navbar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onTerminalToggle={() => setIsTerminalOpen(prev => !prev)}
            onHireModeToggle={() => setIsHireMode(!isHireMode)}
            isHireMode={isHireMode}
            activeSection={activeSection}
          />

          <div className="px-8 max-w-6xl mx-auto w-full pt-4">

            {/* HERO SECTION */}
            <section id="hero" className="min-h-[80vh] flex flex-col justify-center py-12 relative">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-6"
              >
                {/* Spotify-inspired "Now Playing" Widget */}
                <div className="flex items-center gap-3 bg-black/40 border border-white/5 px-4 py-2 rounded-full w-fit backdrop-blur-md">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-spotify-green opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-spotify-green"></span>
                  </span>
                  <span className="text-xs font-bold text-spotify-textMuted">CURRENTLY BUILDING: </span>
                  <button
                    onClick={() => {
                      setSelectedProject(projects[0]);
                      setCurrentTrack({ title: "HireTrack AI (APM Single)", artist: "Ajay Kumar" });
                    }}
                    className="text-xs font-extrabold text-spotify-green hover:underline flex items-center gap-1.5"
                  >
                    HireTrack AI <FaPlay className="text-[8px]" />
                  </button>
                </div>

                {/* Big bold cinematic heading */}
                <div className="flex flex-col gap-2">
                  <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-white font-satoshi">
                    Hey, I'm Ajay 👋
                  </h1>
                  <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white/90 font-satoshi mt-2 min-h-[48px]">
                    Associate Product Manager + <span className="bg-gradient-to-r from-spotify-green via-cyan-400 to-brand-purple bg-clip-text text-transparent">{currentRoleText}</span>
                    <span className="text-spotify-green animate-pulse">|</span>
                  </h2>
                </div>

                <p className="text-sm md:text-base text-spotify-textMuted max-w-lg leading-relaxed font-medium mt-1">
                  Breathing at the nexus of user discovery funnels and highly complex LLM system architecture. Specialize in driving software products from bare-metal mockups to scalable live deployment.
                </p>

                {/* Call-to-actions */}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  <button
                    onClick={() => {
                      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-full bg-spotify-green text-black font-extrabold text-xs tracking-wider uppercase hover:scale-105 transition-all shadow-[0_0_15px_rgba(29,185,84,0.3)] flex items-center gap-2 hover:shadow-[0_0_20px_rgba(29,185,84,0.5)]"
                  >
                    <FaPlay className="text-[10px]" /> Explore Projects
                  </button>
                  <button
                    onClick={() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-full border border-white/20 bg-transparent text-white font-extrabold text-xs tracking-wider uppercase hover:bg-white hover:text-black transition-all"
                  >
                    Let's Connect
                  </button>
                </div>
              </motion.div>
            </section>

            {/* ABOUT / STORYTELLING SECTION */}
            <section id="about" className="py-20 border-t border-[#232323]">
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-xs font-extrabold text-spotify-green uppercase tracking-widest mb-1">STORYTELLING</p>
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Ajay's Playlists</h2>
                </div>

                {/* Horizontal Storytelling Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                  {/* Card 1: Bio */}
                  <div className="bg-[#181818]/60 hover:bg-[#282828]/80 border border-white/5 hover:border-spotify-green/20 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between h-64 group cursor-pointer glass-card">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-lg bg-green-500/10 text-spotify-green flex items-center justify-center font-bold text-lg">
                        01
                      </div>
                      <span className="text-[10px] bg-spotify-green/10 text-spotify-green px-2.5 py-1 rounded-full font-bold">BIO</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-spotify-green transition-colors">The Journey</h3>
                      <p className="text-xs text-spotify-textMuted mt-2 leading-relaxed">
                        Transitioning from building hard-coded algorithmic models to crafting holistic product scopes. Focused on user empathy.
                      </p>
                    </div>
                  </div>

                  {/* Card 2: Mindset */}
                  <div className="bg-[#181818]/60 hover:bg-[#282828]/80 border border-white/5 hover:border-cyan-500/20 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between h-64 group cursor-pointer glass-card">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold text-lg">
                        02
                      </div>
                      <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-full font-bold">MINDSET</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">Data-Obsessed</h3>
                      <p className="text-xs text-spotify-textMuted mt-2 leading-relaxed">
                        Obsessed with funnel conversions, agile planning models, and continuous product iteration loops.
                      </p>
                    </div>
                  </div>

                  {/* Card 3: AI passion */}
                  <div className="bg-[#181818]/60 hover:bg-[#282828]/80 border border-white/5 hover:border-purple-500/20 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between h-64 group cursor-pointer glass-card">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-lg">
                        03
                      </div>
                      <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded-full font-bold">AI BEATS</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors">AI Architect</h3>
                      <p className="text-xs text-spotify-textMuted mt-2 leading-relaxed">
                        Trains local neural networks and connects modular LLM orchestration hubs inside functional consumer applications.
                      </p>
                    </div>
                  </div>

                  {/* Card 4: Strategy */}
                  <div className="bg-[#181818]/60 hover:bg-[#282828]/80 border border-white/5 hover:border-amber-500/20 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between h-64 group cursor-pointer glass-card">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg">
                        04
                      </div>
                      <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-bold">GOAL</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">Scale SaaS</h3>
                      <p className="text-xs text-spotify-textMuted mt-2 leading-relaxed">
                        Building functional AI automation platforms that resolve modern engineering bottleneck hurdles and drive active revenue pipelines.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Animated Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 bg-black/40 border border-white/5 p-6 rounded-xl backdrop-blur-md">
                  <div className="flex flex-col items-center justify-center text-center">
                    <h3 className="text-3xl md:text-5xl font-extrabold text-spotify-green font-satoshi">10+</h3>
                    <p className="text-xs text-spotify-textMuted uppercase font-bold mt-2">AI Projects Built</p>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center border-l border-white/10">
                    <h3 className="text-3xl md:text-5xl font-extrabold text-cyan-400 font-satoshi">25+</h3>
                    <p className="text-xs text-spotify-textMuted uppercase font-bold mt-2">Features Shipped</p>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center border-l border-white/10">
                    <h3 className="text-3xl md:text-5xl font-extrabold text-brand-purple font-satoshi">10k+</h3>
                    <p className="text-xs text-spotify-textMuted uppercase font-bold mt-2">User Issues Solved</p>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center border-l border-white/10">
                    <h3 className="text-3xl md:text-5xl font-extrabold text-amber-400 font-satoshi">5+</h3>
                    <p className="text-xs text-spotify-textMuted uppercase font-bold mt-2">Agile Sprints Led</p>
                  </div>
                </div>
              </div>
            </section>

            {/* EXPERIENCE SECTION */}
            <section id="experience" className="py-20 border-t border-[#232323]">
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-xs font-extrabold text-spotify-green uppercase tracking-widest mb-1">PROVEN TRACK RECORD</p>
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Experience Albums</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Experience Card 1 */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#181818]/60 border border-white/5 hover:border-spotify-green/20 rounded-xl p-6 flex flex-col justify-between gap-6 cursor-pointer glass-card"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-spotify-green bg-spotify-green/10 border border-spotify-green/20 px-2 py-0.5 rounded-full font-bold uppercase">ALBUM</span>
                          <h3 className="text-xl font-bold text-white mt-2">U2opia Mobile</h3>
                          <p className="text-xs text-spotify-textMuted font-bold">Associate Product Manager Intern</p>
                        </div>
                        <span className="text-xs text-spotify-textMuted font-semibold bg-[#2a2a2a] px-3 py-1 rounded">2025</span>
                      </div>

                      {/* Accomplishments */}
                      <ul className="text-xs text-spotify-textMuted flex flex-col gap-2 mt-4 leading-relaxed font-medium">
                        <li className="flex items-start gap-2">
                          <span className="text-spotify-green mt-0.5">•</span>
                          <span>Coordinated cross-functional scrum sprints across UX and Engineering squads to deploy modular application features.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-spotify-green mt-0.5">•</span>
                          <span>Conducted exhaustive competitor studies and funnel tracking analyses, driving a **15% lift in Monthly Active Users (MAUs)**.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-spotify-green mt-0.5">•</span>
                          <span>Mapped detailed PRDs and formulated analytics indexes to benchmark user feedback metrics.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Metrics graph mockup */}
                    <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-3 rounded-lg text-xs font-semibold">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-spotify-textMuted">Funnel Conversion Rate</span>
                          <span className="text-spotify-green">+15%</span>
                        </div>
                        <div className="w-full bg-[#323232] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-spotify-green h-full w-[85%] rounded-full shadow-[0_0_8px_#1DB954]" />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Experience Card 2 */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-[#181818]/60 border border-white/5 hover:border-cyan-500/20 rounded-xl p-6 flex flex-col justify-between gap-6 cursor-pointer glass-card"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-cyan-400 bg-cyan-400/10 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold uppercase">EP ALBUM</span>
                          <h3 className="text-xl font-bold text-white mt-2">Prodigy Infotech</h3>
                          <p className="text-xs text-spotify-textMuted font-bold">AI / ML Engineer Intern</p>
                        </div>
                        <span className="text-xs text-spotify-textMuted font-semibold bg-[#2a2a2a] px-3 py-1 rounded">2024</span>
                      </div>

                      {/* Accomplishments */}
                      <ul className="text-xs text-spotify-textMuted flex flex-col gap-2 mt-4 leading-relaxed font-medium">
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-400 mt-0.5">•</span>
                          <span>Constructed predictive algorithms and designed customized feature engineering arrays.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-400 mt-0.5">•</span>
                          <span>Cleaned large dataset tables, mitigating variance gaps, which boosted validation testing model accuracy by **18%**.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-cyan-400 mt-0.5">•</span>
                          <span>Designed REST API hooks to ingest tabular feeds in real-time, decreasing server-side computation overhead.</span>
                        </li>
                      </ul>
                    </div>

                    {/* Metrics graph mockup */}
                    <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-3 rounded-lg text-xs font-semibold">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-spotify-textMuted">Model Inference Speedup</span>
                          <span className="text-cyan-400">+18%</span>
                        </div>
                        <div className="w-full bg-[#323232] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-cyan-400 h-full w-[80%] rounded-full shadow-[0_0_8px_#06b6d4]" />
                        </div>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </div>
            </section>

            {/* PROJECTS SECTION */}
            <section id="projects" className="py-20 border-t border-[#232323]">
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs font-extrabold text-spotify-green uppercase tracking-widest mb-1">RELIABLE DISCOGRAPHY</p>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Featured Album Covers</h2>
                  </div>
                  {searchQuery && (
                    <span className="text-xs text-spotify-textMuted font-medium bg-[#242424] px-3 py-1 rounded">
                      Filtered: {filteredProjects.length} results
                    </span>
                  )}
                </div>

                {/* Spotify-style Album Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      id={`project-${project.id}`}
                      whileHover={{ y: -5 }}
                      onClick={() => {
                        setSelectedProject(project);
                        setCurrentTrack({
                          title: `${project.title} (Production Mix)`,
                          artist: `Ajay Kumar • ${project.year}`
                        });
                      }}
                      className="bg-[#181818]/60 p-4 rounded-xl border border-white/5 hover:bg-[#282828]/60 transition-all duration-300 group cursor-pointer relative shadow-lg flex flex-col justify-between"
                    >
                      {/* Album Art Image Wrapper */}
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#242424] shadow-md">
                        <img
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Hidden hover overlay & Green play bubble */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <button className="w-12 h-12 rounded-full bg-spotify-green text-black flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-all duration-300 hover:scale-110 active:scale-95">
                            <FaPlay className="ml-1 text-black text-sm" />
                          </button>
                        </div>
                        <span className="absolute top-2 right-2 bg-black/80 backdrop-blur text-[9px] font-bold text-white px-2 py-0.5 rounded uppercase border border-white/10">
                          {project.year}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="mt-4 flex-1">
                        <h3 className="text-sm font-bold text-white group-hover:text-spotify-green transition-colors truncate">
                          {project.title}
                        </h3>
                        <p className="text-[11px] text-spotify-textMuted mt-1 leading-normal font-semibold truncate">
                          {project.category}
                        </p>
                        <p className="text-[10px] text-spotify-textMuted/70 mt-2 leading-relaxed font-medium line-clamp-2">
                          {project.desc}
                        </p>
                      </div>

                      {/* Tech stack pills wrapper */}
                      <div className="flex flex-wrap gap-1 mt-3.5">
                        {project.tech.slice(0, 3).map((t, idx) => (
                          <span key={idx} className="text-[9px] bg-white/5 border border-white/5 text-spotify-textMuted px-2 py-0.5 rounded font-bold uppercase">
                            {t}
                          </span>
                        ))}
                        {project.tech.length > 3 && (
                          <span className="text-[9px] text-spotify-textMuted/80 font-bold px-1 py-0.5">+{project.tech.length - 3}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {filteredProjects.length === 0 && (
                    <div className="col-span-full py-12 text-center text-spotify-textMuted text-xs font-bold bg-[#181818]/20 border border-white/5 rounded-xl">
                      🔍 No album archives match your query. Try searching "AI" or "React".
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* SKILLS SECTION */}
            <section id="skills" className="py-20 border-t border-[#232323]">
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-xs font-extrabold text-spotify-green uppercase tracking-widest mb-1">COMPETENCY INDEX</p>
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Agile & AI Skills</h2>
                </div>

                {/* Radar and Progress Component */}
                <SkillsRadar />
              </div>
            </section>

            {/* MUSIC / VIBE LOUNGE */}
            <section id="vibe" className="py-20 border-t border-[#232323]">
              <div className="flex flex-col gap-8">
                <div>
                  <p className="text-xs font-extrabold text-spotify-green uppercase tracking-widest mb-1">INTERACTIVE VIBE</p>
                  <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Vibe Lounge</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Vinyl Record Player Card */}
                  <div className="bg-[#181818]/60 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-6 glass lg:col-span-1 relative group">
                    <p className="text-[10px] font-extrabold text-spotify-green uppercase tracking-wider absolute top-4 left-6">Vibe Controller</p>

                    {/* Vinyl Record */}
                    <div className="relative w-44 h-44 rounded-full bg-[#121212] border-4 border-[#282828] flex items-center justify-center shadow-2xl group/vinyl">
                      {/* Outer groves lines */}
                      <div className="absolute inset-2 rounded-full border border-black/60 opacity-30" />
                      <div className="absolute inset-5 rounded-full border border-black/60 opacity-30" />
                      <div className="absolute inset-8 rounded-full border border-black/60 opacity-30" />
                      <div className="absolute inset-12 rounded-full border border-black/60 opacity-30" />

                      {/* Spinning core art */}
                      <motion.div
                        animate={true ? { rotate: 360 } : {}}
                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                        className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-black/80 flex items-center justify-center text-xs font-bold text-black"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120')" }}
                      >
                        <div className="w-4 h-4 rounded-full bg-spotify-black" />
                      </motion.div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white">Interactive coding tracks</h4>
                      <p className="text-xs text-spotify-textMuted mt-1">Spin chill tracks directly into your speakers. Perfect for agile reviews.</p>
                    </div>
                  </div>

                  {/* Soundboard Ambient Overlay Mix */}
                  <div className="bg-[#181818]/60 border border-white/5 rounded-xl p-6 flex flex-col justify-center gap-5 glass lg:col-span-2">
                    <div className="flex flex-col">
                      <p className="text-[10px] font-extrabold text-spotify-green uppercase tracking-wider mb-1">Ambient Soundboard</p>
                      <h4 className="text-sm font-bold text-white">Create Your Coding Environment</h4>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Rain Volume Slider */}
                      <div className="flex items-center justify-between gap-4 bg-black/30 p-3 rounded-lg border border-white/5">
                        <span className="text-xs text-white/90 font-bold min-w-[100px]">🌧️ Rain Storm</span>
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={rainVolume}
                            onChange={(e) => setRainVolume(parseFloat(e.target.value))}
                            className="w-full accent-spotify-green h-1 rounded-full cursor-pointer bg-[#333] transition-all outline-none"
                            title="Rain volume"
                          />
                          <span className="text-[10px] text-spotify-textMuted w-8 font-bold">{Math.round(rainVolume * 100)}%</span>
                        </div>
                      </div>

                      {/* Coffee Shop Volume Slider */}
                      <div className="flex items-center justify-between gap-4 bg-black/30 p-3 rounded-lg border border-white/5">
                        <span className="text-xs text-white/90 font-bold min-w-[100px]">☕ Coffee Shop</span>
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={coffeeVolume}
                            onChange={(e) => setCoffeeVolume(parseFloat(e.target.value))}
                            className="w-full accent-spotify-green h-1 rounded-full cursor-pointer bg-[#333] transition-all outline-none"
                            title="Coffee shop volume"
                          />
                          <span className="text-[10px] text-spotify-textMuted w-8 font-bold">{Math.round(coffeeVolume * 100)}%</span>
                        </div>
                      </div>

                      {/* Coding typing Sound */}
                      <div className="flex items-center justify-between gap-4 bg-black/30 p-3 rounded-lg border border-white/5">
                        <span className="text-xs text-white/90 font-bold min-w-[100px]">⌨️ Mechanical Keys</span>
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={typingVolume}
                            onChange={(e) => setTypingVolume(parseFloat(e.target.value))}
                            className="w-full accent-spotify-green h-1 rounded-full cursor-pointer bg-[#333] transition-all outline-none"
                            title="Mechanical keys volume"
                          />
                          <span className="text-[10px] text-spotify-textMuted w-8 font-bold">{Math.round(typingVolume * 100)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spotify Playlist Embed Mock */}
                <div className="w-full bg-[#181818]/20 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-spotify-green">🎵</span>
                    <div>
                      <p className="text-xs text-white font-bold">Curated Playlist: APM Coding Beats</p>
                      <p className="text-[10px] text-spotify-textMuted">12 tracks • 48 min • Synced from Ajay's Spotify archive</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert("Embedding Spotify playback widget... (Opens real Ajay's productivity stream)")}
                    className="bg-[#242424] hover:bg-[#2e2e2e] text-white text-[10px] font-extrabold tracking-wider uppercase px-4 py-2 rounded-full border border-white/5 hover:scale-105 active:scale-95 transition-all"
                  >
                    Open Live Playlist
                  </button>
                </div>
              </div>
            </section>

            {/* CONTACT / GLASSMORPHISM FORM */}
            <section id="contact" className="py-20 border-t border-[#232323]">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Info Text */}
                <div className="lg:col-span-2 flex flex-col justify-center gap-4">
                  <div>
                    <p className="text-xs font-extrabold text-spotify-green uppercase tracking-widest mb-1">COLLABORATION</p>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Let's Connect</h2>
                  </div>
                  <p className="text-xs text-spotify-textMuted leading-relaxed font-semibold">
                    Ajay is actively reviewing Product and AI roles. Send a direct ping using the terminal, ask the bot, or drop a quick note here!
                  </p>

                  {/* Social Handles */}
                  <div className="flex items-center gap-3 mt-4 text-spotify-textMuted text-sm font-semibold">
                    <a href="https://www.linkedin.com/in/ajay-kumar-166b9824b" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors bg-[#181818] px-3.5 py-2 rounded-lg border border-white/5">
                      <FaLinkedin className="text-spotify-green" /> LinkedIn
                    </a>
                    <a href="https://github.com/ajaykumar057" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors bg-[#181818] px-3.5 py-2 rounded-lg border border-white/5">
                      <FaGithub className="text-white" /> GitHub
                    </a>
                  </div>
                </div>

                {/* Glassmorphism contact form */}
                <div className="lg:col-span-3 bg-[#181818]/60 border border-white/5 rounded-xl p-6 relative glass">
                  <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-extrabold text-spotify-textMuted uppercase tracking-wider">Your Name</label>
                        <input
                          type="text"
                          placeholder="Ajay's Future Employer"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-[#242424] hover:bg-[#282828] border border-[#2d2d2d] rounded-lg px-4 py-2.5 text-xs text-white placeholder-spotify-textMuted/60 outline-none focus:border-spotify-green transition-colors"
                          required
                          title="Contact name"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-extrabold text-spotify-textMuted uppercase tracking-wider">Your Email</label>
                        <input
                          type="email"
                          placeholder="hiring@techstartup.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-[#242424] hover:bg-[#282828] border border-[#2d2d2d] rounded-lg px-4 py-2.5 text-xs text-white placeholder-spotify-textMuted/60 outline-none focus:border-spotify-green transition-colors"
                          required
                          title="Contact email"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-extrabold text-spotify-textMuted uppercase tracking-wider">Message Details</label>
                      <textarea
                        rows="4"
                        placeholder="Hi Ajay! We love HireTrack AI. Let's schedule a chat about our APM role next week..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-[#242424] hover:bg-[#282828] border border-[#2d2d2d] rounded-lg px-4 py-2.5 text-xs text-white placeholder-spotify-textMuted/60 outline-none focus:border-spotify-green transition-colors resize-none"
                        required
                        title="Contact message"
                      />
                    </div>

                    {submitStatus === 'success' && (
                      <div className="text-spotify-green text-xs font-bold text-center bg-spotify-green/10 border border-spotify-green/20 py-2.5 rounded-lg animate-pulse">
                        ✓ Form submitted successfully!
                      </div>
                    )}

                    {submitStatus === 'error' && (
                      <div className="text-red-500 text-xs font-bold text-center bg-red-500/10 border border-red-500/20 py-2.5 rounded-lg">
                        ⚠️ Failed to send message. Please try again.
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={formSubmitted}
                      className="w-full py-3 rounded-lg bg-spotify-green hover:bg-emerald-400 text-black font-extrabold text-xs tracking-wider uppercase transition-all duration-300 hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {formSubmitted ? (
                        <>⚡ Sending Transmission...</>
                      ) : (
                        <>✉️ Submit Inquiry</>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </section>

            {/* MINIMAL GLOWING FOOTER */}
            <footer className="py-12 border-t border-[#232323]/50 flex flex-col items-center justify-center gap-3 text-center select-none text-spotify-textMuted">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/40">DESIGNED & BUILT BY AJAY KUMAR</p>
              <p className="text-[9px] font-bold text-spotify-green/60">Powered by React, Tailwind CSS, & Advanced AI agents • 2026</p>
            </footer>

          </div>
        </main>
      </div>

      {/* FLOATING MUSIC PLAYER (BOTTOM) */}
      <MusicPlayer
        onLyricsToggle={() => setIsAiOpen(prev => !prev)}
        showLyrics={isAiOpen}
        currentTrackInfo={currentTrack}
      />

      {/* CREATIVE FLOATING CHATBOT LAUNCHER (Visible when chatbot is closed) */}
      <AnimatePresence>
        {!isAiOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsAiOpen(true)}
            className="fixed bottom-24 right-6 z-40 bg-[#0c0c0c]/85 backdrop-blur-md text-white pl-3.5 pr-5 py-2.5 rounded-full flex items-center gap-3.5 shadow-[0_15px_40px_rgba(29,185,84,0.25)] hover:shadow-[0_20px_50px_rgba(29,185,84,0.45)] border border-spotify-green/20 hover:border-spotify-green/50 font-bold uppercase group select-none transition-all duration-300"
            title="Open AskAI Co-Pilot"
          >
            {/* Embedded Live Equalizer Disk */}
            <div className="relative w-8 h-8 rounded-full bg-black/60 border border-white/10 group-hover:border-spotify-green/40 flex items-center justify-center shadow-inner overflow-hidden transition-all duration-300">
              <div className="flex items-end gap-[2px] h-3.5 z-10">
                <span className="w-[2px] bg-spotify-green rounded-full animate-eq-1"></span>
                <span className="w-[2px] bg-cyan-400 rounded-full animate-eq-2"></span>
                <span className="w-[2px] bg-brand-purple rounded-full animate-eq-3"></span>
                <span className="w-[2px] bg-spotify-green rounded-full animate-eq-1" style={{ animationDelay: '0.35s' }}></span>
              </div>
              <span className="absolute inset-0 bg-spotify-green/5 group-hover:bg-spotify-green/10 transition-colors pointer-events-none"></span>
            </div>
            
            {/* Meta Typography Labels */}
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-[8px] text-spotify-green tracking-widest group-hover:text-emerald-400 transition-colors">AJAY'S VIBE</span>
              <span className="text-[10px] text-white tracking-widest font-extrabold flex items-center gap-1.5">
                ASKAI
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-spotify-green animate-pulse"></span>
              </span>
            </div>
            
            {/* Quick Speech Notification (disappears on hover or click) */}
            <span className="absolute -top-10 right-0 bg-[#181818] text-white border border-[#282828] text-[9px] font-extrabold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl pointer-events-none group-hover:opacity-0 transition-opacity duration-300">
              ⚡ LIVE Groq Co-Pilot Online!
              <span className="absolute bottom-[-4.5px] right-6 w-2.5 h-2.5 bg-[#181818] border-r border-b border-[#282828] rotate-45"></span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ASK AJAY AI CHATBOT (FLOATING OVERLAY) */}
      <AskAjayAI
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
      />

      {/* EASTER EGG CMD TERMINAL (CLI INTERFACE) */}
      <SecretTerminal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        onHireModeToggle={() => {
          setIsHireMode(!isHireMode);
          alert("⚡ HIRE-MODE INTERRUPT INITIATED! Swapping layout themes to active interview gold accents.");
        }}
        onKonamiTrigger={() => {
          setIsRetroMatrix(true);
          alert("💥 SYNTHWAVE INTRO TRIGGERED! Launching matrix grid particles...");
        }}
      />

      {/* PREMIUM FULL-SCREEN PROJECT / ALBUM DETAILS MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="w-full max-w-4xl bg-[#121212] border border-[#282828] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] flex flex-col md:flex-row h-[550px] relative font-satoshi"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 bg-black/60 text-white hover:bg-spotify-hover p-2 rounded-full border border-white/5 transition-colors z-10"
                title="Close"
              >
                <FiVolumeX className="rotate-45" /> {/* simple cross look */}
              </button>

              {/* Banner / Left Side (Album Art & Details) */}
              <div className={`w-full md:w-[40%] bg-gradient-to-b ${selectedProject.color} p-8 flex flex-col justify-end text-white relative`}>
                <div className="absolute top-8 left-8 w-24 h-24 rounded-xl overflow-hidden shadow-2xl bg-[#242424]">
                  <img src={selectedProject.image} alt={selectedProject.title} className="w-full h-full object-cover" />
                </div>
                <div className="z-10 mt-28">
                  <span className="text-[10px] font-extrabold uppercase bg-white/10 px-2 py-0.5 rounded border border-white/10 tracking-widest">{selectedProject.year} ALBUM</span>
                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-1">{selectedProject.title}</h3>
                  <p className="text-xs text-white/70 font-semibold mt-1">{selectedProject.category}</p>
                  <p className="text-xs text-white/80 leading-relaxed font-medium mt-4 line-clamp-4">{selectedProject.desc}</p>
                </div>
              </div>

              {/* Right Side (Track List / Features) */}
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-between overflow-y-auto no-scrollbar bg-[#090909]">
                <div>
                  <h4 className="text-xs font-extrabold text-spotify-textMuted uppercase tracking-widest mb-4">Codebase Modules (Tracklist)</h4>

                  {/* Track items */}
                  <div className="flex flex-col gap-2">
                    {selectedProject.features.map((feat, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded hover:bg-[#282828]/40 transition-colors group cursor-pointer"
                        onClick={() => alert(`Reviewing Module details for: \n"${feat.name}"`)}
                      >
                        <div className="flex items-center gap-3 text-xs font-semibold">
                          <span className="text-spotify-textMuted w-4 group-hover:text-spotify-green">{feat.track}</span>
                          <span className="text-white group-hover:text-spotify-green transition-colors">{feat.name}</span>
                        </div>
                        <span className="text-[10px] text-spotify-textMuted font-bold">{feat.duration}</span>
                      </div>
                    ))}
                  </div>

                  {/* Tech stack badges */}
                  <div className="mt-6">
                    <h5 className="text-[10px] font-extrabold text-spotify-textMuted uppercase tracking-widest mb-2">Integrated Tech Stack</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedProject.tech.map((t, index) => (
                        <span key={index} className="text-[9px] bg-white/5 border border-white/10 text-spotify-textMuted px-2.5 py-1 rounded font-extrabold uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Foot Links */}
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-white/5">
                  <a
                    href={selectedProject.live}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2.5 bg-spotify-green hover:bg-emerald-400 text-black font-extrabold text-xs tracking-wider uppercase rounded-lg transition-transform hover:scale-[1.01]"
                  >
                    🚀 Live Demo
                  </a>
                  <a
                    href={selectedProject.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 text-center py-2.5 border border-white/15 hover:bg-white/5 text-white font-extrabold text-xs tracking-wider uppercase rounded-lg transition-transform hover:scale-[1.01]"
                  >
                    📂 GitHub Repo
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
