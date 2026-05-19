import React, { useState, useEffect, useRef } from 'react';
import { 
  FiPlay, FiPause, FiSkipBack, FiSkipForward, FiShuffle, FiRepeat, 
  FiHeart, FiVolume2, FiVolumeX, FiMaximize2, FiList, FiMic 
} from 'react-icons/fi';

const MusicPlayer = ({ onLyricsToggle, showLyrics, currentTrackInfo }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // Fallback public royalty-free ambient synth music
  const audioUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"; 

  useEffect(() => {
    // Create audio element
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audioRef.current = audio;

    // Event listeners
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  // Sync state
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(e => console.log("Play failed: user gesture required", e));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0) setIsMuted(false);
  };

  const handleProgressChange = (e) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Format time (e.g., 125s -> 2:05)
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <footer className="h-[90px] bg-[#181818] border-t border-[#282828] px-4 flex items-center justify-between select-none fixed bottom-0 left-0 w-full z-50 text-white">
      {/* Left side: Track details */}
      <div className="flex items-center gap-3 w-1/4 min-w-[180px]">
        {/* Album Artwork */}
        <div className="relative w-14 h-14 bg-spotify-hover rounded-md overflow-hidden group shadow-lg flex-shrink-0">
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80" 
            alt="Album Art" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Animated small equalizer waves on play */}
          {isPlaying && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-0.5">
              <span className="w-1 h-3 bg-spotify-green rounded-full animate-pulse"></span>
              <span className="w-1 h-5 bg-spotify-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1 h-2 bg-spotify-green rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-white truncate hover:underline cursor-pointer">
            {currentTrackInfo?.title || "HireTrack AI (APM Launch Mix)"}
          </h4>
          <p className="text-xs text-spotify-textMuted truncate hover:underline cursor-pointer">
            {currentTrackInfo?.artist || "Ajay Kumar (ft. AI Co-Pilot)"}
          </p>
        </div>

        {/* Favorite button */}
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className={`hover:scale-105 transition-transform p-1 ${isLiked ? 'text-spotify-green' : 'text-spotify-textMuted hover:text-white'}`}
          title={isLiked ? "Remove from Library" : "Save to Library"}
        >
          <FiHeart className={`text-lg ${isLiked ? 'fill-spotify-green' : ''}`} />
        </button>
      </div>

      {/* Center: Play controls & Progress */}
      <div className="flex flex-col items-center gap-2 flex-1 max-w-[600px]">
        {/* Buttons */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsShuffle(!isShuffle)}
            className={`text-lg transition-colors ${isShuffle ? 'text-spotify-green font-bold' : 'text-spotify-textMuted hover:text-white'}`}
            title="Enable Shuffle"
          >
            <FiShuffle />
          </button>
          
          <button 
            className="text-lg text-spotify-textMuted hover:text-white transition-colors"
            onClick={() => {
              if (audioRef.current) audioRef.current.currentTime = 0;
            }}
            title="Previous"
          >
            <FiSkipBack />
          </button>

          {/* Large Circle Play Button */}
          <button 
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_10px_rgba(255,255,255,0.1)] hover:bg-spotify-green hover:shadow-[0_0_15px_rgba(29,185,84,0.4)]"
            title={isPlaying ? "Pause" : "Play Chill Beats"}
          >
            {isPlaying ? (
              <FiPause className="text-black text-sm" />
            ) : (
              <FiPlay className="text-black text-sm ml-0.5" />
            )}
          </button>

          <button 
            className="text-lg text-spotify-textMuted hover:text-white transition-colors"
            onClick={() => {
              alert("Skipping to next track: 'APM Career Beat (Instrumental)'");
            }}
            title="Next"
          >
            <FiSkipForward />
          </button>

          <button 
            onClick={() => setIsRepeat(!isRepeat)}
            className={`text-lg transition-colors ${isRepeat ? 'text-spotify-green font-bold' : 'text-spotify-textMuted hover:text-white'}`}
            title="Enable Repeat"
          >
            <FiRepeat />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full text-xs text-spotify-textMuted">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
            ref={progressRef}
            className="w-full accent-spotify-green h-1 rounded-full cursor-pointer hover:h-1.5 bg-[#4d4d4d] transition-all outline-none"
            title="Playback slider"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right side: Volume & Extra options */}
      <div className="flex items-center gap-4 w-1/4 justify-end min-w-[180px]">
        {/* Lyrics Button */}
        <button 
          onClick={onLyricsToggle}
          className={`text-base p-1.5 rounded-full hover:bg-spotify-hover transition-colors ${
            showLyrics ? 'text-spotify-green bg-spotify-green/10' : 'text-spotify-textMuted hover:text-white'
          }`}
          title="Lyrics Pitch"
        >
          <FiMic />
        </button>

        {/* Mock Queue */}
        <button 
          className="text-base text-spotify-textMuted hover:text-white transition-colors p-1"
          onClick={() => alert("Up Next: \n1. HireTrack AI Presentation \n2. Technical PM Q&A Session \n3. Coffee with Ajay")}
          title="Queue"
        >
          <FiList />
        </button>

        {/* Volume controls */}
        <div className="flex items-center gap-2 group/volume">
          <button 
            onClick={toggleMute}
            className="text-lg text-spotify-textMuted hover:text-white transition-colors p-1"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 bg-[#4d4d4d] accent-spotify-green group-hover/volume:accent-spotify-green rounded-full cursor-pointer transition-all outline-none"
            title="Volume slider"
          />
        </div>

        {/* Mock Maximize */}
        <button 
          className="text-base text-spotify-textMuted hover:text-white transition-colors p-1 hidden sm:inline-block"
          onClick={() => {
            const el = document.getElementById('vibe');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          title="Go to Vibe Lounge"
        >
          <FiMaximize2 />
        </button>
      </div>
    </footer>
  );
};

export default MusicPlayer;
