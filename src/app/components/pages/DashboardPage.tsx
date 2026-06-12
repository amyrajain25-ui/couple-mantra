import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Target, TrendingUp, CheckCircle2, Sparkles, Award, Video, Calendar, BookOpen } from 'lucide-react';
import { useCouple } from '../contexts/CoupleContext';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { couple } = useCouple();
  const [activeTab, setActiveTab] = useState<'overview' | 'goals' | 'sessions'>('overview');

  const [realStats, setRealStats] = useState({ entries: 0, loveBombs: 0, worksheets: 0 });

  useEffect(() => {
    const logEntries = localStorage.getItem('tm_log_entries');
    const loveBombs = localStorage.getItem('tm_sent_love_bombs');
    const worksheets = localStorage.getItem('tm_completed_worksheets');
    setRealStats({
      entries: logEntries ? (JSON.parse(logEntries) as any[]).length : 0,
      loveBombs: loveBombs ? (JSON.parse(loveBombs) as any[]).length : 0,
      worksheets: worksheets ? (JSON.parse(worksheets) as any[]).length : 0,
    });
  }, []);

  const name1 = couple?.partner1 ?? 'You';
  const name2 = couple?.partner2 ?? 'Partner';
  
  // Calculate a basic "health score" based on activity (max 100)
  const totalActivity = realStats.entries + realStats.loveBombs + realStats.worksheets;
  const healthScore = Math.min(100, Math.max(10, totalActivity * 5));

  const totalGoals = 0; // We don't have a real goals feature yet
  const totalSessions = 0; // We don't have real booked sessions yet

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div
        className="relative px-5 pt-14 pb-6"
        style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 55%, #a855f7 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="absolute -bottom-8 -left-6 w-28 h-28 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="flex items-center gap-3 relative mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div>
            <h1 className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>Relationship Dashboard</h1>
            <p className="text-white/75" style={{ fontSize: '12px' }}>{name1} & {name2}</p>
          </div>
        </div>

        {/* Health score */}
        <div
          className="rounded-2xl p-4 relative"
          style={{ background: 'rgba(255,255,255,0.18)' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Activity Score
              </p>
              <p className="text-white mt-1" style={{ fontSize: '36px', fontWeight: 800, lineHeight: 1 }}>{healthScore}%</p>
              <div className="flex items-center gap-1 mt-1.5">
                <TrendingUp className="h-3.5 w-3.5 text-green-300" />
                <span className="text-green-300" style={{ fontSize: '12px', fontWeight: 600 }}>Based on your app activity</span>
              </div>
            </div>
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="6" />
                <circle
                  cx="32" cy="32" r="26"
                  fill="none"
                  stroke="white"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 26 * (healthScore / 100)} ${2 * Math.PI * 26}`}
                />
              </svg>
              <Heart className="absolute inset-0 m-auto h-5 w-5 text-white fill-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="px-5 pt-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { emoji: '📓', value: String(realStats.entries), label: 'Entries' },
            { emoji: '💌', value: String(realStats.loveBombs), label: 'Love Bombs' },
            { emoji: '📝', value: String(realStats.worksheets), label: 'Worksheets' },
          ].map(stat => (
            <div key={stat.label} className="rounded-2xl p-3 text-center" style={{ background: '#f9fafb' }}>
              <p style={{ fontSize: '16px' }}>{stat.emoji}</p>
              <p style={{ fontSize: '16px', fontWeight: 800, color: '#1f2937', marginTop: '2px' }}>{stat.value}</p>
              <p style={{ fontSize: '10px', color: '#9ca3af' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex px-5 gap-2 pt-4 pb-2">
        {(['overview', 'goals', 'sessions'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className="px-4 py-1.5 rounded-full capitalize"
            style={{
              background: activeTab === t ? '#f43f5e' : '#f9fafb',
              color: activeTab === t ? '#fff' : '#6b7280',
              fontSize: '12px',
              fontWeight: 600,
              border: `1px solid ${activeTab === t ? '#f43f5e' : '#f3f4f6'}`,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="px-5 pb-6 space-y-4">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <>
            {/* Activity Summary */}
            <div className="rounded-2xl p-4" style={{ background: '#f9fafb' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#1f2937', marginBottom: '12px' }}>Your Activity</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                    <span style={{ fontSize: '13px', color: '#4b5563' }}>Log Entries</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{realStats.entries}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-rose-500" />
                    <span style={{ fontSize: '13px', color: '#4b5563' }}>Love Bombs Sent</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{realStats.loveBombs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <span style={{ fontSize: '13px', color: '#4b5563' }}>Worksheets Done</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{realStats.worksheets}</span>
                </div>
              </div>
            </div>

            {totalActivity === 0 && (
              <div className="text-center py-6 px-4 rounded-2xl border border-dashed" style={{ borderColor: '#e5e7eb' }}>
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-gray-400" />
                </div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>No activity yet</p>
                <p className="text-gray-500 mt-1" style={{ fontSize: '12px' }}>Start logging entries, sending love bombs, or completing worksheets to see your stats grow!</p>
              </div>
            )}
          </>
        )}

        {/* GOALS */}
        {activeTab === 'goals' && (
          <>
            <p className="text-gray-400" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Monthly Goals
            </p>
            
            <div className="text-center py-8 px-4 rounded-2xl" style={{ background: '#f9fafb' }}>
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="h-6 w-6 text-rose-500" />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>No goals set yet</p>
              <p className="text-gray-500 mt-1" style={{ fontSize: '12px' }}>Set shared relationship goals to track your progress together.</p>
            </div>
            
            <button
              className="w-full py-3 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2"
              style={{ borderColor: '#fda4af', color: '#f43f5e', fontSize: '13px', fontWeight: 600 }}
            >
              <Target className="h-4 w-4" /> Add New Goal
            </button>
          </>
        )}

        {/* SESSIONS */}
        {activeTab === 'sessions' && (
          <>
            <p className="text-gray-400" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Upcoming Sessions
            </p>

            <div className="text-center py-8 px-4 rounded-2xl" style={{ background: '#f9fafb' }}>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Video className="h-6 w-6 text-indigo-500" />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>No upcoming sessions</p>
              <p className="text-gray-500 mt-1" style={{ fontSize: '12px' }}>You haven't booked any therapy sessions yet.</p>
            </div>
            
            <button
              onClick={() => navigate('/therapists')}
              className="w-full py-3 rounded-2xl flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)', color: '#fff', fontSize: '13px', fontWeight: 600 }}
            >
              <Calendar className="h-4 w-4" /> Book New Session
            </button>
          </>
        )}
      </div>
    </div>
  );
}
