import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Video, FileText, Search, Clock, TrendingUp, X, Play, Download, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const articles = [
  {
    id: 1,
    title: '10 Communication Mistakes Couples Make',
    category: 'Communication',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600',
    excerpt: 'Learn the most common communication pitfalls and how to avoid them.',
    popular: true,
    content: `Good communication is the bedrock of any healthy relationship — yet it's also one of the first things to deteriorate under stress.\n\n**1. Bringing up the past.** Relitigating old arguments distracts from the current issue. Stick to the present moment.\n\n**2. Using absolute language.** "You always…" or "You never…" immediately puts your partner on the defensive. Try "I noticed that recently…" instead.\n\n**3. Multitasking during conversations.** Phones, TV, and laptops signal that the conversation isn't important.\n\n**4. Assuming you know what your partner means.** Ask clarifying questions rather than filling in the blanks.\n\n**5. Criticising the person, not the behaviour.** "You're so lazy" attacks identity. "I feel overwhelmed when chores pile up" addresses the issue.\n\n**6. Stonewalling.** Shutting down emotionally during conflict makes the other person feel abandoned.\n\n**7. Dismissing feelings.** "You shouldn't feel that way" invalidates your partner's experience.\n\n**8. Winning instead of resolving.** The goal is mutual understanding, not victory.`,
  },
  {
    id: 2,
    title: 'Rebuilding Trust After Betrayal',
    category: 'Trust',
    readTime: '12 min',
    image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600',
    excerpt: 'A step-by-step guide to healing and rebuilding trust in your relationship.',
    popular: true,
    content: `Trust, once broken, can feel impossible to rebuild. But research shows that couples who commit to the process genuinely can — and often emerge stronger.\n\n**Step 1: Full acknowledgement.** The partner who caused the breach must fully own it — no minimising, no deflecting.\n\n**Step 2: Radical transparency.** For a defined period, share calendars, locations, and passwords — not as punishment, but as a visible commitment to openness.\n\n**Step 3: Consistent follow-through.** Small, kept promises rebuild trust faster than grand gestures.\n\n**Step 4: The injured partner's role.** Healing is not passive. It requires choosing, again and again, to remain open.\n\n**Step 5: Professional support.** A therapist provides a neutral space where both partners can speak freely.\n\n**Step 6: Patience with the timeline.** Research suggests full trust restoration often takes 2–4 years.`,
  },
  {
    id: 3,
    title: 'Understanding Love Languages',
    category: 'Intimacy',
    readTime: '10 min',
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600',
    excerpt: 'Discover how you and your partner express and receive love differently.',
    popular: false,
    content: `Dr. Gary Chapman's Five Love Languages framework has helped millions of couples decode mismatched expressions of love.\n\n**Words of Affirmation.** Verbal compliments, "I love you"s, encouragement. For this person, words carry enormous weight.\n\n**Quality Time.** Undivided attention — no phones, no distractions.\n\n**Receiving Gifts.** The gift is a visual symbol of "I thought of you." The thought matters more than the price.\n\n**Acts of Service.** Cooking, fixing things, taking tasks off your partner's plate.\n\n**Physical Touch.** Holding hands, hugs — not just sexual intimacy, but physical presence as reassurance.\n\n**How to use this:** Both partners take the quiz, share their top language, and commit to speaking each other's language for 30 days.`,
  },
  {
    id: 4,
    title: 'Managing Financial Stress as a Couple',
    category: 'Finances',
    readTime: '15 min',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600',
    excerpt: 'Practical strategies for handling money discussions without conflict.',
    popular: false,
    content: `Money is consistently cited as one of the top causes of relationship conflict — but it's one of the most avoidable.\n\n**1. Schedule a monthly money meeting.** Calm, structured, focused — no accusations, just numbers and planning.\n\n**2. Discover your money scripts.** Each partner has deep-seated beliefs about money from childhood.\n\n**3. Create shared financial goals.** A house deposit, a trip, an emergency fund — shared goals align motivation.\n\n**4. Decide on your system.** Full merge, full separate, or "yours/mine/ours" — there's no right answer, but there must be an agreed answer.\n\n**5. Never surprise each other with big purchases.** Define a spending threshold above which you consult first.`,
  },
  {
    id: 5,
    title: 'Long Distance Relationship Survival Guide',
    category: 'Long Distance',
    readTime: '11 min',
    image: 'https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=600',
    excerpt: 'Tips and tools for maintaining intimacy across the miles.',
    popular: true,
    content: `Long-distance relationships (LDRs) are increasingly common — and research shows LDR couples often report higher levels of communication quality.\n\n**1. Have an end date.** Open-ended LDRs are significantly harder to sustain.\n\n**2. Establish communication rituals.** A good-morning voice note, an evening video call — rituals create security.\n\n**3. Share experiences asynchronously.** Watch the same show and text your reactions. Cook the same meal on FaceTime.\n\n**4. Plan visits with intentionality.** Have a mix of fun activities and genuine downtime.\n\n**5. Send physical tokens.** A handwritten letter or a small unexpected package creates physical presence across distance.`,
  },
  {
    id: 6,
    title: 'Preparing for Marriage: Essential Conversations',
    category: 'Premarital',
    readTime: '14 min',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600',
    excerpt: 'Important topics every couple should discuss before saying "I do".',
    popular: false,
    content: `Premarital counselling reduces the divorce rate by up to 30%. Here are the conversations that matter most.\n\n**1. Children: yes, no, how many, when?** And if infertility arises — what then?\n\n**2. Finances.** Existing debt, spending habits, financial goals, who manages what.\n\n**3. Careers.** Whose career takes priority in a relocation scenario?\n\n**4. In-laws and family.** How much involvement do you expect?\n\n**5. Division of labour.** Who does what at home — and how will this shift through major life changes?\n\n**6. Conflict styles.** How did each of your families handle disagreements?\n\n**7. Faith and values.** Even if you share a faith, discuss the role it will play in family life.`,
  },
];

