import React, { useState } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const SkillsRadar = () => {
  const [activeTab, setActiveTab] = useState('pm');

  const radarData = [
    { subject: 'Product Strategy', A: 92, fullMark: 100 },
    { subject: 'AI/ML Engineering', A: 88, fullMark: 100 },
    { subject: 'Full Stack Dev', A: 85, fullMark: 100 },
    { subject: 'Analytics & Funnels', A: 90, fullMark: 100 },
    { subject: 'System Architecture', A: 80, fullMark: 100 },
    { subject: 'Agile & Sprints', A: 95, fullMark: 100 },
  ];

  const skillCategories = {
    pm: [
      { name: "Agile & Scrum Sprints", level: 95 },
      { name: "Product Roadmap Planning", level: 92 },
      { name: "User Research & Discovery", level: 88 },
      { name: "Funnel Analysis & Metrics", level: 90 },
      { name: "Competitive Landscaping", level: 85 }
    ],
    ai: [
      { name: "LLM Orchestration (LangChain/APIs)", level: 92 },
      { name: "Machine Learning (TensorFlow/PyTorch)", level: 85 },
      { name: "Data Preprocessing & Cleanup", level: 88 },
      { name: "Feature Engineering Pipelines", level: 90 },
      { name: "Vector Databases & Embeddings", level: 84 }
    ],
    fullstack: [
      { name: "React.js & Next.js", level: 90 },
      { name: "Node.js & Express APIs", level: 86 },
      { name: "Tailwind CSS & Styling", level: 95 },
      { name: "MongoDB & Database Modeling", level: 85 },
      { name: "State Management & Sockets", level: 82 }
    ]
  };

  const genreTags = [
    { label: "Deep Learning Beat", type: "ai" },
    { label: "Agile Sprints", type: "pm" },
    { label: "Full-Stack Grooves", type: "fullstack" },
    { label: "Big Data Synth", type: "ai" },
    { label: "Figma Loops", type: "pm" },
    { label: "LangChain Remix", type: "ai" },
    { label: "Tailwind Bass", type: "fullstack" },
    { label: "Funnel Drop", type: "pm" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      {/* Recharts Radar Chart */}
      <div className="bg-[#181818]/60 border border-white/5 rounded-xl p-6 flex flex-col items-center justify-center h-[350px] relative glass">
        <h4 className="absolute top-4 left-6 text-sm font-bold text-white tracking-wider uppercase">Skill Index Metrics</h4>
        
        <div className="w-full h-full pt-6 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: '#b3b3b3', fontSize: 10, fontWeight: 'bold' }} 
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]} 
                tick={{ fill: '#4d4d4d', fontSize: 8 }}
              />
              <Radar 
                name="Ajay Kumar" 
                dataKey="A" 
                stroke="#1DB954" 
                fill="#1DB954" 
                fillOpacity={0.25} 
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Bars & Category Switching */}
      <div className="flex flex-col gap-5">
        {/* Navigation Tabs */}
        <div className="flex bg-black/40 p-1.5 rounded-lg border border-white/5 gap-1.5">
          <button
            onClick={() => setActiveTab('pm')}
            className={`flex-1 text-center py-2 px-3 rounded text-xs font-bold transition-all duration-300 ${
              activeTab === 'pm' 
                ? 'bg-spotify-green text-black shadow-md' 
                : 'text-spotify-textMuted hover:text-white'
            }`}
          >
            Product Management
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex-1 text-center py-2 px-3 rounded text-xs font-bold transition-all duration-300 ${
              activeTab === 'ai' 
                ? 'bg-[#06b6d4] text-black shadow-md' 
                : 'text-spotify-textMuted hover:text-white'
            }`}
          >
            AI & Machine Learning
          </button>
          <button
            onClick={() => setActiveTab('fullstack')}
            className={`flex-1 text-center py-2 px-3 rounded text-xs font-bold transition-all duration-300 ${
              activeTab === 'fullstack' 
                ? 'bg-[#a855f7] text-white shadow-md' 
                : 'text-spotify-textMuted hover:text-white'
            }`}
          >
            Full Stack Dev
          </button>
        </div>

        {/* Dynamic Skill Bars */}
        <div className="bg-[#181818]/40 border border-white/5 rounded-xl p-6 flex flex-col gap-4 min-h-[220px] justify-center glass">
          {skillCategories[activeTab].map((skill, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-white">{skill.name}</span>
                <span className={
                  activeTab === 'pm' ? 'text-spotify-green' : 
                  activeTab === 'ai' ? 'text-cyan-400' : 'text-purple-400'
                }>{skill.level}%</span>
              </div>
              <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.level}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: 'easeOut', delay: index * 0.1 }}
                  className={`h-full rounded-full ${
                    activeTab === 'pm' ? 'bg-spotify-green shadow-[0_0_8px_#1DB954]' : 
                    activeTab === 'ai' ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]' : 'bg-purple-400 shadow-[0_0_8px_#a855f7]'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Genre Tags (Floating Vibe Elements) */}
        <div>
          <p className="text-[10px] font-bold text-spotify-textMuted uppercase tracking-wider mb-2">Coding Soundscape Genres</p>
          <div className="flex flex-wrap gap-2">
            {genreTags.map((tag, index) => (
              <span
                key={index}
                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-full border cursor-pointer hover:scale-105 active:scale-95 transition-all ${
                  tag.type === 'pm' ? 'border-spotify-green/20 bg-spotify-green/5 text-spotify-green hover:bg-spotify-green/15' :
                  tag.type === 'ai' ? 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/15' :
                  'border-purple-500/20 bg-purple-500/5 text-purple-400 hover:bg-purple-500/15'
                }`}
              >
                # {tag.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsRadar;
