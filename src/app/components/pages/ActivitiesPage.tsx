import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ChevronRight, RotateCcw, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCouple } from '../contexts/CoupleContext';

// ── Quiz Data (preference-based — no "correct" answer, P1 answers, P2 guesses) ──
const quizQuestions = [
  { q: "What would you order at a coffee shop?", options: ["Black coffee ☕", "Iced latte 🧊", "Matcha latte 🍵", "Hot chocolate 🍫"] },
  { q: "Your ideal lazy Sunday?", options: ["Netflix all day 📺", "Brunch & a long walk 🥂", "Catch up on sleep 😴", "Spontaneous adventure 🗺️"] },
  { q: "What's your love language?", options: ["Words of affirmation 💬", "Physical touch 🤗", "Quality time ⏰", "Acts of service 🛠️"] },
  { q: "You're stressed — what do you do first?", options: ["Go for a walk 🚶", "Vent to someone 💬", "Go quiet & process 🤫", "Eat comfort food 🍕"] },
  { q: "Pick your dream holiday vibe", options: ["Beach & cocktails 🏖️", "City breaks & culture 🏛️", "Mountains & hiking 🏔️", "Road trip & camping 🚗"] },
  { q: "Your go-to movie genre?", options: ["Rom-com 💕", "Thriller 😱", "Documentary 🎓", "Action 💥"] },
  { q: "How do you feel about surprise plans?", options: ["Love them! 🎉", "Need a heads-up ⚠️", "Prefer to plan ahead 📋", "Depends on the mood 🤷"] },
  { q: "What's your biggest pet peeve?", options: ["Being kept waiting ⏱️", "Mess & clutter 🗃️", "Loud chewing 😬", "Interrupting mid-sentence 🗣️"] },
];

// ── Question Packs ────────────────────────────────────────────────────────────
const questionPacks = {
  deep: [
    "What's a fear you've never told anyone?",
    "When did you first realise you were falling for your partner?",
    "What's something about your childhood that shaped who you are?",
    "If you could change one thing about your relationship, what would it be?",
    "What does 'home' feel like to you?",
    "What's a dream you've quietly given up on?",
    "When do you feel most like yourself?",
    "What's the kindest thing anyone has ever done for you?",
  ],
  fun: [
    "If your relationship was a TV show, which one would it be? 📺",
    "What's the most embarrassing thing that's happened to you on a date? 😂",
    "If you could only eat one meal forever, what would it be? 🍕",
    "What celebrity would play you in a movie about your life? 🎬",
    "If you won the lottery tomorrow, what's the first thing you'd buy? 💸",
    "What's your most irrational fear? 😅",
    "If you could have any superpower, what would you pick? 🦸",
    "What ridiculous rule would you make if you ran the world? 🌍",
  ],
  spicy: [
    "What's something your partner does that secretly drives you crazy (in a good way)? 🔥",
    "Describe your ideal romantic evening in detail 🌙",
    "What's one thing you've always wanted to try together? 💫",
    "What physical feature do you find most attractive about your partner? 👀",
    "What's the most romantic thing your partner has ever done for you? 💕",
    "What song makes you think of your relationship? 🎵",
    "If you had one whole day with no plans, no phones — what would you want to do? 🌅",
    "What's something your partner does that makes you fall for them all over again? ✨",
  ],
  growth: [
    "What's one way your partner could support you better right now?",
    "What does your ideal future look like in 5 years?",
    "What's something you want to work on in yourself?",
    "How can you make your relationship even stronger?",
    "What's a shared goal you'd love to achieve together?",
    "What do you need more of in your life right now?",
    "How do you want to be remembered by the people you love?",
    "What boundary do you need to set to protect your peace?",
  ],
};

