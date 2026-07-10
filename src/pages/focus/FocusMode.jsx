import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Target,
  Maximize2,
  Wind,
  Volume2
} from 'lucide-react';
import { predictBurnout } from '../../services/api';

const SoundwaveVisualizer = ({ active }) => (
  <div className="flex items-center gap-0.5 h-3 justify-center">
    {[0, 1, 2, 3].map((i) => (
      <motion.div
        key={i}
        className="w-[2px] bg-primary rounded-full"
        animate={{
          height: active ? [3, 12, 3] : 3
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.1,
          ease: 'easeInOut'
        }}
      />
    ))}
  </div>
);

const FocusMode = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' | 'break'
  const [predictions, setPredictions] = useState(null);
  const [soundActive, setSoundActive] = useState(null); // null | 'lofi' | 'binaural' | 'relaxing'

  const audioRef = React.useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (soundActive) {
      let soundUrl = '';
      if (soundActive === 'lofi') {
        soundUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
      } else if (soundActive === 'binaural') {
        soundUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3';
      } else if (soundActive === 'relaxing') {
        soundUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3';
      }

      const audio = new Audio(soundUrl);
      audio.loop = true;
      audio.volume = 0.4;
      audioRef.current = audio;
      audio.play().catch(err => console.warn('Audio autoplay blocked or failed:', err));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [soundActive]);

  useEffect(() => {
    const fetchCognitiveState = async () => {
      try {
        const data = await predictBurnout();
        setPredictions(data);
      } catch (err) {
        console.error('Could not sync focus stress parameters:', err);
      }
    };
    fetchCognitiveState();
  }, []);

  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      clearInterval(timer);
      setIsActive(false);
      
      // Auto switch logic
      if (mode === 'focus') {
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('focus');
        setTimeLeft(25 * 60);
      }
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft, mode]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60);
  };

  const stressLevel = predictions?.metrics?.avg_stress || 2.5;
  const isHighStress = stressLevel > 3.0;

  return (
    <div className="h-[82vh] flex flex-col items-center justify-center space-y-6 py-2 overflow-hidden select-none">
      <header className="text-center">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          Focus Session
        </h1>
        <p className="text-slate-400 mt-1 text-sm">Deep work in progress. Stay concentrated.</p>
      </header>

      {/* Dynamic Mode Switcher */}
      <div className="flex bg-slate-900/60 p-1.5 rounded-full border border-white/5 gap-1">
        <button
          onClick={() => {
            setMode('focus');
            setTimeLeft(25 * 60);
            setIsActive(false);
          }}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
            mode === 'focus' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          🎯 Deep Work (25m)
        </button>
        <button
          onClick={() => {
            setMode('break');
            setTimeLeft(5 * 60);
            setIsActive(false);
          }}
          className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
            mode === 'break' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400 hover:text-white'
          }`}
        >
          💆 Calming Break (5m)
        </button>
      </div>

      {/* Timer Display with Stress-Adaptive Background ripples */}
      <div className="relative group scale-90 md:scale-100">
        {/* Neon Glow base */}
        <div className={`absolute inset-0 rounded-full blur-[60px] animate-pulse transition-all ${
          isHighStress ? 'bg-emerald-500/15 group-hover:bg-emerald-500/25' : 'bg-primary/20 group-hover:bg-primary/30'
        }`} />

        {/* Ambient CSS active expanding ripples */}
        {isActive && (
          <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0.6 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
              className={`absolute w-80 h-80 rounded-full border-2 ${
                isHighStress ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-primary/20 bg-primary/5'
              }`}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0.6 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 1.5 }}
              className={`absolute w-80 h-80 rounded-full border-2 ${
                isHighStress ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-primary/20 bg-primary/5'
              }`}
            />
          </div>
        )}

        {/* Core Timer circle */}
        <div className="relative w-72 h-72 rounded-full border border-white/10 flex flex-col items-center justify-center bg-surface/40 backdrop-blur-2xl shadow-2xl">
          <span className={`text-[10px] font-bold tracking-[0.2em] uppercase mb-2 ${
            mode === 'focus' ? 'text-primary' : 'text-emerald-400'
          }`}>
            {mode === 'focus' ? 'Deep Work' : 'Break Time'}
          </span>
          <span className="text-6xl font-mono font-bold tracking-tighter">
            {formatTime(timeLeft)}
          </span>
          <div className="flex items-center gap-1.5 mt-3 text-slate-500 text-xs">
            <Target className="w-4 h-4 text-primary" />
            <span>Goal: 4 sessions</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-6">
        <button 
          onClick={resetTimer}
          className="p-3.5 rounded-2xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-90 border border-white/5"
          title="Reset timer"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        
        <button 
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-2xl text-white flex items-center justify-center shadow-lg transition-all active:scale-95 ${
            isHighStress 
              ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' 
              : 'bg-primary hover:bg-primary/90 shadow-primary/20'
          }`}
        >
          {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
        </button>

        <button 
          onClick={() => {
            setMode(mode === 'focus' ? 'break' : 'focus');
            setTimeLeft(mode === 'focus' ? 5 * 60 : 25 * 60);
            setIsActive(false);
          }}
          className="p-3.5 rounded-2xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all active:scale-90 border border-white/5"
          title="Toggle Focus/Break"
        >
          <Coffee className="w-5 h-5" />
        </button>
      </div>

      {/* Secondary Audio Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => setSoundActive(soundActive === 'lofi' ? null : 'lofi')}
          className={`glass-card px-3.5 py-1.5 flex items-center gap-2.5 transition-all hover:bg-white/10 ${
            soundActive === 'lofi' ? 'bg-primary/20 border-primary/40 text-white' : 'text-slate-400 border border-white/5'
          }`}
        >
          <Volume2 className={`w-3.5 h-3.5 ${soundActive === 'lofi' ? 'text-primary' : 'text-slate-400'}`} />
          <span className="text-[11px] font-semibold">Lofi Beats</span>
          <SoundwaveVisualizer active={soundActive === 'lofi'} />
        </button>
        
        <button
          onClick={() => setSoundActive(soundActive === 'binaural' ? null : 'binaural')}
          className={`glass-card px-3.5 py-1.5 flex items-center gap-2.5 transition-all hover:bg-white/10 ${
            soundActive === 'binaural' ? 'bg-primary/20 border-primary/40 text-white' : 'text-slate-400 border border-white/5'
          }`}
        >
          <Wind className={`w-3.5 h-3.5 ${soundActive === 'binaural' ? 'text-primary' : 'text-slate-400'}`} />
          <span className="text-[11px] font-semibold">Binaural Waves</span>
          <SoundwaveVisualizer active={soundActive === 'binaural'} />
        </button>

        <button
          onClick={() => setSoundActive(soundActive === 'relaxing' ? null : 'relaxing')}
          className={`glass-card px-3.5 py-1.5 flex items-center gap-2.5 transition-all hover:bg-white/10 ${
            soundActive === 'relaxing' ? 'bg-primary/20 border-primary/40 text-white' : 'text-slate-400 border border-white/5'
          }`}
        >
          <Volume2 className={`w-3.5 h-3.5 ${soundActive === 'relaxing' ? 'text-primary' : 'text-slate-400'}`} />
          <span className="text-[11px] font-semibold">Relaxing Sound</span>
          <SoundwaveVisualizer active={soundActive === 'relaxing'} />
        </button>
      </div>

      {/* Dynamic AI Suggestion */}
      <div className="max-w-sm text-center bg-slate-900/50 p-3 rounded-xl border border-white/5">
        {isHighStress ? (
          <p className="text-[11px] text-emerald-400 font-medium">
            💆 MindSync AI detected elevated stress levels. Relaxing forest-green focus waves are active to lower heart rates.
          </p>
        ) : (
          <p className="text-[11px] text-slate-400 italic">
            "Your average fatigue levels are optimal. Standard neon-purple high-concentration focus state is active."
          </p>
        )}
      </div>
    </div>
  );
};

export default FocusMode;
