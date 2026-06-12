import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Heart, BookOpen, Settings } from 'lucide-react';
import { useCouple } from '../contexts/CoupleContext';

const quickLinks = [
  { emoji: '🧑‍⚕️', label: 'Find a Therapist', sub: 'Book couples counselling', path: '/therapists', color: '#fce7f3' },
  { emoji: '📊', label: 'Relationship Assessment', sub: 'See your health score', path: '/assessment', color: '#dbeafe' },
  { emoji: '🎓', label: 'Courses', sub: 'Expert-led relationship courses', path: '/courses', color: '#ede9fe' },
  { emoji: '📚', label: 'Resource Library', sub: 'Articles, videos & worksheets', path: '/resources', color: '#dcfce7' },
  { emoji: '📈', label: 'Dashboard', sub: 'Full progress & analytics', path: '/dashboard', color: '#fef9c3' },
];

export default function ProfilePage() {
  const navigate = useNavigate();
  const { couple } = useCouple();
  const [realStats, setRealStats] = useState({ entries: 0, loveBombs: 0 });

  const daysTogether = couple?.since
    ? Math.floor((Date.now() - new Date(couple.since).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const sinceLabel = couple?.since
    ? new Date(couple.since).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : null;

  // Load real stats from localStorage
  useEffect(() => {
    const logEntries = localStorage.getItem('tm_log_entries');
    const loveBombs = localStorage.getItem('tm_sent_love_bombs');
    setRealStats({
      entries: logEntries ? (JSON.parse(logEntries) as any[]).length : 0,
      loveBombs: loveBombs ? (JSON.parse(loveBombs) as any[]).length : 0,
    });
  }, []);

  // Derive real milestones
  const milestones = [];
  if (realStats.entries >= 1) milestones.push({ emoji: '📓', title: 'First Entry', sub: 'Wrote your first log entry', color: '#dcfce7' });
  if (realStats.entries >= 5) milestones.push({ emoji: '📝', title: 'Reflective', sub: `${realStats.entries} log entries written`, color: '#ede9fe' });
  if (realStats.entries >= 10) milestones.push({ emoji: '🌟', title: 'Dedicated Journaler', sub: '10+ reflections logged', color: '#fef9c3' });
  if (realStats.loveBombs >= 1) milestones.push({ emoji: '💌', title: 'First Love Bomb', sub: 'Sent your first love message', color: '#fce7f3' });
  if (realStats.loveBombs >= 5) milestones.push({ emoji: '💕', title: 'Love Bug', sub: `${realStats.loveBombs} love messages sent`, color: '#fce7f3' });
  if (daysTogether !== null && daysTogether >= 100) milestones.push({ emoji: '💯', title: '100 Days Together', sub: `${daysTogether} days and counting`, color: '#fef9c3' });
  if (daysTogether !== null && daysTogether >= 365) milestones.push({ emoji: '🎂', title: '1 Year Together', sub: `${daysTogether} days of love`, color: '#fce7f3' });

  return (
    <div className="min-h-screen bg-white">
      {/* Profile header */}
      <div
        className="relative px-5 pt-14 pb-8 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'rgba(244,63,94,0.1)' }} />

        {/* Couple avatars */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}>
            <span style={{ fontSize: '28px' }}>{couple?.partner1?.[0]?.toUpperCase() ?? '👩'}</span>
          </div>
          <div className="flex flex-col items-center">
            <Heart className="h-5 w-5" style={{ color: '#f43f5e', fill: '#f43f5e' }} />
            <span className="text-gray-500 mt-1" style={{ fontSize: '11px', fontWeight: 600 }}>
              {daysTogether !== null ? `${daysTogether} days` : '💕'}
            </span>
          </div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)' }}>
            <span style={{ fontSize: '28px' }}>{couple?.partner2?.[0]?.toUpperCase() ?? '👨'}</span>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-gray-900" style={{ fontSize: '22px', fontWeight: 700 }}>{couple?.partner1} & {couple?.partner2}</h1>
          {sinceLabel && (
            <p className="text-gray-500 mt-1" style={{ fontSize: '13px' }}>Together since {sinceLabel} 💕</p>
          )}
        </div>

        {/* Settings button */}
        <button
          onClick={() => navigate('/settings')}
          className="absolute top-14 right-5 p-2 rounded-full"
          style={{ background: 'rgba(255,255,255,0.5)' }}
          title="Settings"
        >
          <Settings className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* Real activity stats */}
      <div className="px-5 -mt-4 mb-5">
        <div
          className="rounded-2xl p-4 grid grid-cols-3 gap-3"
          style={{ background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
        >
          {[
            { icon: BookOpen, value: String(realStats.entries), label: 'Log Entries', color: '#a855f7' },
            { icon: Heart, value: String(realStats.loveBombs), label: 'Love Msgs', color: '#f43f5e' },
            { value: daysTogether !== null ? String(daysTogether) : '—', label: 'Days Together', color: '#f59e0b', emoji: '💕' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              {'icon' in stat && stat.icon ? (
                <stat.icon className="h-5 w-5 mx-auto mb-1" style={{ color: stat.color }} />
              ) : (
                <span className="block mb-1" style={{ fontSize: '18px' }}>{stat.emoji}</span>
              )}
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{stat.value}</p>
              <p className="text-gray-400" style={{ fontSize: '11px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real milestones (only show if user has earned any) */}
      {milestones.length > 0 && (
        <div className="px-5 mb-5">
          <p className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Milestones Unlocked
          </p>
          <div className="grid grid-cols-2 gap-3">
            {milestones.map(a => (
              <div
                key={a.title}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{ background: a.color }}
              >
                <span style={{ fontSize: '24px' }}>{a.emoji}</span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>{a.title}</p>
                  <p className="text-gray-500" style={{ fontSize: '11px' }}>{a.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links to other features */}
      <div className="px-5 mb-5">
        <p className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          More Features
        </p>
        <div className="space-y-2.5">
          {quickLinks.map(link => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl active:scale-98 transition-transform"
              style={{ background: link.color }}
            >
              <span style={{ fontSize: '24px' }}>{link.emoji}</span>
              <div className="flex-1 text-left">
                <p style={{ fontSize: '14px', fontWeight: 600 }}>{link.label}</p>
                <p className="text-gray-500 mt-0.5" style={{ fontSize: '12px' }}>{link.sub}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}