// ── Dare Cards ────────────────────────────────────────────────────────────────
const darePacks = {
  sweet: [
    "Whisper something you love about your partner in their ear 🌸",
    "Give your partner a 60-second forehead massage 💆",
    "Write them a 3-sentence love note right now 📝",
    "Hold hands and take a 5-minute walk together 🚶‍♀️",
    "Look into your partner's eyes for 30 seconds without speaking 👀",
    "Tell them your favourite memory of the two of you 💕",
    "Give the longest, warmest hug you can manage 🤗",
    "Text someone who loves your relationship and tell them why ❤️",
  ],
  fun: [
    "Do your best impression of your partner — they judge it! 🎭",
    "Serenade your partner with a song of their choice 🎶",
    "Both close your eyes and try to draw each other's face 🎨",
    "Teach your partner your weirdest talent 🤹",
    "Act out your favourite date without using words 🎬",
    "Make up a 30-second commercial for your relationship 📺",
    "Describe your partner using only food 🍕",
    "Do your silliest dance together for 1 full minute 💃",
  ],
  deep: [
    "Share one thing you've never said out loud that you appreciate about them 🌟",
    "Describe the exact moment you knew this was serious 💫",
    "Tell your partner one way they've helped you grow 🌱",
    "Name one thing you'd do differently in your relationship if you could restart 🔄",
    "Share a dream for your future you've been afraid to say 🌙",
    "Tell them one thing you need more of from them — kindly 💬",
    "Describe your partner to a stranger in one sentence 🗣️",
    "Share the last time your partner genuinely surprised you ✨",
  ],
  spicy: [
    "Recreate your first kiss — right now 💋",
    "Say out loud what you found most attractive when you first met 🔥",
    "Describe your ideal romantic evening together in detail 🌹",
    "Tell your partner one thing they do that drives you crazy (good way) 😍",
    "Play a romantic song and slow dance wherever you are 🎵",
    "Write a flirty message and send it to your partner 📱",
    "Tell them the most attractive thing they've done recently 💫",
    "Plan a 10-minute 'us time' for later tonight — and keep the secret 🤫",
  ],
};

// ── 7-Day Challenges ─────────────────────────────────────────────────────────
const challenges = [
  {
    id: 1, title: '7-Day Appreciation Challenge', emoji: '💌', color: '#fce7f3', accent: '#be185d',
    days: [
      { day: 1, task: 'Write 5 specific things you love about your partner and read them aloud', done: true },
      { day: 2, task: "Leave a handwritten note somewhere they'll find it today", done: true },
      { day: 3, task: 'Cook their favourite meal for dinner', done: false },
      { day: 4, task: 'Give them an uninterrupted hour to do whatever they want', done: false },
      { day: 5, task: 'Send a voice message telling them your favourite memory together', done: false },
      { day: 6, task: 'Plan a surprise mini date (coffee, a walk, or a sunset)', done: false },
      { day: 7, task: 'Recreate your first date as closely as possible', done: false },
    ],
  },
  {
    id: 2, title: '5-Day Connection Challenge', emoji: '🔗', color: '#ede9fe', accent: '#6d28d9',
    days: [
      { day: 1, task: 'Ask each other 3 deep questions from the question deck', done: true },
      { day: 2, task: '30 minutes of screen-free quality time together', done: false },
      { day: 3, task: "Share a dream or goal you've never mentioned before", done: false },
      { day: 4, task: 'Give each other a 10-minute back rub without distraction', done: false },
      { day: 5, task: "Write a letter about your future together — don't hold back", done: false },
    ],
  },
  {
    id: 3, title: '3-Day Fun Challenge', emoji: '🎉', color: '#fef9c3', accent: '#92400e',
    days: [
      { day: 1, task: 'Play a board game or card game — loser cooks dinner!', done: false },
      { day: 2, task: "Learn 3 facts about each other you didn't know", done: false },
      { day: 3, task: 'Watch a comedy together and share your favourite jokes', done: false },
    ],
  },
];

type QuizPhase = 'intro' | 'p1' | 'handoff' | 'p2' | 'result';
type DarePack = keyof typeof darePacks;

