import { useState, useEffect } from 'react';
import { X, Edit2, Trash2 } from 'lucide-react';
import { useCouple } from '../contexts/CoupleContext';

type Category = 'all' | 'spark' | 'warmth' | 'depth' | 'vision';

const categoryMeta = {
  spark: { emoji: '⚡', label: 'Spark', color: '#fef9c3', accent: '#b45309', desc: 'Fun & playful moments' },
  warmth: { emoji: '🧡', label: 'Warmth', color: '#fce7f3', accent: '#be185d', desc: 'Gratitude & appreciation' },
  depth: { emoji: '💜', label: 'Depth', color: '#ede9fe', accent: '#6d28d9', desc: 'Deep reflection & vulnerability' },
  vision: { emoji: '🔭', label: 'Vision', color: '#dcfce7', accent: '#15803d', desc: 'Dreams, goals & future' },
};

const prompts: {
  id: number;
  category: Exclude<Category, 'all'>;
  text: string;
}[] = [
  { id: 1, category: 'spark', text: "What made you genuinely laugh today?" },
  { id: 2, category: 'spark', text: "If you could teleport anywhere right now, where would you two go?" },
  { id: 3, category: 'spark', text: "What's something that surprised you in a good way this week?" },
  { id: 4, category: 'warmth', text: "What's something your partner did recently that you noticed but didn't say out loud?" },
  { id: 5, category: 'warmth', text: "Name one thing you're grateful your partner brings to your daily life." },
  { id: 6, category: 'warmth', text: "Describe a moment this week when you felt truly cared for." },
  { id: 7, category: 'depth', text: "When did you last feel completely understood by your partner?" },
  { id: 8, category: 'depth', text: "What have you been carrying lately that you haven't fully shared?" },
  { id: 9, category: 'depth', text: "What does feeling truly loved look like for you right now?" },
  { id: 10, category: 'vision', text: "What's a shared dream you'd love to make real in the next 12 months?" },
  { id: 11, category: 'vision', text: "What's one thing you're actively working on in yourself as a partner?" },
  { id: 12, category: 'vision', text: "What does your ideal life together look like in 5 years?" },
];

