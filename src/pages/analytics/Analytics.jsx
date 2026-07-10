import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Brain, RefreshCw, Activity, ShieldAlert, Sparkles, FileText, Download } from 'lucide-react';
import { predictBurnout, healSchedule } from '../../services/api';

const productivityData = [
  { day: 'Mon', completion: 85, focus: 70 },
  { day: 'Tue', completion: 65, focus: 85 },
  { day: 'Wed', completion: 90, focus: 75 },
  { day: 'Thu', completion: 70, focus: 60 },
  { day: 'Fri', completion: 95, focus: 90 },
  { day: 'Sat', completion: 50, focus: 40 },
  { day: 'Sun', completion: 60, focus: 55 },
];

const impactData = [
  { name: 'Sleep > 7h', value: 85 },
  { name: 'Sleep < 7h', value: 45 },
  { name: 'Hydrated', value: 78 },
  { name: 'Dehydrated', value: 52 },
];

const COLORS = ['#6366f1', '#f43f5e', '#06b6d4', '#fbbf24'];

const Analytics = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healing, setHealing] = useState(false);
  const [healResult, setHealResult] = useState(null);

  const fetchPredictions = async () => {
    try {
      setLoading(true);
      const data = await predictBurnout();
      setPredictions(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not load performance predictions. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleHealSchedule = async () => {
    try {
      setHealing(true);
      const data = await healSchedule();
      setHealResult(data);
      
      // Re-fetch predictions to update the live burnout risk on the page immediately!
      const updated = await predictBurnout();
      setPredictions(updated);
    } catch (err) {
      console.error(err);
      alert('Could not run calendar healer.');
    } finally {
      setHealing(false);
    }
  };

  const generatePDFReport = () => {
    if (!predictions) return;
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      alert('Please allow popups to generate the diagnostic report.');
      return;
    }

    const today = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const reportContent = `
      <html>
        <head>
          <title>MindSync AI - Cognitive Diagnostics Report</title>
          <style>
            body {
              font-family: 'Inter', system-ui, -apple-system, sans-serif;
              color: #0f172a;
              background: #ffffff;
              padding: 40px;
              line-height: 1.6;
            }
            .header {
              border-bottom: 2px solid #6366f1;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              color: #6366f1;
            }
            .meta {
              text-align: right;
              font-size: 12px;
              color: #64748b;
            }
            .title {
              font-size: 28px;
              font-weight: 900;
              margin-bottom: 5px;
              color: #1e293b;
            }
            .subtitle {
              font-size: 14px;
              color: #64748b;
              margin-bottom: 30px;
            }
            .grid {
              display: grid;
              grid-template-cols: repeat(3, 1fr);
              gap: 20px;
              margin-bottom: 40px;
            }
            .card {
              border: 1px solid #e2e8f0;
              border-radius: 12px;
              padding: 20px;
              background: #f8fafc;
            }
            .card-title {
              font-size: 11px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #64748b;
              font-weight: 700;
              margin-bottom: 5px;
            }
            .card-value {
              font-size: 28px;
              font-weight: 800;
              color: #0f172a;
            }
            .section {
              margin-bottom: 30px;
            }
            .section-title {
              font-size: 16px;
              font-weight: 700;
              border-left: 4px solid #6366f1;
              padding-left: 10px;
              margin-bottom: 15px;
              color: #1e293b;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .table-styled {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .table-styled th {
              background: #f1f5f9;
              text-align: left;
              padding: 12px;
              font-size: 12px;
              font-weight: 700;
              color: #475569;
              border-bottom: 1px solid #e2e8f0;
            }
            .table-styled td {
              padding: 12px;
              font-size: 13px;
              border-bottom: 1px solid #e2e8f0;
            }
            .recommendation-box {
              background: #f0fdf4;
              border: 1px solid #bbf7d0;
              border-radius: 12px;
              padding: 20px;
              color: #166534;
              font-size: 14px;
              font-style: italic;
              margin-bottom: 40px;
            }
            .footer {
              margin-top: 60px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              font-size: 11px;
              color: #94a3b8;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">MindSync AI</div>
            <div class="meta">
              <div>Registry ID: MS-${Math.floor(100000 + Math.random() * 900000)}</div>
              <div>Generated: ${today}</div>
            </div>
          </div>

          <div class="title">Cognitive & Behavior Analysis</div>
          <div class="subtitle">Personalized Weekly Diagnostics Report</div>

          <div class="grid">
            <div class="card">
              <div class="card-title">Cognitive Index</div>
              <div class="card-value">${predictions.productivity_index}%</div>
            </div>
            <div class="card">
              <div class="card-title">Burnout Risk</div>
              <div class="card-value">${predictions.burnout_risk}%</div>
            </div>
            <div class="card">
              <div class="card-title">Stress Level</div>
              <div class="card-value">${predictions.metrics.avg_stress}/5</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Behavioral Diagnostics Summary</div>
            <table class="table-styled">
              <thead>
                <tr>
                  <th>METRIC FACTOR</th>
                  <th>QUANTITATIVE ANALYSIS</th>
                  <th>STATUS ASSESSMENT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Sleep Duration Deficit</td>
                  <td>${predictions.scheduling.style} Preference</td>
                  <td>Optimal Profile</td>
                </tr>
                <tr>
                  <td>Fatigue Density Index</td>
                  <td>${predictions.metrics.avg_fatigue} out of 5 average</td>
                  <td>${predictions.metrics.avg_fatigue > 3 ? 'Action Required' : 'Stabilized'}</td>
                </tr>
                <tr>
                  <td>Task Progression Density</td>
                  <td>${predictions.metrics.pending_tasks} pending · ${predictions.metrics.completed_tasks} completed</td>
                  <td>Ratio Score: ${predictions.metrics.task_density_score}/5</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="section-title">Clinical AI Prescriptions & Advice</div>
            <div class="recommendation-box">
              "${predictions.recommendation}"
            </div>
          </div>

          <div class="footer">
            © 2026 MindSync Agent Framework. This report is dynamically generated using local behavioral statistics and is structured for academic final year project evaluations.
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `;
    reportWindow.document.write(reportContent);
    reportWindow.document.close();
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        >
          <RefreshCw className="w-10 h-10 text-primary" />
        </motion.div>
        <p className="text-slate-400 text-sm animate-pulse">Running multivariate regression models on your behavior...</p>
      </div>
    );
  }

  if (error || !predictions) {
    return (
      <div className="glass-card p-8 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-semibold">Diagnostic Model Offline</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">{error || 'Could not fetch forecast indices.'}</p>
        <button
          onClick={fetchPredictions}
          className="px-6 py-2 bg-primary rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all text-white"
        >
          Retry Prediction Run
        </button>
      </div>
    );
  }

  const { burnout_risk, productivity_index, metrics, scheduling, recommendation } = predictions;

  // Determine burnout label & color
  let burnoutLabel = 'Low';
  let burnoutColor = 'border-emerald-500 text-emerald-400';
  if (burnout_risk > 70) {
    burnoutLabel = 'High';
    burnoutColor = 'border-rose-500 text-rose-400';
  } else if (burnout_risk > 40) {
    burnoutLabel = 'Medium';
    burnoutColor = 'border-amber-500 text-amber-400';
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Model Predictions Center</h1>
          <p className="text-slate-400 mt-1">Real-time behavior-based predictions and cognitive forecasts generated by your trained AI model.</p>
        </div>
        <button
          onClick={fetchPredictions}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 hover:border-primary/50 text-sm rounded-xl transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          Rerun Models
        </button>
      </header>

      {/* High-level Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 border-l-4 border-primary">
          <div className="flex items-center gap-3 mb-2 text-primary">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-semibold">Performance Index</h3>
          </div>
          <p className="text-3xl font-bold">{productivity_index}%</p>
          <p className="text-xs text-slate-500 mt-1">Live cognitive capability score</p>
        </div>
        <div className={`glass-card p-6 border-l-4 ${burnoutColor}`}>
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold text-slate-300">Burnout Risk</h3>
          </div>
          <p className="text-3xl font-bold">{burnout_risk}% <span className="text-sm font-semibold">({burnoutLabel})</span></p>
          <p className="text-xs text-slate-500 mt-1">Stress & fatigue density score</p>
        </div>
        <div className="glass-card p-6 border-l-4 border-cyan-500">
          <div className="flex items-center gap-3 mb-2 text-cyan-400">
            <Activity className="w-5 h-5" />
            <h3 className="font-semibold">Behavioral State</h3>
          </div>
          <p className="text-3xl font-bold">{metrics.avg_stress > 3 ? 'Stressed' : 'Balanced'}</p>
          <p className="text-xs text-slate-500 mt-1">Logged stress: {metrics.avg_stress}/5 · fatigue: {metrics.avg_fatigue}/5</p>
        </div>
      </div>

      {/* PDF Diagnostics Generator Card */}
      <div className="glass-card p-8 bg-gradient-to-br from-surface to-indigo-950/20 border border-white/5 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-gradient-to-tr from-primary to-violet-600 rounded-2xl shadow-lg shadow-primary/20 flex-shrink-0">
            <FileText className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold">Cognitive Wellness PDF Generator</h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Generate a research-grade, downloadable PDF diagnostics report aggregating your behavioral logs, sleep deficits, fatigue parameters, and custom AI prescriptions.
            </p>
          </div>
        </div>
        <button
          onClick={generatePDFReport}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-violet-600 hover:opacity-95 text-sm font-semibold rounded-2xl transition-all active:scale-95 shadow-lg shadow-primary/20 text-white whitespace-nowrap"
        >
          <Download className="w-4 h-4" />
          Generate & Export Report
        </button>
      </div>

      {/* AI Performance Forecasting */}
      <div className="glass-card p-8 bg-gradient-to-r from-surface to-indigo-900/10 border border-primary/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-primary/20 p-2.5 rounded-xl">
            <Brain className="text-primary w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">AI Cognitive Forecast & Focus Windows</h2>
            <p className="text-sm text-slate-400">Personalized daily predictions trained on sleep, workload, and stress variables.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">Optimal Focus Window</h3>
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-2 h-[120px] flex flex-col justify-center">
              <p className="text-lg font-bold text-primary">{scheduling.optimal_focus_window}</p>
              <p className="text-[11px] text-slate-400">
                Determined by your style preference: <strong className="text-slate-300">{scheduling.style}</strong>.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300">Predictive Recommendation</h3>
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 h-[120px] overflow-y-auto flex flex-col justify-center">
              <p className="text-[11px] text-slate-300 italic leading-relaxed">
                "{recommendation}"
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              Calendar Healing Agent
            </h3>
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 h-[120px] flex flex-col justify-center">
              {healing ? (
                <div className="flex items-center gap-3 py-2 justify-center">
                  <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                  <span className="text-xs text-slate-400 animate-pulse">Optimizing schedule...</span>
                </div>
              ) : healResult ? (
                <div className="space-y-2 text-center">
                  <div className={`text-[10px] p-2 rounded-xl border ${
                    healResult.healed 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  }`}>
                    {healResult.healed ? `Success! Rescheduled ${healResult.rescheduled_count} tasks.` : healResult.message}
                  </div>
                  <button
                    onClick={() => setHealResult(null)}
                    className="text-[9px] text-slate-500 hover:text-white transition-colors"
                  >
                    Reset Optimization
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[10px] text-slate-400 text-center leading-tight">
                    Postpone low-priority tasks by 48 hours & schedule recovery breaks.
                  </p>
                  <button
                    onClick={handleHealSchedule}
                    className="w-full py-1.5 bg-gradient-to-r from-primary to-cyan-500 hover:opacity-90 rounded-xl text-xs font-semibold text-white transition-all active:scale-95 shadow-md shadow-primary/20"
                  >
                    Optimize Schedule
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