export default function ActivitiesPage() {
  const navigate = useNavigate();
  const { couple } = useCouple();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'home';

  const [view, setView] = useState<'home' | 'quiz' | 'questions' | 'challenges' | 'dares'>(
    initialTab as any
  );
  const [questionCategory, setQCategory] = useState<keyof typeof questionPacks>('deep');
  const [cardIndex, setCardIndex] = useState(0);
  const [darePack, setDarePack] = useState<DarePack>('sweet');
  const [dareIndex, setDareIndex] = useState(0);

  // Two-player quiz state
  const [quizPhase, setQuizPhase] = useState<QuizPhase>('intro');
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [p1Answers, setP1Answers] = useState<number[]>([]);
  const [p2Guesses, setP2Guesses] = useState<number[]>([]);

  const [challengeState, setChallengeState] = useState(challenges);
  const [openChallenge, setOpenChallenge] = useState<number | null>(null);

  const currentCards = questionPacks[questionCategory];
  const currentCard = currentCards[cardIndex % currentCards.length];

  const p1Name = couple?.partner1 ?? 'Partner 1';
  const p2Name = couple?.partner2 ?? 'Partner 2';

  function handleP1Answer(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => {
      const next = [...p1Answers, idx];
      setP1Answers(next);
      if (quizIndex < quizQuestions.length - 1) {
        setQuizIndex(i => i + 1);
        setSelected(null);
      } else {
        setQuizPhase('handoff');
        setQuizIndex(0);
        setSelected(null);
      }
    }, 600);
  }

  function handleP2Guess(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    const correct = p1Answers[quizIndex] === idx;
    setTimeout(() => {
      const next = [...p2Guesses, idx];
      setP2Guesses(next);
      if (quizIndex < quizQuestions.length - 1) {
        setQuizIndex(i => i + 1);
        setSelected(null);
      } else {
        const score = next.filter((g, i) => g === p1Answers[i]).length;
        if (score >= quizQuestions.length * 0.75) {
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        }
        setQuizPhase('result');
      }
    }, correct ? 800 : 1200);
  }

  function resetQuiz() {
    setQuizPhase('intro');
    setQuizIndex(0);
    setSelected(null);
    setP1Answers([]);
    setP2Guesses([]);
  }

  function toggleChallengeDay(challengeId: number, dayIndex: number) {
    setChallengeState(prev =>
      prev.map(c =>
        c.id === challengeId
          ? { ...c, days: c.days.map((d, i) => i === dayIndex ? { ...d, done: !d.done } : d) }
          : c
      )
    );
  }

  // ── HOME ──────────────────────────────────────────────────────────────────
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-white">
        <div className="px-5 pt-14 pb-5">
          <h1 className="text-gray-900" style={{ fontSize: '26px', fontWeight: 700 }}>Activities 🎮</h1>
          <p className="text-gray-400 mt-1" style={{ fontSize: '14px' }}>Play games, answer questions, take on challenges</p>
        </div>

        {/* Featured Quiz */}
        <div className="px-5 mb-5">
          <div
            className="rounded-3xl p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #a855f7 100%)' }}
          >
            <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <p className="text-white/80 mb-1" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Featured Game
            </p>
            <p className="text-white mb-1" style={{ fontSize: '20px', fontWeight: 700 }}>How Well Do You</p>
            <p className="text-white mb-4" style={{ fontSize: '20px', fontWeight: 700 }}>Know Each Other? 🧠</p>
            <p className="text-white/70 mb-5" style={{ fontSize: '13px' }}>8 rounds · Two players · Take turns guessing!</p>
            <button
              onClick={() => { setView('quiz'); resetQuiz(); }}
              className="px-6 py-2.5 rounded-full"
              style={{ background: '#fff', color: '#f43f5e', fontSize: '14px', fontWeight: 700 }}
            >
              Play Now →
            </button>
          </div>
        </div>

        {/* Category grid */}
        <div className="px-5 mb-5">
          <p className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Activities
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { emoji: '💬', title: 'Question Cards', sub: '4 packs · 80+ questions', bg: '#ede9fe', accent: '#5b21b6', action: () => setView('questions') },
              { emoji: '🎯', title: 'Challenges', sub: '3 challenges · 7, 5 & 3 days', bg: '#dcfce7', accent: '#15803d', action: () => setView('challenges') },
              { emoji: '🧠', title: 'Partner Quiz', sub: '8 rounds · Two-player', bg: '#fef9c3', accent: '#92400e', action: () => { setView('quiz'); resetQuiz(); } },
              { emoji: '🎲', title: 'Dare Cards', sub: '4 packs · 32 dares', bg: '#fce7f3', accent: '#9d174d', action: () => { setDarePack('sweet'); setDareIndex(0); setView('dares'); } },
            ].map(item => (
              <button
                key={item.title}
                onClick={item.action}
                className="flex flex-col gap-3 p-4 rounded-2xl text-left active:scale-95 transition-transform"
                style={{ background: item.bg }}
              >
                <span style={{ fontSize: '28px' }}>{item.emoji}</span>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: item.accent }}>{item.title}</p>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: '12px' }}>{item.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Question pack previews */}
        <div className="px-5">
          <p className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Question Packs
          </p>
          <div className="space-y-2.5">
            {[
              { key: 'deep', emoji: '🌊', label: 'Deep Questions', count: 8, color: '#dbeafe', accent: '#1e40af' },
              { key: 'fun', emoji: '😄', label: 'Fun & Silly', count: 8, color: '#fef9c3', accent: '#92400e' },
              { key: 'spicy', emoji: '🔥', label: 'Romantic & Spicy', count: 8, color: '#fce7f3', accent: '#9d174d' },
              { key: 'growth', emoji: '🎯', label: 'Growth & Goals', count: 8, color: '#dcfce7', accent: '#15803d' },
            ].map(pack => (
              <button
                key={pack.key}
                onClick={() => { setQCategory(pack.key as any); setCardIndex(0); setView('questions'); }}
                className="w-full flex items-center gap-3 p-4 rounded-2xl active:scale-98 transition-transform"
                style={{ background: pack.color }}
              >
                <span style={{ fontSize: '24px' }}>{pack.emoji}</span>
                <div className="flex-1 text-left">
                  <p style={{ fontSize: '14px', fontWeight: 600, color: pack.accent }}>{pack.label}</p>
                  <p className="text-gray-500 mt-0.5" style={{ fontSize: '12px' }}>{pack.count} questions</p>
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

  // ── QUIZ ──────────────────────────────────────────────────────────────────
  if (view === 'quiz') {
    // INTRO
    if (quizPhase === 'intro') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          style={{ background: 'linear-gradient(135deg, #fff0f3 0%, #f5f0ff 100%)' }}>
          <span style={{ fontSize: '56px', lineHeight: 1 }}>🧠</span>
          <h2 className="text-gray-900 mt-4 mb-2" style={{ fontSize: '24px', fontWeight: 800 }}>
            How Well Do You Know Each Other?
          </h2>
          <p className="text-gray-500 mb-3" style={{ fontSize: '14px', lineHeight: '1.7', maxWidth: '300px' }}>
            <strong>{p1Name}</strong> answers 8 questions about themselves first — honestly!
            Then hand the phone to <strong>{p2Name}</strong> to guess the answers.
          </p>
          <div className="w-full max-w-xs rounded-2xl p-4 mb-8 text-left space-y-2"
            style={{ background: 'rgba(244,63,94,0.07)' }}>
            <p style={{ fontSize: '13px', color: '#be185d', fontWeight: 600 }}>How it works</p>
            <p className="text-gray-600" style={{ fontSize: '13px' }}>1️⃣ {p1Name} answers 8 personal questions</p>
            <p className="text-gray-600" style={{ fontSize: '13px' }}>2️⃣ Hand phone to {p2Name}</p>
            <p className="text-gray-600" style={{ fontSize: '13px' }}>3️⃣ {p2Name} guesses {p1Name}'s answers</p>
            <p className="text-gray-600" style={{ fontSize: '13px' }}>4️⃣ See how well they know you!</p>
          </div>
          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={() => setView('home')}
              className="flex-1 py-3.5 rounded-2xl border-2"
              style={{ borderColor: '#e5e7eb', color: '#6b7280', fontSize: '14px', fontWeight: 600 }}
            >
              Back
            </button>
            <button
              onClick={() => setQuizPhase('p1')}
              className="flex-2 flex-1 py-3.5 rounded-2xl text-white"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #a855f7)', fontSize: '14px', fontWeight: 700 }}
            >
              {p1Name} goes first →
            </button>
          </div>
        </div>
      );
    }

    // PARTNER 1 ANSWERING
    if (quizPhase === 'p1') {
      const q = quizQuestions[quizIndex];
      const progress = (quizIndex / quizQuestions.length) * 100;
      return (
        <div className="min-h-screen bg-white flex flex-col">
          <div className="px-5 pt-14 pb-4 flex items-center gap-3">
            <button onClick={() => setQuizPhase('intro')} className="p-2 rounded-full" style={{ background: '#f9fafb' }}>
              <ArrowLeft className="h-4 w-4 text-gray-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-gray-400" style={{ fontSize: '12px' }}>
                  {p1Name}'s turn · {quizIndex + 1}/{quizQuestions.length}
                </p>
                <span className="px-2 py-0.5 rounded-full text-white" style={{ background: '#f43f5e', fontSize: '10px', fontWeight: 700 }}>
                  ABOUT YOU
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: '#f3f4f6' }}>
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #f43f5e, #a855f7)' }} />
              </div>
            </div>
          </div>

          <div className="flex-1 px-5 pt-4">
            <div className="rounded-3xl p-6 mb-6" style={{ background: 'linear-gradient(135deg, #fce7f3, #ede9fe)' }}>
              <p className="text-gray-500 mb-2" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Answer honestly — {p2Name} will see this!
              </p>
              <p className="text-gray-800" style={{ fontSize: '18px', fontWeight: 600, lineHeight: '1.5' }}>
                {q.q}
              </p>
            </div>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                const isSelected = selected === i;
                return (
                  <button
                    key={i}
                    onClick={() => handleP1Answer(i)}
                    disabled={selected !== null}
                    className="w-full text-left px-4 py-4 rounded-2xl border-2 transition-all"
                    style={{
                      background: isSelected ? 'linear-gradient(135deg, #fce7f3, #ede9fe)' : '#f9fafb',
                      borderColor: isSelected ? '#f43f5e' : '#f3f4f6',
                      color: isSelected ? '#be185d' : '#111827',
                      fontSize: '14px',
                      fontWeight: isSelected ? 600 : 500,
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // HANDOFF
    if (quizPhase === 'handoff') {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
          style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ede9fe 100%)' }}>
          <span style={{ fontSize: '60px', lineHeight: 1 }}>🤝</span>
          <h2 className="text-gray-900 mt-5 mb-3" style={{ fontSize: '24px', fontWeight: 800 }}>
            Pass the phone!
          </h2>
          <p className="text-gray-500 mb-2" style={{ fontSize: '15px', lineHeight: '1.7', maxWidth: '280px' }}>
            <strong>{p1Name}</strong>, lock your screen now and hand the phone to <strong>{p2Name}</strong>.
          </p>
          <p className="text-gray-400 mb-10" style={{ fontSize: '13px', maxWidth: '260px' }}>
            {p2Name} — try to guess {p1Name}'s answers. No peeking at what they picked! 👀
          </p>
          <button
            onClick={() => setQuizPhase('p2')}
            className="w-full max-w-xs py-4 rounded-2xl text-white shadow-md"
            style={{ background: 'linear-gradient(135deg, #10b981, #6366f1)', fontSize: '15px', fontWeight: 700 }}
          >
            I'm {p2Name} — ready! →
          </button>
        </div>
      );
    }

    // PARTNER 2 GUESSING
    if (quizPhase === 'p2') {
      const q = quizQuestions[quizIndex];
      const p1Answer = p1Answers[quizIndex];
      const progress = (quizIndex / quizQuestions.length) * 100;
      return (
        <div className="min-h-screen bg-white flex flex-col">
          <div className="px-5 pt-14 pb-4 flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <p className="text-gray-400" style={{ fontSize: '12px' }}>
                  {p2Name}'s guesses · {quizIndex + 1}/{quizQuestions.length}
                </p>
                <span className="px-2 py-0.5 rounded-full text-white" style={{ background: '#6366f1', fontSize: '10px', fontWeight: 700 }}>
                  GUESSING
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: '#f3f4f6' }}>
                <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #10b981, #6366f1)' }} />
              </div>
            </div>
          </div>

          <div className="flex-1 px-5 pt-4">
            <div className="rounded-3xl p-6 mb-6" style={{ background: 'linear-gradient(135deg, #dcfce7, #ede9fe)' }}>
              <p className="text-gray-500 mb-2" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                What do you think {p1Name} said?
              </p>
              <p className="text-gray-800" style={{ fontSize: '18px', fontWeight: 600, lineHeight: '1.5' }}>
                {q.q}
              </p>
            </div>
            <div className="space-y-3">
              {q.options.map((opt, i) => {
                let bg = '#f9fafb';
                let borderColor = '#f3f4f6';
                let color = '#111827';
                if (selected !== null) {
                  if (i === p1Answer) { bg = '#dcfce7'; borderColor = '#86efac'; color = '#15803d'; }
                  else if (i === selected && i !== p1Answer) { bg = '#fee2e2'; borderColor = '#fca5a5'; color = '#dc2626'; }
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleP2Guess(i)}
                    disabled={selected !== null}
                    className="w-full text-left px-4 py-4 rounded-2xl border-2 transition-all"
                    style={{ background: bg, borderColor, color, fontSize: '14px', fontWeight: 500 }}
                  >
                    {opt}
                    {selected !== null && i === p1Answer && <span className="ml-2 font-bold">✓ {p1Name} said this</span>}
                    {selected !== null && i === selected && i !== p1Answer && <span className="ml-2">✗</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // RESULT
    if (quizPhase === 'result') {
      const score = p2Guesses.filter((g, i) => g === p1Answers[i]).length;
      const pct = score / quizQuestions.length;
      const msg =
        pct === 1 ? { title: 'Telepathic! 🏆', sub: `${p2Name} knows ${p1Name} inside out. Pure relationship goals.` }
        : pct >= 0.75 ? { title: 'Amazing! 🌟', sub: `${p2Name} clearly pays close attention. Keep it up!` }
        : pct >= 0.5 ? { title: 'Pretty Good! 💕', sub: "You know the big things. Now learn the little details too." }
        : { title: 'Room to Grow! 🌱', sub: "The quiz revealed some surprises — use them as conversation starters!" };

      return (
        <div className="min-h-screen flex flex-col px-5 pt-16 pb-10"
          style={{ background: 'linear-gradient(135deg, #fff, #fce7f3)' }}>
          <div className="flex flex-col items-center text-center mb-8">
            <Trophy className="h-14 w-14 mb-3" style={{ color: '#f59e0b' }} />
            <p style={{ fontSize: '42px', fontWeight: 800, color: '#111827' }}>{score}/{quizQuestions.length}</p>
            <p className="text-gray-900 mt-2" style={{ fontSize: '22px', fontWeight: 700 }}>{msg.title}</p>
            <p className="text-gray-500 mt-2" style={{ fontSize: '14px', lineHeight: '1.6', maxWidth: '280px' }}>{msg.sub}</p>
          </div>

          {/* Answer breakdown */}
          <div className="space-y-2 mb-8">
            <p className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Answer Breakdown
            </p>
            {quizQuestions.map((q, i) => {
              const correct = p2Guesses[i] === p1Answers[i];
              return (
                <div key={i} className="rounded-2xl p-3" style={{ background: correct ? '#f0fdf4' : '#fff1f2', border: `1px solid ${correct ? '#bbf7d0' : '#fecdd3'}` }}>
                  <p className="text-gray-600 mb-1.5" style={{ fontSize: '12px', lineHeight: '1.4' }}>{q.q}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded-full" style={{ background: '#dbeafe', color: '#1e40af', fontSize: '11px', fontWeight: 600 }}>
                      {p1Name}: {q.options[p1Answers[i]]}
                    </span>
                    <span className="px-2 py-0.5 rounded-full" style={{ background: correct ? '#dcfce7' : '#fee2e2', color: correct ? '#15803d' : '#dc2626', fontSize: '11px', fontWeight: 600 }}>
                      {p2Name}: {q.options[p2Guesses[i]]} {correct ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetQuiz}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2"
              style={{ fontSize: '14px', fontWeight: 600, color: '#6b7280', borderColor: '#e5e7eb' }}
            >
              <RotateCcw className="h-4 w-4" /> Play Again
            </button>
            <button
              onClick={() => setView('home')}
              className="flex-1 py-3.5 rounded-2xl text-white"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #a855f7)', fontSize: '14px', fontWeight: 600 }}
            >
              Done 🎉
            </button>
          </div>
        </div>
      );
    }
  }

  // ── QUESTION CARDS ────────────────────────────────────────────────────────
  if (view === 'questions') {
    const packMeta: Record<string, { emoji: string; label: string; color: string }> = {
      deep: { emoji: '🌊', label: 'Deep Questions', color: '#dbeafe' },
      fun: { emoji: '😄', label: 'Fun & Silly', color: '#fef9c3' },
      spicy: { emoji: '🔥', label: 'Romantic & Spicy', color: '#fce7f3' },
      growth: { emoji: '🎯', label: 'Growth & Goals', color: '#dcfce7' },
    };
    const meta = packMeta[questionCategory];

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="px-5 pt-14 pb-5 flex items-center gap-3">
          <button onClick={() => setView('home')} className="p-2 rounded-full" style={{ background: '#f9fafb' }}>
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
          <h2>{meta.emoji} {meta.label}</h2>
        </div>

        <div className="px-5 mb-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { key: 'deep', emoji: '🌊', label: 'Deep' },
              { key: 'fun', emoji: '😄', label: 'Fun' },
              { key: 'spicy', emoji: '🔥', label: 'Spicy' },
              { key: 'growth', emoji: '🎯', label: 'Growth' },
            ].map(p => (
              <button
                key={p.key}
                onClick={() => { setQCategory(p.key as any); setCardIndex(0); }}
                className="shrink-0 px-4 py-1.5 rounded-full border-2 transition-all"
                style={{
                  borderColor: questionCategory === p.key ? '#f43f5e' : '#f3f4f6',
                  background: questionCategory === p.key ? '#fce7f3' : '#f9fafb',
                  color: questionCategory === p.key ? '#be185d' : '#6b7280',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                {p.emoji} {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 px-5 flex flex-col items-center justify-center">
          <div
            className="w-full rounded-3xl p-8 flex flex-col items-center justify-center text-center relative"
            style={{ background: meta.color, minHeight: '260px' }}
          >
            <div className="absolute top-4 right-4 text-gray-400" style={{ fontSize: '12px' }}>
              {(cardIndex % currentCards.length) + 1}/{currentCards.length}
            </div>
            <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#1f2937', fontWeight: 500, maxWidth: '280px' }}>
              {currentCard}
            </p>
          </div>

          <div className="flex gap-3 mt-6 w-full">
            <button
              onClick={() => setCardIndex(i => i === 0 ? currentCards.length - 1 : i - 1)}
              className="flex-1 py-3.5 rounded-2xl border-2"
              style={{ borderColor: '#f3f4f6', color: '#6b7280', fontSize: '14px', fontWeight: 600 }}
            >
              ← Previous
            </button>
            <button
              onClick={() => setCardIndex(i => (i + 1) % currentCards.length)}
              className="flex-1 py-3.5 rounded-2xl text-white"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)', fontSize: '14px', fontWeight: 600 }}
            >
              Next Card →
            </button>
          </div>
          <p className="text-gray-400 mt-3" style={{ fontSize: '12px' }}>Read out loud and take turns answering 💬</p>
        </div>
        <div className="h-8" />
      </div>
    );
  }

  // ── DARES ─────────────────────────────────────────────────────────────────
  if (view === 'dares') {
    const darePackMeta: Record<DarePack, { emoji: string; label: string; color: string; accent: string }> = {
      sweet: { emoji: '🌸', label: 'Sweet', color: '#fce7f3', accent: '#be185d' },
      fun: { emoji: '😄', label: 'Fun', color: '#fef9c3', accent: '#92400e' },
      deep: { emoji: '🌊', label: 'Deep', color: '#dbeafe', accent: '#1e40af' },
      spicy: { emoji: '🔥', label: 'Spicy', color: '#fff0f3', accent: '#e11d48' },
    };
    const meta = darePackMeta[darePack];
    const currentDares = darePacks[darePack];
    const currentDare = currentDares[dareIndex % currentDares.length];

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="px-5 pt-14 pb-4 flex items-center gap-3">
          <button onClick={() => setView('home')} className="p-2 rounded-full" style={{ background: '#f9fafb' }}>
            <ArrowLeft className="h-4 w-4 text-gray-600" />
          </button>
          <div>
            <h2 className="text-gray-900" style={{ fontSize: '20px', fontWeight: 700 }}>Dare Cards 🎲</h2>
            <p className="text-gray-400" style={{ fontSize: '12px' }}>Take turns drawing a dare!</p>
          </div>
        </div>

        {/* Pack selector */}
        <div className="px-5 mb-5">
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {(Object.keys(darePackMeta) as DarePack[]).map(p => (
              <button
                key={p}
                onClick={() => { setDarePack(p); setDareIndex(0); }}
                className="shrink-0 px-4 py-1.5 rounded-full border-2 transition-all"
                style={{
                  borderColor: darePack === p ? '#f43f5e' : '#f3f4f6',
                  background: darePack === p ? '#fce7f3' : '#f9fafb',
                  color: darePack === p ? '#be185d' : '#6b7280',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                {darePackMeta[p].emoji} {darePackMeta[p].label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 px-5 flex flex-col items-center justify-center">
          <div
            className="w-full rounded-3xl p-8 flex flex-col items-center justify-center text-center relative"
            style={{ background: meta.color, minHeight: '280px' }}
          >
            <div className="absolute top-4 right-4 text-gray-400" style={{ fontSize: '12px' }}>
              {(dareIndex % currentDares.length) + 1}/{currentDares.length}
            </div>
            <span style={{ fontSize: '48px', lineHeight: 1, marginBottom: '16px' }}>🎲</span>
            <p style={{ fontSize: '18px', lineHeight: '1.65', color: '#1f2937', fontWeight: 500, maxWidth: '280px' }}>
              {currentDare}
            </p>
          </div>

          <div className="flex gap-3 mt-6 w-full">
            <button
              onClick={() => setDareIndex(i => i === 0 ? currentDares.length - 1 : i - 1)}
              className="flex-1 py-3.5 rounded-2xl border-2"
              style={{ borderColor: '#f3f4f6', color: '#6b7280', fontSize: '14px', fontWeight: 600 }}
            >
              ← Back
            </button>
            <button
              onClick={() => setDareIndex(i => (i + 1) % currentDares.length)}
              className="flex-1 py-3.5 rounded-2xl text-white"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)', fontSize: '14px', fontWeight: 600 }}
            >
              Next Dare →
            </button>
          </div>
          <p className="text-gray-400 mt-3" style={{ fontSize: '12px' }}>Take turns picking a dare 🎲</p>
        </div>
        <div className="h-8" />
      </div>
    );
  }

  // ── CHALLENGES ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <div className="px-5 pt-14 pb-5 flex items-center gap-3">
        <button onClick={() => setView('home')} className="p-2 rounded-full" style={{ background: '#f9fafb' }}>
          <ArrowLeft className="h-4 w-4 text-gray-600" />
        </button>
        <h2>Couple Challenges 🎯</h2>
      </div>

      <div className="px-5 space-y-4">
        {challengeState.map(challenge => {
          const done = challenge.days.filter(d => d.done).length;
          const total = challenge.days.length;
          const pct = Math.round((done / total) * 100);
          const open = openChallenge === challenge.id;

          return (
            <div key={challenge.id} className="rounded-2xl overflow-hidden border" style={{ borderColor: '#f3f4f6' }}>
              <button
                className="w-full flex items-center gap-3 p-4 text-left"
                style={{ background: challenge.color }}
                onClick={() => setOpenChallenge(open ? null : challenge.id)}
              >
                <span style={{ fontSize: '32px' }}>{challenge.emoji}</span>
                <div className="flex-1">
                  <p style={{ fontSize: '15px', fontWeight: 600, color: challenge.accent }}>{challenge.title}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.1)' }}>
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: challenge.accent }} />
                    </div>
                    <span style={{ fontSize: '12px', color: challenge.accent, fontWeight: 600 }}>{done}/{total}</span>
                  </div>
                </div>
                <span style={{ color: challenge.accent, fontSize: '18px' }}>{open ? '▲' : '▼'}</span>
              </button>

              {open && (
                <div className="divide-y" style={{ borderColor: '#f3f4f6' }}>
                  {challenge.days.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => toggleChallengeDay(challenge.id, i)}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors"
                      style={{ background: day.done ? '#f0fdf4' : '#fff' }}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2"
                        style={{ background: day.done ? '#16a34a' : 'transparent', borderColor: day.done ? '#16a34a' : '#d1d5db' }}
                      >
                        {day.done && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Day {day.day}
                        </p>
                        <p className="mt-0.5" style={{ fontSize: '13px', color: day.done ? '#15803d' : '#374151', lineHeight: '1.5' }}>
                          {day.task}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="h-8" />
    </div>
  );
}