const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default function CouplePage() {
  const { couple } = useCouple();
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [entries, setEntries] = useState<any[]>([]);
  const [activePrompt, setActivePrompt] = useState<typeof prompts[0] | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [editingEntryId, setEditingEntryId] = useState<number | null>(null);
  const [tab, setTab] = useState<'today' | 'past'>('today');

  // Load entries from localStorage (no fake seed data)
  useEffect(() => {
    const stored = localStorage.getItem('tm_log_entries');
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch {
        setEntries([]);
      }
    }
  }, [couple]);

  // Compute today's answers map
  const todayStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const todayEntries = entries.filter(e => e.date === todayStr);
  const savedAnswers: Record<number, string> = {};
  prompts.forEach(p => {
    const match = todayEntries.find(e => e.prompt === p.text);
    if (match) {
      savedAnswers[p.id] = match.answer;
    }
  });

  const filtered = activeCategory === 'all'
    ? prompts
    : prompts.filter(p => p.category === activeCategory);

  function handleSaveAnswer(promptId: number) {
    const text = answers[promptId];
    if (!text?.trim()) return;

    let updatedEntries = [...entries];
    if (editingEntryId !== null) {
      updatedEntries = updatedEntries.map(e => e.id === editingEntryId ? { ...e, answer: text } : e);
      setEditingEntryId(null);
    } else {
      const promptObj = prompts.find(p => p.id === promptId);
      if (!promptObj) return;

      const existingIndex = updatedEntries.findIndex(e => e.prompt === promptObj.text && e.date === todayStr);
      if (existingIndex >= 0) {
        updatedEntries[existingIndex].answer = text;
      } else {
        updatedEntries.unshift({
          id: Date.now(),
          date: todayStr,
          category: promptObj.category,
          prompt: promptObj.text,
          answer: text,
        });
      }
    }

    localStorage.setItem('tm_log_entries', JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
    setActivePrompt(null);
  }

  function handleDeleteEntry(id: number) {
    const updated = entries.filter(e => e.id !== id);
    localStorage.setItem('tm_log_entries', JSON.stringify(updated));
    setEntries(updated);
  }

  function startEditEntry(entry: any) {
    setEditingEntryId(entry.id);
    const mockPrompt = prompts.find(p => p.text === entry.prompt) || {
      id: 999,
      category: entry.category,
      text: entry.prompt
    };
    setAnswers(prev => ({ ...prev, [mockPrompt.id]: entry.answer }));
    setActivePrompt(mockPrompt);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-gray-900" style={{ fontSize: '26px', fontWeight: 700 }}>Our Log 📓</h1>
        <p className="text-gray-400 mt-1" style={{ fontSize: '14px' }}>Reflect together, grow together</p>
      </div>

      {/* Tab switcher */}
      <div className="px-5 mb-4">
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: '#f3f4f6' }}>
          {(['today', 'past'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-xl transition-all"
              style={{
                background: tab === t ? '#fff' : 'transparent',
                color: tab === t ? '#111827' : '#9ca3af',
                fontSize: '14px',
                fontWeight: tab === t ? 600 : 400,
                boxShadow: tab === t ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {t === 'today' ? `📅 ${today}` : '📚 Past Entries'}
            </button>
          ))}
        </div>
      </div>

      {tab === 'today' && (
        <>
          {/* Category filter */}
          <div className="px-5 mb-5">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveCategory('all')}
                className="shrink-0 px-4 py-1.5 rounded-full border-2 transition-all"
                style={{
                  background: activeCategory === 'all' ? '#1f2937' : '#f9fafb',
                  borderColor: activeCategory === 'all' ? '#1f2937' : '#f3f4f6',
                  color: activeCategory === 'all' ? '#fff' : '#6b7280',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                All
              </button>
              {(Object.entries(categoryMeta) as [Exclude<Category, 'all'>, typeof categoryMeta.spark][]).map(([key, meta]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className="shrink-0 px-4 py-1.5 rounded-full border-2 transition-all"
                  style={{
                    background: activeCategory === key ? meta.color : '#f9fafb',
                    borderColor: activeCategory === key ? meta.accent : '#f3f4f6',
                    color: activeCategory === key ? meta.accent : '#6b7280',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  {meta.emoji} {meta.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompts */}
          <div className="px-5 space-y-3">
            {filtered.map(prompt => {
              const meta = categoryMeta[prompt.category];
              const saved = savedAnswers[prompt.id];
              return (
                <button
                  key={prompt.id}
                  onClick={() => {
                    setEditingEntryId(null);
                    setAnswers(prev => ({ ...prev, [prompt.id]: saved || '' }));
                    setActivePrompt(prompt);
                  }}
                  className="w-full text-left rounded-2xl overflow-hidden transition-all active:scale-98"
                  style={{
                    background: saved ? meta.color : '#fafafa',
                    border: `1px solid ${saved ? meta.accent + '40' : '#f3f4f6'}`,
                    borderLeft: `4px solid ${meta.accent}`,
                  }}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="px-2 py-0.5 rounded-full"
                        style={{ background: meta.color, color: meta.accent, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}
                      >
                        {meta.emoji} {meta.label}
                      </span>
                      {saved && <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>✓ Answered</span>}
                    </div>
                    <p className="text-gray-700" style={{ fontSize: '14px', lineHeight: '1.5' }}>{prompt.text}</p>
                    {saved && (
                      <p className="text-gray-500 mt-2 line-clamp-2" style={{ fontSize: '12px', fontStyle: 'italic' }}>"{saved}"</p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {tab === 'past' && (
        <div className="px-5 space-y-4">
          {entries.map((entry) => {
            const meta = categoryMeta[entry.category] || categoryMeta.warmth;
            return (
              <div
                key={entry.id}
                className="rounded-2xl p-4 flex flex-col"
                style={{ background: meta.color + '60', border: `1px solid ${meta.accent}30`, borderLeft: `4px solid ${meta.accent}` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{ background: meta.color, color: meta.accent, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}
                  >
                    {meta.emoji} {meta.label}
                  </span>
                  <span className="text-gray-400" style={{ fontSize: '11px' }}>{entry.date}</span>
                </div>
                <p className="text-gray-500 mb-2" style={{ fontSize: '12px', fontStyle: 'italic' }}>{entry.prompt}</p>
                <p className="text-gray-800 flex-1 mb-3" style={{ fontSize: '14px', lineHeight: '1.5' }}>{entry.answer}</p>
                
                <div className="flex justify-end gap-3 pt-2 border-t border-gray-100" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                  <button
                    onClick={() => startEditEntry(entry)}
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-800 transition-colors"
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
                    style={{ fontSize: '12px', fontWeight: 600 }}
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
          {entries.length === 0 && (
            <p className="text-center text-gray-400 py-6" style={{ fontSize: '13px' }}>No entries logged yet. Write one today! 💕</p>
          )}
          {entries.length > 0 && (
            <p className="text-center text-gray-400 py-6" style={{ fontSize: '13px' }}>Keep adding entries to grow your story together 💕</p>
          )}
        </div>
      )}

      <div className="h-8" />

      {/* Answer modal */}
      {activePrompt && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full bg-white rounded-t-3xl p-6" style={{ maxWidth: '430px' }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-1 rounded-full bg-gray-200 mx-auto" />
              <button onClick={() => { setActivePrompt(null); setEditingEntryId(null); }} className="ml-auto">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div
              className="rounded-xl px-3 py-1.5 mb-4 inline-block"
              style={{ background: (categoryMeta[activePrompt.category] || categoryMeta.warmth).color }}
            >
              <span style={{ color: (categoryMeta[activePrompt.category] || categoryMeta.warmth).accent, fontSize: '12px', fontWeight: 700 }}>
                {(categoryMeta[activePrompt.category] || categoryMeta.warmth).emoji} {(categoryMeta[activePrompt.category] || categoryMeta.warmth).label}
              </span>
            </div>

            <p className="text-gray-800 mb-4" style={{ fontSize: '16px', fontWeight: 600, lineHeight: '1.5' }}>
              {activePrompt.text}
            </p>

            <textarea
              value={answers[activePrompt.id] || ''}
              onChange={e => setAnswers(prev => ({ ...prev, [activePrompt.id]: e.target.value }))}
              placeholder="Write your reflection..."
              rows={5}
              className="w-full rounded-2xl p-4 border outline-none resize-none"
              style={{ fontSize: '14px', lineHeight: '1.6', borderColor: '#f0e4f4' }}
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setActivePrompt(null); setEditingEntryId(null); }}
                className="flex-1 py-3 rounded-xl border"
                style={{ fontSize: '14px', color: '#6b7280', borderColor: '#e5e7eb' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveAnswer(activePrompt.id)}
                className="flex-1 py-3 rounded-xl text-white"
                style={{
                  background: answers[activePrompt.id]?.trim()
                    ? `linear-gradient(135deg, ${(categoryMeta[activePrompt.category] || categoryMeta.warmth).accent}, #ec4899)`
                    : '#e5e7eb',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: answers[activePrompt.id]?.trim() ? '#fff' : '#9ca3af',
                }}
                disabled={!answers[activePrompt.id]?.trim()}
              >
                Save Entry ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