const videos = [
  {
    id: 1, title: 'The Gottman Method: How to Argue Better', duration: '18:32', category: 'Conflict',
    thumbnail: 'https://images.unsplash.com/photo-1536329583941-14287ec6fc4e?w=600',
    videoUrl: 'https://www.youtube.com/embed/sDJOjQ7XHCY',
    description: 'Dr. John Gottman explains the science of conflict and the "Four Horsemen" that predict relationship failure — and their antidotes.',
  },
  {
    id: 2, title: 'Building Emotional Intimacy: A Workshop', duration: '24:15', category: 'Intimacy',
    thumbnail: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600',
    videoUrl: 'https://www.youtube.com/embed/Sa31h5KOV5w',
    description: 'A guided workshop on opening up emotional channels and building deeper connection with your partner.',
  },
  {
    id: 3, title: 'Active Listening Techniques for Couples', duration: '12:45', category: 'Communication',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600',
    videoUrl: 'https://www.youtube.com/embed/MkJAJBq8jOI',
    description: 'Practical exercises to develop genuine listening skills — the foundation of every healthy relationship.',
  },
  {
    id: 4, title: 'Understanding Attachment Styles', duration: '21:08', category: 'Psychology',
    thumbnail: 'https://images.unsplash.com/photo-1501386761578-eaa54b5a43be?w=600',
    videoUrl: 'https://www.youtube.com/embed/2s9ACDMcpjA',
    description: 'Secure, anxious, avoidant — discover your attachment style and how it shapes every relationship.',
  },
  {
    id: 5, title: 'Healing After Infidelity', duration: '31:22', category: 'Trust',
    thumbnail: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600',
    videoUrl: 'https://www.youtube.com/embed/P3fIZuW9P5c',
    description: 'A compassionate, research-backed guide for couples navigating the painful process of healing from betrayal.',
  },
  {
    id: 6, title: 'Sex & Intimacy After Having Kids', duration: '16:50', category: 'Intimacy',
    thumbnail: 'https://images.unsplash.com/photo-1543342384-1f1350e27861?w=600',
    videoUrl: 'https://www.youtube.com/embed/KGnGLa_M0bM',
    description: 'How parenthood changes intimacy — and practical ways to reconnect as partners, not just co-parents.',
  },
];



