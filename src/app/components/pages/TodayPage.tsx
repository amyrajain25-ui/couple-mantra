import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { useCouple } from '../contexts/CoupleContext';

const dailyQuestion = "What's one small thing your partner does that makes you feel truly loved?";

const todayChallenge = {
  emoji: '💌',
  title: 'The Appreciation Text',
  description: 'Send your partner a voice message or text listing 3 specific, detailed things you love about them.',
  points: 50,
};

const moodOptions = ['😍', '🥰', '😊', '😐', '😔', '😤'];

export default function TodayPage() {
  const navigate = useNavigate();
  const { couple } = useCouple();
  const [mood, setMood] = useState<string | null>(null);
  const [challengeDone, setChallengeDone] = useState(false);
  const [questionAnswered, setQuestionAnswered] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [answer, setAnswer] = useState('');

  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const daysTogether = couple?.since
    ? Math.floor((Date.now() - new Date(couple.since).getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="bg-white min-h-screen">
      {/* Hero gradient header */}
      <div
        className="relative overflow-hidden px-5 pt-14 pb-7"
        style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 55%, #a855f7 100%)' }}
      >
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        />
        <div
          className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        />

        <div className="relative">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/75" style={{ fontSize: '12px' }}>{dateStr}</p>
              <h1 className="text-white mt-1" style={{ fontSize: '24px', fontWeight: 700 }}>
                Good morning! 👋
              </h1>
              <p className="text-white/80 mt-0.5" style={{ fontSize: '14px' }}>{couple?.partner1} & {couple?.partner2}</p>
            </div>
          </div>

          {/* Stats row */}
          {daysTogether !== null && (
            <div className="mt-5">
              <div
                className="rounded-2xl py-3 px-4 text-center inline-block"
                style={{ background: 'rgba(255,255,255,0.18)' }}
              >
                <p className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>{daysTogether} 💕</p>
                <p className="text-white/70 mt-0.5" style={{ fontSize: '11px' }}>Days Together</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 pt-5 space-y-5">
        {/* Mood check-in */}
        <div>
          <p className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            How are you feeling today?
          </p>
          <div className="flex gap-2">
            {moodOptions.map(m => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className="flex-1 rounded-2xl py-2 transition-all"
                style={{
                  background: mood === m ? 'linear-gradient(135deg, #fce7f3, #ede9fe)' : '#f9fafb',
                  border: mood === m ? '1.5px solid #f9a8d4' : '1.5px solid transparent',
                  fontSize: '20px',
                  transform: mood === m ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Play */}
        <div>
          <p className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Quick Play
          </p>
          <div className="grid grid-cols-4 gap-2.5">
            {[
              { emoji: '🧠', label: 'Quiz', bg: '#fef9c3', accent: '#854d0e', path: '/activities?tab=quiz' },
              { emoji: '💬', label: 'Questions', bg: '#ede9fe', accent: '#5b21b6', path: '/activities?tab=questions' },
              { emoji: '🎯', label: 'Challenge', bg: '#dcfce7', accent: '#14532d', path: '/activities?tab=challenges' },
              { emoji: '📝', label: 'Log', bg: '#fce7f3', accent: '#9d174d', path: '/log' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center gap-1.5 py-3 rounded-2xl active:scale-95 transition-transform"
                style={{ background: item.bg }}
              >
                <span style={{ fontSize: '22px' }}>{item.emoji}</span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: item.accent }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Question */}
        <div>
          <p className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Today's Question
          </p>
          <div
            className="rounded-2xl p-5"
            style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #ede9fe 100%)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontSize: '28px' }}>💭</span>
              {questionAnswered && (
                <span style={{ color: '#16a34a', fontSize: '12px', fontWeight: 600 }}>✓ Answered</span>
              )}
            </div>
            <p className="text-gray-800 mb-4" style={{ fontSize: '15px', lineHeight: '1.6' }}>
              {dailyQuestion}
            </p>
            {!questionAnswered ? (
              <button
                onClick={() => setShowAnswerModal(true)}
                className="w-full py-3 rounded-xl text-white"
                style={{
                  background: 'linear-gradient(135deg, #ec4899, #a855f7)',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                Share Your Answer 💕
              </button>
            ) : (
              <button
                className="w-full py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.6)', color: '#6b7280', fontSize: '14px' }}
              >
                See Partner's Answer →
              </button>
            )}
          </div>
        </div>

        {/* Today's Challenge */}
        <div>
          <p className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Daily Challenge
          </p>
          <div
            className="rounded-2xl p-4 border"
            style={{ borderColor: challengeDone ? '#bbf7d0' : '#fce7f3', background: challengeDone ? '#f0fdf4' : '#fff9fb' }}
          >
            <div className="flex gap-3">
              <span style={{ fontSize: '36px' }}>{todayChallenge.emoji}</span>
              <div className="flex-1">
                <p style={{ fontSize: '15px', fontWeight: 600 }}>{todayChallenge.title}</p>
                <p className="text-gray-500 mt-1" style={{ fontSize: '13px', lineHeight: '1.5' }}>
                  {todayChallenge.description}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span style={{ fontSize: '12px', color: '#d97706', fontWeight: 600 }}>⭐ +{todayChallenge.points} pts</span>
                  <button
                    onClick={() => setChallengeDone(!challengeDone)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full"
                    style={{
                      background: challengeDone ? '#dcfce7' : 'linear-gradient(135deg, #f43f5e, #ec4899)',
                      color: challengeDone ? '#15803d' : '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                    }}
                  >
                    {challengeDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                    {challengeDone ? 'Done!' : 'Mark Done'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Explore more */}
        <div>
          <p className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Explore More
          </p>
          <div className="space-y-2.5">
            {[
              { emoji: '🎮', title: 'Play a Couple Quiz', sub: 'How well do you know each other?', bg: '#fef9c3', path: '/activities' },
              { emoji: '🌱', title: "Today's Log Prompts", sub: '4 new reflections waiting for you', bg: '#ede9fe', path: '/log' },
              { emoji: '💑', title: 'Date Night Ideas', sub: '10 ideas, from free to fancy', bg: '#fce7f3', path: '/connect' },

            ].map(item => (
              <button
                key={item.title}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 p-4 rounded-2xl active:scale-98 transition-transform"
                style={{ background: item.bg }}
              >
                <span style={{ fontSize: '26px' }}>{item.emoji}</span>
                <div className="flex-1 text-left">
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>{item.title}</p>
                  <p className="text-gray-400 mt-0.5" style={{ fontSize: '12px' }}>{item.sub}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300" />
              </button>
            ))}
          </div>
        </div>

        <div className="h-2" />
      </div>

      {/* Answer modal */}
      {showAnswerModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.5)', maxWidth: '100vw' }}>
          <div className="w-full bg-white rounded-t-3xl p-6" style={{ maxWidth: '430px' }}>
            <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto mb-5" />
            <p className="text-gray-800 mb-4" style={{ fontSize: '15px', fontWeight: 600, lineHeight: '1.5' }}>
              {dailyQuestion}
            </p>
            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              placeholder="Share your thoughts with your partner..."
              rows={4}
              className="w-full rounded-2xl p-4 border outline-none resize-none"
              style={{ fontSize: '14px', lineHeight: '1.6', borderColor: '#f0e4f4' }}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowAnswerModal(false)}
                className="flex-1 py-3 rounded-xl border"
                style={{ fontSize: '14px', color: '#6b7280', borderColor: '#e5e7eb' }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (answer.trim()) {
                    setQuestionAnswered(true);
                    setShowAnswerModal(false);
                  }
                }}
                className="flex-1 py-3 rounded-xl text-white"
                style={{
                  background: answer.trim()
                    ? 'linear-gradient(135deg, #f43f5e, #ec4899)'
                    : '#e5e7eb',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: answer.trim() ? '#fff' : '#9ca3af',
                }}
              >
                Share 💕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
