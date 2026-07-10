import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  BrainCircuit, 
  Moon, 
  Droplets, 
  Zap,
  Coffee,
  Briefcase
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useNotifications } from '../../context/NotificationContext';

const StepWrapper = ({ children, title, subtitle }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-slate-400 mt-2">{subtitle}</p>
    </div>
    {children}
  </motion.div>
);

const HeartPulse = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
  </svg>
);

const Onboarding = () => {
  const { userData, completeOnboarding } = useUser();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // 3. Onboarding Auto-Redirect: If user is already onboarded, don't let them stay here
  React.useEffect(() => {
    if (userData?.hasCompletedOnboarding && !loading) {
      navigate('/', { replace: true });
    }
  }, [userData?.hasCompletedOnboarding, loading, navigate]);

  const [formData, setFormData] = useState({
    primaryGoal: 'Productivity',
    workStart: '09:00',
    workEnd: '17:00',
    productivityStyle: 'Morning Owl',
    sleepGoal: 8,
    waterGoal: 2.5,
    stressLevel: 2
  });

  const updateForm = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleFinish = async () => {
    try {
      setLoading(true);
      // This will update the backend and then refresh the local UserContext
      await completeOnboarding(formData);
      addNotification('ai', 'Model Synchronized', 'Your personal AI agent has been initialized successfully.');
      // The App.jsx routing will automatically redirect to dashboard 
      // once userData.hasCompletedOnboarding becomes true
    } catch (error) {
      console.error("Onboarding failed:", error);
      setLoading(false);
      addNotification('error', 'Initialization Failed', 'There was an error setting up your profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-[80px] animate-pulse" />
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            className="relative p-6 bg-surface border border-white/10 rounded-full"
          >
            <BrainCircuit className="w-16 h-16 text-primary" />
          </motion.div>
        </div>
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold mt-12 text-center"
        >
          MindSync is analyzing your profile...
        </motion.h2>
        <p className="text-slate-400 mt-2 text-center max-w-sm">
          We're training your personal AI models based on your schedule and goals.
        </p>
        <div className="mt-8 w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3 }}
            className="h-full bg-primary"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[150px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[150px]" />

      <div className="w-full max-w-xl relative z-10">
        <div className="flex gap-2 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-primary' : 'bg-slate-800'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <StepWrapper key="step1" title="Define Your Vision" subtitle="What are you primarily looking to optimize?">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'Productivity', icon: Zap, desc: 'Focus & task completion' },
                  { id: 'Health Balance', icon: HeartPulse, desc: 'Sleep, water & energy' },
                  { id: 'Study Success', icon: Briefcase, desc: 'Academic performance' },
                  { id: 'Burnout Recovery', icon: Coffee, desc: 'Stress management' },
                ].map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => updateForm('primaryGoal', item.id)}
                    className={`glass-card p-6 text-left transition-all group ${formData.primaryGoal === item.id ? 'border-primary bg-primary/10' : 'hover:border-primary/30'}`}
                  >
                    <item.icon className={`w-8 h-8 mb-4 group-hover:scale-110 transition-transform ${formData.primaryGoal === item.id ? 'text-primary' : 'text-slate-500'}`} />
                    <h3 className="font-bold">{item.id}</h3>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper key="step2" title="Your Schedule" subtitle="When do you usually perform your deep work?">
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <label className="text-sm font-medium text-slate-300 block mb-4">Typical Work Hours</label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Start</p>
                      <input type="time" value={formData.workStart} onChange={(e) => updateForm('workStart', e.target.value)} className="input-field" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">End</p>
                      <input type="time" value={formData.workEnd} onChange={(e) => updateForm('workEnd', e.target.value)} className="input-field" />
                    </div>
                  </div>
                </div>
                <div className="glass-card p-6">
                  <label className="text-sm font-medium text-slate-300 block mb-4">Preferred Productivity Style</label>
                  <div className="space-y-3">
                    {['Morning Owl', 'Night Owl', 'Balanced'].map((style) => (
                      <button 
                        key={style} 
                        onClick={() => updateForm('productivityStyle', style)}
                        className={`w-full p-4 rounded-xl border transition-all text-left ${formData.productivityStyle === style ? 'border-primary bg-primary/10' : 'border-white/5 bg-slate-900/50 hover:bg-slate-800'}`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper key="step3" title="Health Targets" subtitle="Set your baseline for AI monitoring.">
              <div className="space-y-6">
                <div className="glass-card p-6 flex items-center gap-6">
                  <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
                    <Moon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">Daily Sleep Goal</label>
                      <span className="text-lg font-bold text-primary">{formData.sleepGoal}h</span>
                    </div>
                    <input type="range" min="4" max="12" value={formData.sleepGoal} onChange={(e) => updateForm('sleepGoal', parseInt(e.target.value))} className="w-full accent-primary h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
                <div className="glass-card p-6 flex items-center gap-6">
                  <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium">Water Intake Target</label>
                      <span className="text-lg font-bold text-primary">{formData.waterGoal}L</span>
                    </div>
                    <input type="range" min="1" max="5" step="0.5" value={formData.waterGoal} onChange={(e) => updateForm('waterGoal', parseFloat(e.target.value))} className="w-full accent-primary h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer" />
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper key="step4" title="Current State" subtitle="Help the AI understand your starting point.">
              <div className="space-y-6">
                <div className="glass-card p-6">
                  <label className="text-sm font-medium text-slate-300 block mb-4">Stress Level (Current)</label>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((lvl) => (
                      <button 
                        key={lvl} 
                        onClick={() => updateForm('stressLevel', lvl)}
                        className={`w-12 h-12 rounded-xl font-bold transition-all ${formData.stressLevel === lvl ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-2 px-1">
                    <span>Zen</span>
                    <span>Stressed</span>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
                  <div className="flex gap-4">
                    <BrainCircuit className="text-primary w-6 h-6 mt-1 flex-shrink-0" />
                    <p className="text-sm text-slate-300">
                      We'll use this data to calibrate your productivity curves. You can always change these in settings.
                    </p>
                  </div>
                </div>
              </div>
            </StepWrapper>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-12">
          <button onClick={() => step > 1 ? setStep(step - 1) : null} className={`btn-secondary ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button onClick={() => step < 4 ? setStep(step + 1) : handleFinish()} className="btn-primary">
            {step < 4 ? 'Continue' : 'Initialize AI Agent'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