const worksheets = [
  { id: 1, title: 'Daily Communication Template', category: 'Communication', description: 'Structured prompts for meaningful daily conversations', pages: 4, preview: 'A fill-in template with morning check-in questions, evening reflection prompts, and a weekly gratitude section.' },
  { id: 2, title: 'Conflict Resolution Worksheet', category: 'Conflict', description: 'Step-by-step guide through disagreements', pages: 6, preview: 'Walk through each conflict with sections for "What happened", "How I felt", "What I need", and "What we can try differently".' },
  { id: 3, title: 'Love Languages Assessment', category: 'Intimacy', description: 'Discover your primary and secondary love languages', pages: 8, preview: '30-question assessment with scoring key, interpretation guide, and practical exercises.' },
  { id: 4, title: 'Financial Planning Workbook', category: 'Finances', description: 'Tools for creating shared financial goals', pages: 12, preview: 'Budget tracker, debt overview, shared goals planner, and a guide to productive money conversations.' },
  { id: 5, title: 'Relationship Vision Board Prompts', category: 'Goals', description: 'Map your shared future in 1, 5, and 10 year horizons', pages: 5, preview: 'Guided questions to articulate your ideal relationship, lifestyle, family, and personal growth goals together.' },
  { id: 6, title: 'Trust Rebuilding Journal', category: 'Trust', description: 'A 30-day guided journal for healing after betrayal', pages: 35, preview: 'Daily reflection prompts for both partners, with separate tracks for the injured and the accountable partner.' },
];

const worksheetForms: Record<number, {
  questions: { id: string; type: 'text' | 'select' | 'scale'; label: string; options?: string[] }[]
}> = {
  1: {
    questions: [
      { id: 'morning_focus', type: 'text', label: "Morning check-in: What is your primary focus or goal for today?" },
      { id: 'gratitude', type: 'text', label: "Gratitude: What is one thing you genuinely appreciate about your partner today?" },
      { id: 'evening_reflection', type: 'text', label: "Evening reflection: How did you feel about our connection today?" }
    ]
  },
  2: {
    questions: [
      { id: 'trigger', type: 'text', label: "Describe what happened (objective facts about the disagreement):" },
      { id: 'feelings', type: 'text', label: "How did you feel? (Use 'I feel...' statements rather than blaming):" },
      { id: 'need', type: 'text', label: "What do you need from your partner to feel resolved and safe?" },
      { id: 'compromise', type: 'text', label: "What is a small compromise or action we can try differently next time?" }
    ]
  },
  3: {
    questions: [
      { id: 'q1', type: 'select', label: "I feel most loved when my partner...", options: ["Says sweet compliments or words of appreciation (Affirmation)", "Gives me a warm hug or holds my hand (Touch)", "Helps with household chores or tasks (Service)", "Spends phone-free quality time with me (Quality Time)", "Surprises me with a small thoughtful gift (Gifts)"] },
      { id: 'q2', type: 'select', label: "When I'm stressed, I prefer that my partner...", options: ["Encourages me verbally and tells me they believe in me (Affirmation)", "Just holds me tight without saying much (Touch)", "Handles dinner or chores so I can relax (Service)", "Sits with me and listens to me process (Quality Time)", "Brings me my favorite snack or drink (Gifts)"] },
      { id: 'q3', type: 'select', label: "On our anniversary, the best thing my partner can do is...", options: ["Write me a long, heartfelt love letter (Affirmation)", "Spend the night cuddling and being physically close (Touch)", "Plan the entire day's logistics and surprise me (Service)", "Book a phone-free weekend getaway together (Quality Time)", "Give me a custom item I've wanted for a long time (Gifts)"] }
    ]
  },
  4: {
    questions: [
      { id: 'monthly_income', type: 'text', label: "What is our combined monthly income?" },
      { id: 'savings_goal', type: 'text', label: "What is our target monthly savings goal?" },
      { id: 'finance_tensions', type: 'text', label: "What is the biggest source of financial stress in our relationship?" },
      { id: 'agreed_rule', type: 'text', label: "Our agreed spending threshold (e.g. consult before spending >$200):" }
    ]
  },
  5: {
    questions: [
      { id: 'year_1', type: 'text', label: "Where do we want our relationship to be in 1 year?" },
      { id: 'year_5', type: 'text', label: "Where do we want our relationship to be in 5 years?" },
      { id: 'lifestyle_goals', type: 'text', label: "What are our shared lifestyle, home, or family goals?" }
    ]
  },
  6: {
    questions: [
      { id: 'injured_safety', type: 'text', label: "For the injured partner: What did your partner do today that helped rebuild trust?" },
      { id: 'accountable_transparency', type: 'text', label: "For the accountable partner: What action did you take today to practice transparency?" },
      { id: 'rebuilding_commitment', type: 'scale', label: "On a scale of 1-10, how aligned do we feel in our trust recovery today?" }
    ]
  }
};



