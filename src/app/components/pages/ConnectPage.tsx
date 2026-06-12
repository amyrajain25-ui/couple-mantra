import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Send, Heart, X, Copy, Share2, PlusCircle, MessageSquare } from 'lucide-react';
import { useCouple } from '../contexts/CoupleContext';
import { toast } from 'sonner';

const conversationStarters = {
  deep: [
    "What's something you've always wanted to tell me but never found the right moment?",
    "If you could relive one day of our relationship, which would you choose and why?",
    "What do you think is the biggest thing holding us back from our full potential as a couple?",
    "When do you feel most understood by me?",
    "What's one way our relationship has changed you as a person?",
    "What does intimacy mean to you — and do you feel we have enough of it?",
  ],
  light: [
    "If we had to swap lives with a celebrity couple for a week, who'd you pick? 😂",
    "What's the weirdest thing you've ever Googled at 2am?",
    "If our relationship was a reality TV show, what would it be called?",
    "What's one thing I do that secretly cracks you up?",
    "If you could add one rule to our household, what would it be?",
    "What's the most adventurous thing you want to try before we turn 40?",
  ],
  checkin: [
    "On a scale of 1–10, how connected are you feeling to me right now? Why?",
    "What's been the best part of your week so far?",
    "Is there anything on your mind that you haven't shared with me yet?",
    "What's one thing I could do to make your next week better?",
    "Are you feeling seen and heard by me lately? Be honest.",
    "What would make today feel like a win for you?",
  ],
};

const dateIdeas = [
  { emoji: '🎭', title: 'Improv Class', type: 'Out', cost: '$30', desc: 'Sign up for a beginner improv workshop. Warning: you will both embarrass yourselves equally.' },
  { emoji: '🌃', title: 'Night Photography Walk', type: 'Outdoors', cost: '$0', desc: 'Explore your city after dark with just your phone cameras. See familiar streets through new eyes.' },
  { emoji: '🎯', title: 'Mini Golf Battle', type: 'Out', cost: '$20', desc: 'Keep a running score, trash talk encouraged. Winner picks dinner. Loser does the washing up.' },
  { emoji: '🧘', title: 'Partner Yoga at Home', type: 'At Home', cost: '$0', desc: 'Pull up a YouTube partner yoga video. It will end in laughter. That is entirely the point.' },
  { emoji: '🍦', title: 'Dessert Crawl', type: 'Out', cost: '$25', desc: 'Make a list of 3 dessert spots and hit them all in one evening. Rate each one out of 10.' },
  { emoji: '🔐', title: 'Escape Room', type: 'Out', cost: '$40', desc: "Book an escape room and find out whether you communicate well under pressure. You'll learn things." },
  { emoji: '🎵', title: 'Live Music Discovery', type: 'Out', cost: '$15', desc: 'Find a small local venue with an artist neither of you have heard of. You might discover something special.' },
  { emoji: '🛍️', title: 'Charity Shop Challenge', type: 'Out', cost: '$10', desc: '$5 each. 20 minutes to find the funniest or most meaningful item in the shop. Winner gets bragging rights.' },
  { emoji: '🏄', title: 'Try a Water Activity', type: 'Outdoors', cost: '$35', desc: 'Kayak, paddleboard, or swim somewhere neither of you has been. Falling in is acceptable.' },
  { emoji: '🎲', title: 'Board Game Café', type: 'Out', cost: '$20', desc: 'Visit a board game café and commit to trying 3 games you have never heard of before.' },
];

const loveBombs = [
  "You make ordinary days feel special 💛",
  "I love how you laugh — it’s my favourite sound.",
  "I'm so grateful you chose me, every single day.",
  "Coming home to you is the best part of any day.",
  "You are more than enough, exactly as you are.",
  "I notice every little thing you do for me, and it means everything.",
  "You make me braver just by being beside me.",
  "I love who I am when I'm with you.",
];

