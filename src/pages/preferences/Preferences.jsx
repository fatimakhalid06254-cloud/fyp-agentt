import React from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { useUser } from '../../context/UserContext';

const Preferences = () => {
  const { addNotification } = useNotifications();
  const { userData, updateUserData } = useUser();

  const handlePreferencesSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    updateUserData({
      primaryGoal: formData.get('primaryGoal'),
      workStart: formData.get('workStart'),
      workEnd: formData.get('workEnd'),
      productivityStyle: formData.get('productivityStyle'),
      sleepGoal: parseInt(formData.get('sleepGoal'), 10),
      waterGoal: parseFloat(formData.get('waterGoal'))
    });
    addNotification('info', 'Preferences Updated', 'Your AI preferences have been updated successfully.');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-bold">Preferences</h1>
        <p className="text-slate-400 mt-1">Manage your onboarding goals and AI parameters.</p>
      </header>

      <div className="glass-card p-8">
        <form onSubmit={handlePreferencesSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Primary Goal</label>
              <select name="primaryGoal" defaultValue={userData?.primaryGoal} className="input-field bg-slate-900">
                <option value="Productivity">Productivity</option>
                <option value="Health Balance">Health Balance</option>
                <option value="Study Success">Study Success</option>
                <option value="Burnout Recovery">Burnout Recovery</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Productivity Style</label>
              <select name="productivityStyle" defaultValue={userData?.productivityStyle} className="input-field bg-slate-900">
                <option value="Morning Owl">Morning Owl</option>
                <option value="Night Lark">Night Lark</option>
                <option value="Sporadic Bursts">Sporadic Bursts</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Work Start</label>
              <input name="workStart" type="time" defaultValue={userData?.workStart} className="input-field" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Work End</label>
              <input name="workEnd" type="time" defaultValue={userData?.workEnd} className="input-field" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Sleep Goal (hrs)</label>
              <input name="sleepGoal" type="number" min="4" max="12" defaultValue={userData?.sleepGoal} className="input-field" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Water Goal (L)</label>
              <input name="waterGoal" type="number" step="0.5" min="1" max="5" defaultValue={userData?.waterGoal} className="input-field" />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full md:w-auto px-8 mt-4 flex items-center justify-center">
            <Save className="w-4 h-4 mr-2" /> Save Preferences
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Preferences;