function downloadWorksheet(worksheet: typeof worksheets[0]) {
  const stored = localStorage.getItem('tm_completed_worksheets');
  let userAnswers: Record<string, string> = {};
  if (stored) {
    const list = JSON.parse(stored);
    const saved = list.find((w: any) => w.worksheetId === worksheet.id);
    if (saved) {
      userAnswers = saved.answers;
    }
  }

  const contentLines = [
    `BOND WORKSHEET: ${worksheet.title}`,
    `Category: ${worksheet.category}`,
    `Pages: ${worksheet.pages} · Generated from Bond app`,
    '='.repeat(40),
    '',
    `Description: ${worksheet.description}`,
    '',
    '--- QUESTIONS & RESPONSES ---',
    ''
  ];

  const questions = worksheetForms[worksheet.id]?.questions || [];
  if (questions.length > 0) {
    questions.forEach((q, i) => {
      const answer = userAnswers[q.id] || '(No response saved yet)';
      contentLines.push(`${i + 1}. ${q.label}`);
      contentLines.push(`   Response: ${answer}`);
      contentLines.push('');
    });
  } else {
    contentLines.push(worksheet.preview);
  }

  const content = contentLines.join('\n');
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${worksheet.title.toLowerCase().replace(/\s+/g, '-')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

type Article = typeof articles[0];
type Video = typeof videos[0];

export default function ResourcesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'articles' | 'videos' | 'worksheets'>('articles');
  const [search, setSearch] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  const [previewWorksheet, setPreviewWorksheet] = useState<typeof worksheets[0] | null>(null);
  const [worksheetAnswers, setWorksheetAnswers] = useState<Record<string, string>>({});

  // Load previous responses when worksheet opens
  useEffect(() => {
    if (previewWorksheet) {
      const stored = localStorage.getItem('tm_completed_worksheets');
      if (stored) {
        const list = JSON.parse(stored);
        const saved = list.find((w: any) => w.worksheetId === previewWorksheet.id);
        if (saved) {
          setWorksheetAnswers(saved.answers);
          return;
        }
      }
      setWorksheetAnswers({});
    }
  }, [previewWorksheet]);

  const handleWorksheetInputChange = (qId: string, value: string) => {
    setWorksheetAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSaveWorksheet = () => {
    if (!previewWorksheet) return;
    const stored = localStorage.getItem('tm_completed_worksheets');
    let list = stored ? JSON.parse(stored) : [];
    
    list = list.filter((w: any) => w.worksheetId !== previewWorksheet.id);
    
    const entry = {
      worksheetId: previewWorksheet.id,
      title: previewWorksheet.title,
      category: previewWorksheet.category,
      answers: worksheetAnswers,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    list.unshift(entry);
    localStorage.setItem('tm_completed_worksheets', JSON.stringify(list));
    
    toast.success('Worksheet saved! 📝', {
      description: 'Your answers have been stored locally.'
    });
    setPreviewWorksheet(null);
  };

  const q = search.toLowerCase();
  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
  const filteredVideos = videos.filter(v => v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q));

  const tabs = [
    { key: 'articles', icon: BookOpen, label: 'Articles' },
    { key: 'videos', icon: Video, label: 'Videos' },
    { key: 'worksheets', icon: FileText, label: 'Worksheets' },
  ] as const;

  return (
    <div className="min-h-screen bg-white">
      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={() => setSelectedArticle(null)}>
          <div
            className="bg-white w-full overflow-y-auto"
            style={{ maxWidth: '430px', maxHeight: '92vh', borderRadius: '24px 24px 0 0' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="relative">
              <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-48 object-cover" style={{ borderRadius: '24px 24px 0 0' }} />
              <button onClick={() => setSelectedArticle(null)} className="absolute top-4 right-4 rounded-full p-1.5 bg-white shadow">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full" style={{ background: '#fce7f3', color: '#f43f5e', fontSize: '11px', fontWeight: 600 }}>
                  {selectedArticle.category}
                </span>
                <span className="flex items-center gap-1 text-gray-400" style={{ fontSize: '11px' }}>
                  <Clock className="h-3 w-3" />{selectedArticle.readTime}
                </span>
              </div>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', marginBottom: '16px' }}>{selectedArticle.title}</p>
              <div className="space-y-2">
                {selectedArticle.content.split('\n').map((line, i) => {
                  if (!line.trim()) return <div key={i} className="h-1" />;
                  const bold = line.match(/^\*\*(.+)\*\*(.*)$/);
                  if (bold) return (
                    <p key={i} style={{ fontSize: '14px', color: '#1f2937', lineHeight: '1.6' }}>
                      <strong>{bold[1]}</strong>{bold[2]}
                    </p>
                  );
                  return <p key={i} style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>{line}</p>;
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
          <div className="bg-gray-900 rounded-2xl w-full shadow-2xl overflow-hidden" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
              <div>
                <p className="text-white font-medium" style={{ fontSize: '13px' }}>{selectedVideo.title}</p>
                <p className="text-gray-400" style={{ fontSize: '11px' }}>{selectedVideo.category} · {selectedVideo.duration}</p>
              </div>
              <button onClick={() => setSelectedVideo(null)} className="text-gray-400"><X className="h-5 w-5" /></button>
            </div>
            <div className="relative" style={{ aspectRatio: '16/9' }}>
              <img src={selectedVideo.thumbnail} alt="" className="w-full h-full object-cover opacity-50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-5 text-center">
                  <div className="bg-red-600 rounded-full p-3 w-14 h-14 flex items-center justify-center mx-auto mb-3">
                    <Play className="h-7 w-7 text-white fill-white ml-0.5" />
                  </div>
                  <p className="text-white/80 text-xs mb-3">Watch on YouTube</p>
                  <a
                    href={selectedVideo.videoUrl.replace('/embed/', '/watch?v=')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-xs font-medium"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Open YouTube
                  </a>
                </div>
              </div>
            </div>
            <p className="px-4 py-3 text-gray-400" style={{ fontSize: '12px' }}>{selectedVideo.description}</p>
          </div>
        </div>
      )}

      {/* Interactive Worksheet Modal */}
      {previewWorksheet && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center overflow-y-auto" onClick={() => setPreviewWorksheet(null)}>
          <div
            className="bg-white w-full p-6 max-h-[92vh] overflow-y-auto text-left"
            style={{ maxWidth: '430px', borderRadius: '24px 24px 0 0' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
            <div className="flex items-start justify-between mb-3">
              <div className="p-3 rounded-2xl" style={{ background: '#fce7f3' }}>
                <FileText className="h-6 w-6" style={{ color: '#f43f5e' }} />
              </div>
              <button onClick={() => setPreviewWorksheet(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <span className="px-2.5 py-0.5 rounded-full" style={{ background: '#fce7f3', color: '#f43f5e', fontSize: '11px', fontWeight: 600 }}>
              {previewWorksheet.category}
            </span>
            <p style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937', marginTop: '8px', marginBottom: '4px' }}>{previewWorksheet.title}</p>
            <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px' }}>Interactive bond worksheet</p>

            {/* Render form questions */}
            <div className="space-y-4 mb-6">
              {worksheetForms[previewWorksheet.id]?.questions.map((q) => (
                <div key={q.id} className="space-y-1.5">
                  <label className="text-gray-700 block font-semibold" style={{ fontSize: '13px' }}>{q.label}</label>
                  {q.type === 'text' && (
                    <textarea
                      value={worksheetAnswers[q.id] || ''}
                      onChange={e => handleWorksheetInputChange(q.id, e.target.value)}
                      placeholder="Type your response here..."
                      rows={3}
                      className="w-full border rounded-xl p-3 outline-none focus:border-rose-400 transition-colors"
                      style={{ fontSize: '13px', borderColor: '#e5e7eb' }}
                    />
                  )}
                  {q.type === 'select' && (
                    <select
                      value={worksheetAnswers[q.id] || ''}
                      onChange={e => handleWorksheetInputChange(q.id, e.target.value)}
                      className="w-full border rounded-xl p-3 outline-none focus:border-rose-400 bg-white"
                      style={{ fontSize: '13px', borderColor: '#e5e7eb' }}
                    >
                      <option value="">-- Choose an option --</option>
                      {q.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                  {q.type === 'scale' && (
                    <div className="flex gap-1.5 justify-between py-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => handleWorksheetInputChange(q.id, String(val))}
                          className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold transition-all"
                          style={{
                            background: worksheetAnswers[q.id] === String(val) ? '#f43f5e' : '#fff',
                            borderColor: worksheetAnswers[q.id] === String(val) ? '#f43f5e' : '#e5e7eb',
                            color: worksheetAnswers[q.id] === String(val) ? '#fff' : '#4b5563',
                          }}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-xl border text-gray-500 font-semibold"
                style={{ fontSize: '13px', borderColor: '#e5e7eb' }}
                onClick={() => setPreviewWorksheet(null)}
              >
                Close
              </button>
              <button
                className="flex-1 py-3 rounded-xl text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)', fontSize: '13px' }}
                onClick={handleSaveWorksheet}
              >
                Save & Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className="relative px-5 pt-14 pb-6"
        style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 55%, #a855f7 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="flex items-center gap-3 relative mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div>
            <h1 className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>Resource Library</h1>
            <p className="text-white/75" style={{ fontSize: '12px' }}>Expert-curated content for couples</p>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#9ca3af' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles, videos, worksheets…"
            className="w-full rounded-2xl pl-10 pr-4 py-3 outline-none"
            style={{ fontSize: '14px', background: 'rgba(255,255,255,0.95)', color: '#1f2937' }}
          />
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b" style={{ borderColor: '#f3f4f6' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex-1 flex flex-col items-center py-3 gap-1 transition-colors"
            style={{ color: tab === t.key ? '#f43f5e' : '#9ca3af' }}
          >
            <t.icon className="h-4 w-4" />
            <span style={{ fontSize: '10px', fontWeight: tab === t.key ? 600 : 400 }}>{t.label}</span>
            {tab === t.key && <div className="w-5 h-0.5 rounded-full" style={{ background: '#f43f5e' }} />}
          </button>
        ))}
      </div>

      <div className="px-5 py-4 pb-6 space-y-3">
        {/* Articles */}
        {tab === 'articles' && filteredArticles.map(article => (
          <button
            key={article.id}
            onClick={() => setSelectedArticle(article)}
            className="w-full rounded-2xl overflow-hidden text-left active:scale-98 transition-transform"
            style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}
          >
            <img src={article.image} alt={article.title} className="w-full h-36 object-cover" />
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {article.popular && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: '#f43f5e', color: '#fff', fontSize: '10px', fontWeight: 600 }}>
                    <TrendingUp className="h-3 w-3" /> Popular
                  </span>
                )}
                <span className="px-2 py-0.5 rounded-full" style={{ background: '#fce7f3', color: '#f43f5e', fontSize: '10px', fontWeight: 600 }}>{article.category}</span>
                <span className="flex items-center gap-1 text-gray-400" style={{ fontSize: '11px' }}>
                  <Clock className="h-3 w-3" />{article.readTime}
                </span>
              </div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', lineHeight: '1.4' }}>{article.title}</p>
              <p className="text-gray-500 mt-1" style={{ fontSize: '12px', lineHeight: '1.5' }}>{article.excerpt}</p>
            </div>
          </button>
        ))}

        {/* Videos */}
        {tab === 'videos' && filteredVideos.map(video => (
          <button
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="w-full rounded-2xl overflow-hidden text-left active:scale-98 transition-transform"
            style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}
          >
            <div className="relative">
              <img src={video.thumbnail} alt={video.title} className="w-full h-44 object-cover" />
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div className="bg-white rounded-full p-3 shadow-lg">
                  <Play className="h-6 w-6 fill-rose-500 text-rose-500" />
                </div>
              </div>
              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '11px' }}>
                {video.duration}
              </span>
            </div>
            <div className="p-4">
              <span className="px-2 py-0.5 rounded-full" style={{ background: '#fce7f3', color: '#f43f5e', fontSize: '10px', fontWeight: 600 }}>{video.category}</span>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', marginTop: '6px', lineHeight: '1.4' }}>{video.title}</p>
              <p className="text-gray-400 mt-1" style={{ fontSize: '12px', lineHeight: '1.5' }}>{video.description}</p>
            </div>
          </button>
        ))}



        {/* Worksheets */}
        {tab === 'worksheets' && worksheets.map(ws => (
          <div
            key={ws.id}
            className="rounded-2xl p-4 text-left"
            style={{ background: '#f9fafb', border: '1px solid #f3f4f6' }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="p-3 rounded-2xl shrink-0" style={{ background: '#fce7f3' }}>
                <FileText className="h-5 w-5" style={{ color: '#f43f5e' }} />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded-full" style={{ background: '#fce7f3', color: '#f43f5e', fontSize: '10px', fontWeight: 600 }}>{ws.category}</span>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937', marginTop: '4px' }}>{ws.title}</p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>{ws.description}</p>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{ws.pages} pages · Interactive PDF</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewWorksheet(ws)}
                className="flex-1 py-2.5 rounded-xl border"
                style={{ fontSize: '12px', color: '#f43f5e', borderColor: '#fda4af', fontWeight: 600 }}
              >
                Fill & Save
              </button>
              <button
                onClick={() => downloadWorksheet(ws)}
                className="flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-white"
                style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)', fontSize: '12px', fontWeight: 600 }}
              >
                <Download className="h-3.5 w-3.5" /> Export PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