export default function ConnectPage() {
  const navigate = useNavigate();
  const { couple } = useCouple();

  const [starterCategory, setStarterCategory] = useState<keyof typeof conversationStarters>('deep');
  const [starterIndex, setStarterIndex] = useState(0);
  const [dateFilter, setDateFilter] = useState<'all' | 'free' | 'home' | 'out'>('all');
  
  const [bombIndex, setBombIndex] = useState(0);
  const [customText, setCustomText] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [sentHistory, setSentHistory] = useState<any[]>([]);

  const partnerName = couple?.partner2 ?? 'Partner';

  const starters = conversationStarters[starterCategory];
  const currentStarter = starters[starterIndex % starters.length];

  const filteredDates = dateIdeas.filter(d => {
    if (dateFilter === 'free') return d.cost === '$0' || d.cost === 'Free';
    if (dateFilter === 'home') return d.type === 'At Home';
    if (dateFilter === 'out') return d.type === 'Out' || d.type === 'Outdoors';
    return true;
  });

  // Load love bombs history
  useEffect(() => {
    const stored = localStorage.getItem('tm_sent_love_bombs');
    if (stored) {
      setSentHistory(JSON.parse(stored));
    }
  }, []);

  const currentLoveBombText = isCustomMode ? customText : loveBombs[bombIndex];

  function nextBomb() {
    setBombIndex(i => (i + 1) % loveBombs.length);
  }

  function handleLogLoveBomb(method: 'share' | 'copy' | 'log') {
    if (!currentLoveBombText.trim()) return;

    const newBomb = {
      id: Date.now(),
      text: currentLoveBombText.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      method,
    };

    const updated = [newBomb, ...sentHistory];
    localStorage.setItem('tm_sent_love_bombs', JSON.stringify(updated));
    setSentHistory(updated);
    setShowSendModal(false);

    if (isCustomMode) {
      setCustomText('');
      setIsCustomMode(false);
    }

    if (method === 'log') {
      toast.success('Saved to Love Book 📖', {
        description: 'Successfully logged this expression of love.'
      });
    }
  }

  const handleShare = async () => {
    const textToSend = `"${currentLoveBombText}" - sent with Bond 💕`;
    if (navigator.share) {
      try {
        await navigator.share({ text: textToSend });
        handleLogLoveBomb('share');
      } catch (err) {
        // Fallback if user cancels or it fails
      }
    } else {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(textToSend)}`;
      window.open(whatsappUrl, '_blank');
      handleLogLoveBomb('share');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentLoveBombText);
    toast.success('Copied to clipboard! 📋');
    handleLogLoveBomb('copy');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="px-5 pt-14 pb-5">
        <h1 className="text-gray-900" style={{ fontSize: '26px', fontWeight: 700 }}>Connect 💕</h1>
        <p className="text-gray-400 mt-1" style={{ fontSize: '14px' }}>Spark conversations, plan dates, send love</p>
      </div>

      {/* Love Bomb Card */}
      <div className="px-5 mb-6">
        <p className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Send a Love Bomb to {partnerName} 💣
        </p>
        <div
          className="rounded-3xl p-5 relative overflow-hidden transition-all"
          style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 60%, #a855f7 100%)' }}
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
          
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/70" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.04em' }}>
              {isCustomMode ? 'WRITE CUSTOM MESSAGE' : 'CHOOSE SUGGESTION'}
            </p>
            <button
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="text-white bg-white/20 hover:bg-white/30 transition-colors px-2.5 py-1 rounded-full text-xs font-semibold"
            >
              {isCustomMode ? 'Use Suggestions' : 'Write Custom'}
            </button>
          </div>

          {isCustomMode ? (
            <textarea
              value={customText}
              onChange={e => setCustomText(e.target.value)}
              placeholder={`Write something sweet to ${partnerName}...`}
              rows={3}
              className="w-full bg-white/10 text-white placeholder-white/60 border border-white/20 rounded-2xl p-3 outline-none resize-none mb-4"
              style={{ fontSize: '15px', lineHeight: '1.4' }}
            />
          ) : (
            <p className="text-white mb-5" style={{ fontSize: '18px', fontWeight: 600, lineHeight: '1.5' }}>
              "{loveBombs[bombIndex]}"
            </p>
          )}

          <div className="flex gap-3">
            {!isCustomMode && (
              <button
                onClick={nextBomb}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full"
                style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '13px', fontWeight: 600 }}
              >
                <RefreshCw className="h-3.5 w-3.5" /> Next Idea
              </button>
            )}
            <button
              onClick={() => setShowSendModal(true)}
              disabled={isCustomMode && !customText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full ml-auto"
              style={{
                background: '#fff',
                color: '#f43f5e',
                fontSize: '13px',
                fontWeight: 700,
                opacity: (isCustomMode && !customText.trim()) ? 0.6 : 1,
              }}
            >
              <Send className="h-3.5 w-3.5" /> Send to {partnerName} 💌
            </button>
          </div>
        </div>
      </div>

      {/* Love Book History Log */}
      {sentHistory.length > 0 && (
        <div className="px-5 mb-6">
          <p className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Our Love Book 📖
          </p>
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {sentHistory.map(bomb => (
              <div
                key={bomb.id}
                className="rounded-2xl p-3.5 border flex gap-3 items-start"
                style={{ borderColor: '#f3f4f6', background: '#fafafa' }}
              >
                <div className="p-2 rounded-xl" style={{ background: '#fef2f2' }}>
                  <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800" style={{ fontSize: '13px', lineHeight: '1.45' }}>"{bomb.text}"</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gray-400" style={{ fontSize: '10px' }}>{bomb.date} at {bomb.time}</span>
                    <span
                      className="px-2 py-0.5 rounded-full text-gray-500"
                      style={{ background: '#f3f4f6', fontSize: '9px', fontWeight: 600 }}
                    >
                      {bomb.method === 'share' ? '📲 Shared' : bomb.method === 'copy' ? '📋 Copied' : '💾 Logged'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conversation Starters */}
      <div className="px-5 mb-6">
        <p className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Conversation Starters
        </p>

        <div className="flex gap-2 mb-4">
          {([
            { key: 'deep', emoji: '🌊', label: 'Deep' },
            { key: 'light', emoji: '😄', label: 'Fun' },
            { key: 'checkin', emoji: '💬', label: 'Check-in' },
          ] as const).map(c => (
            <button
              key={c.key}
              onClick={() => { setStarterCategory(c.key); setStarterIndex(0); }}
              className="flex-1 py-2 rounded-2xl border-2 transition-all"
              style={{
                background: starterCategory === c.key ? '#fce7f3' : '#f9fafb',
                borderColor: starterCategory === c.key ? '#f43f5e' : '#f3f4f6',
                color: starterCategory === c.key ? '#be185d' : '#6b7280',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <div className="rounded-2xl p-5 border" style={{ borderColor: '#fce7f3', background: '#fff9fb' }}>
          <p className="text-gray-800 mb-4" style={{ fontSize: '16px', lineHeight: '1.6', fontWeight: 500 }}>
            💬 {currentStarter}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-gray-400" style={{ fontSize: '12px' }}>
              {(starterIndex % starters.length) + 1} of {starters.length}
            </span>
            <button
              onClick={() => setStarterIndex(i => i + 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-white"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)', fontSize: '13px', fontWeight: 600 }}
            >
              Next <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>



      {/* Date Ideas */}
      <div className="px-5 mb-5">
        <p className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Date Night Ideas 💑
        </p>

        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {([
            { key: 'all', label: 'All' },
            { key: 'free', label: '🆓 Free' },
            { key: 'home', label: '🏠 At Home' },
            { key: 'out', label: '🌍 Go Out' },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setDateFilter(f.key)}
              className="shrink-0 px-4 py-1.5 rounded-full border-2 transition-all"
              style={{
                background: dateFilter === f.key ? '#1f2937' : '#f9fafb',
                borderColor: dateFilter === f.key ? '#1f2937' : '#f3f4f6',
                color: dateFilter === f.key ? '#fff' : '#6b7280',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredDates.map((idea, i) => (
            <div
              key={i}
              className="flex gap-3 p-4 rounded-2xl border"
              style={{ borderColor: '#f3f4f6', background: '#fafafa' }}
            >
              <span style={{ fontSize: '28px' }}>{idea.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>{idea.title}</p>
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{ background: idea.cost === '$0' || idea.cost === 'Free' ? '#dcfce7' : '#fce7f3', color: idea.cost === '$0' || idea.cost === 'Free' ? '#15803d' : '#be185d', fontSize: '10px', fontWeight: 600 }}
                  >
                    {idea.cost}
                  </span>
                </div>
                <p className="text-gray-500" style={{ fontSize: '13px', lineHeight: '1.5' }}>{idea.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-6" />

      {/* Share / Send Sheet Modal */}
      {showSendModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full bg-white rounded-t-3xl p-6" style={{ maxWidth: '430px' }}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-bold text-gray-900" style={{ fontSize: '16px' }}>Send Love Bomb</h3>
              <button onClick={() => setShowSendModal(false)}>
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            
            <p className="text-gray-500 mb-5" style={{ fontSize: '13px', lineHeight: '1.45' }}>
              How would you like to share this message with {partnerName}?
            </p>

            <div className="space-y-3">
              <button
                onClick={handleShare}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border text-left hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#f3f4f6' }}
              >
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-500">
                  <Share2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>Share via Apps</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af' }}>Send via WhatsApp, iMessage, SMS, etc.</p>
                </div>
              </button>

              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border text-left hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#f3f4f6' }}
              >
                <div className="p-2.5 rounded-xl bg-purple-50 text-purple-500">
                  <Copy className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>Copy Message</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af' }}>Copy text to paste it manually</p>
                </div>
              </button>

              <button
                onClick={() => handleLogLoveBomb('log')}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border text-left hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#f3f4f6' }}
              >
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-500">
                  <PlusCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize: '14px', fontWeight: 600 }}>Log in Love Book Only</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af' }}>Save to history inside Bond without exporting</p>
                </div>
              </button>
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-gray-50 border border-gray-100 flex gap-2">
              <MessageSquare className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-gray-500 italic text-left" style={{ fontSize: '12px', lineHeight: '1.4' }}>
                "{currentLoveBombText}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
