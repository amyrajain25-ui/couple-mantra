import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../shared/Header';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { Brain, Heart, MessageCircle, Shield, Zap, Star } from 'lucide-react';

const questions = [
  {
    id: 1,
    category: 'background',
    question: 'How long have you been in your relationship?',
    options: ['Less than 1 year', '1–3 years', '3–5 years', '5–10 years', 'More than 10 years'],
  },
  {
    id: 2,
    category: 'background',
    question: 'Are you currently living together?',
    options: ['Yes, and it works well', 'Yes, but we have tensions', 'No, but planning to', 'No, and not planning to', 'Long-distance relationship'],
  },
  {
    id: 3,
    category: 'communication',
    question: 'How often do you and your partner have meaningful conversations?',
    options: ['Daily', 'A few times a week', 'Once a week', 'Rarely', 'Almost never'],
  },
  {
    id: 4,
    category: 'communication',
    question: 'When your partner shares a problem, you typically:',
    options: ['Listen fully before responding', 'Try to solve it immediately', 'Share your own similar experience', 'Get defensive', 'Dismiss or minimize it'],
  },
  {
    id: 5,
    category: 'communication',
    question: 'How comfortable are you discussing your deepest fears with your partner?',
    options: ['Very comfortable', 'Somewhat comfortable', 'Neutral', 'Somewhat uncomfortable', 'Very uncomfortable'],
  },
  {
    id: 6,
    category: 'conflict',
    question: 'How do you typically handle conflicts?',
    options: ['Talk it through calmly', 'Need time to cool down first', 'Avoid the topic entirely', 'Arguments tend to escalate', 'Silent treatment'],
  },
  {
    id: 7,
    category: 'conflict',
    question: 'After a disagreement, how long does it usually take to reconcile?',
    options: ['Within hours', '1–2 days', 'A few days', 'Over a week', 'We rarely fully reconcile'],
  },
  {
    id: 8,
    category: 'conflict',
    question: 'Do you feel heard and understood during arguments?',
    options: ['Always', 'Usually', 'Sometimes', 'Rarely', 'Never'],
  },
  {
    id: 9,
    category: 'trust',
    question: 'How would you rate the level of trust in your relationship?',
    options: ['Completely trusting', 'Mostly trusting', 'Some concerns', 'Significant trust issues', 'Broken trust'],
  },
  {
    id: 10,
    category: 'trust',
    question: 'Do you feel emotionally safe being vulnerable with your partner?',
    options: ['Absolutely yes', 'Usually yes', 'Depends on the situation', 'Often no', 'Never'],
  },
  {
    id: 11,
    category: 'intimacy',
    question: 'How satisfied are you with emotional intimacy in your relationship?',
    options: ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'],
  },
  {
    id: 12,
    category: 'intimacy',
    question: 'How often do you express affection (physical or verbal) to each other?',
    options: ['Multiple times daily', 'Once a day', 'A few times a week', 'Rarely', 'Almost never'],
  },
  {
    id: 13,
    category: 'goals',
    question: 'Do you and your partner share compatible life goals?',
    options: ['Very aligned', 'Mostly aligned', 'Some differences', 'Many differences', 'Fundamentally different'],
  },
  {
    id: 14,
    category: 'goals',
    question: 'What is your primary goal for seeking help?',
    options: ['Better communication', 'Rebuild trust', 'Manage conflicts better', 'Deepen intimacy', 'Prepare for marriage/next step'],
  },
  {
    id: 15,
    category: 'wellbeing',
    question: 'How does your relationship affect your overall wellbeing?',
    options: ['Very positively', 'Mostly positively', 'Mixed feelings', 'Mostly negatively', 'Very negatively'],
  },
  {
    id: 16,
    category: 'wellbeing',
    question: 'Do you feel your partner supports your personal growth?',
    options: ['Strongly supports', 'Generally supports', 'Neutral/indifferent', 'Sometimes undermines', 'Often undermines'],
  },
  {
    id: 17,
    category: 'commitment',
    question: 'How committed do you feel to making this relationship work?',
    options: ['Extremely committed', 'Very committed', 'Somewhat committed', 'Uncertain', 'Considering separation'],
  },
  {
    id: 18,
    category: 'commitment',
    question: 'Have you previously sought couples therapy or counseling?',
    options: ['No, this is our first time', 'Yes, briefly', 'Yes, extensively', 'One partner has individually', 'We tried but stopped early'],
  },
];

function scoreAnswer(answer: string, category: string): number {
  const positiveAnswers = [
    'Daily', 'Listen fully before responding', 'Very comfortable', 'Talk it through calmly',
    'Within hours', 'Always', 'Completely trusting', 'Absolutely yes', 'Very satisfied',
    'Multiple times daily', 'Very aligned', 'Very positively', 'Strongly supports',
    'Extremely committed', 'Yes, extensively', '1–3 years', '3–5 years', '5–10 years',
    'Yes, and it works well', 'Better communication', 'Prepare for marriage/next step',
    'A few times daily', 'Once a day', 'Mostly trusting', 'Usually yes', 'Usually',
    'Satisfied', 'Mostly positively', 'Generally supports', 'Very committed',
    'A few times a week', '1–2 days', 'Mostly aligned',
  ];
  const negativeAnswers = [
    'Never', 'Almost never', 'Very uncomfortable', 'Silent treatment', 'We rarely fully reconcile',
    'Broken trust', 'Very dissatisfied', 'Fundamentally different', 'Very negatively',
    'Often undermines', 'Considering separation', 'Dismiss or minimize it',
  ];

  if (positiveAnswers.includes(answer)) return 85 + Math.random() * 10;
  if (negativeAnswers.includes(answer)) return 20 + Math.random() * 20;
  return 50 + Math.random() * 25;
}

function calculateScores(answers: Record<number, string>) {
  const categoryMap: Record<string, number[]> = {
    communication: [2, 3, 4],
    conflict: [5, 6, 7],
    trust: [8, 9],
    intimacy: [10, 11],
    goals: [12, 13],
    wellbeing: [14, 15, 16],
  };

  return [
    { category: 'Communication', score: 0, qIds: [2, 3, 4] },
    { category: 'Conflict Resolution', score: 0, qIds: [5, 6, 7] },
    { category: 'Trust', score: 0, qIds: [8, 9] },
    { category: 'Intimacy', score: 0, qIds: [10, 11] },
    { category: 'Shared Goals', score: 0, qIds: [12, 13] },
    { category: 'Emotional Wellbeing', score: 0, qIds: [14, 15, 16] },
  ].map(({ category, qIds }) => {
    const categoryAnswers = qIds.map(i => answers[i - 1]).filter(Boolean);
    const avg = categoryAnswers.length
      ? Math.round(categoryAnswers.reduce((s, a) => s + scoreAnswer(a, category), 0) / categoryAnswers.length)
      : 60;
    return { category, score: Math.min(99, Math.max(20, avg)) };
  });
}

function generateAIInsights(scores: { category: string; score: number }[], answers: Record<number, string>) {
  const avg = Math.round(scores.reduce((s, i) => s + i.score, 0) / scores.length);
  const weakest = [...scores].sort((a, b) => a.score - b.score).slice(0, 2);
  const strongest = [...scores].sort((a, b) => b.score - a.score)[0];

  const conflictStyle = answers[5] || '';
  const primaryGoal = answers[13] || '';

  const adviceByArea: Record<string, string[]> = {
    Communication: [
      'Practice the "speaker-listener" technique: one partner holds an object while speaking; the other listens without interrupting.',
      'Schedule a 15-minute daily "connection chat" free from phones and distractions.',
      'Use "I feel..." statements to express emotions without triggering defensiveness.',
    ],
    'Conflict Resolution': [
      'Before any difficult conversation, agree on a "safe word" that signals you both need a 20-minute cooling-off period.',
      'After a conflict, write down what each of you felt and needs — then swap notes instead of arguing in the moment.',
      'Use the Gottman "Four Horsemen" checklist to identify and replace criticism, contempt, defensiveness, and stonewalling.',
    ],
    Trust: [
      'Rebuild trust through consistent, small daily actions — punctuality, follow-through on promises, transparency.',
      'Consider a joint journaling practice where you both write one honest thought about your day and share it.',
      'Explore what "feeling safe" means to each partner — the definitions are often very different.',
    ],
    Intimacy: [
      "Identify each other's love language (words of affirmation, quality time, physical touch, acts of service, gifts) and consciously speak it.",
      'Create a weekly "date ritual" — even 30 minutes of undivided attention strengthens emotional bonds significantly.',
      'Share three genuine appreciations with your partner every evening before bed.',
    ],
    'Shared Goals': [
      'Create a joint "relationship vision board" — map out 1-year, 5-year, and 10-year aspirations together.',
      'Hold a quarterly "relationship review" — a calm conversation about what\'s working and what needs adjusting.',
      'Focus on values alignment more than agreement on specifics — couples can differ on details but still share core values.',
    ],
    'Emotional Wellbeing': [
      'Practice the HALT check — when tensions rise, ask if either of you is Hungry, Angry, Lonely, or Tired.',
      "Support each other's individual hobbies and friendships — personal fulfilment reduces codependency.",
      'Consider individual therapy alongside couples counseling for deeper personal growth.',
    ],
  };

  const tips: string[] = [];
  weakest.forEach(area => {
    const areaAdvice = adviceByArea[area.category] || [];
    tips.push(...areaAdvice.slice(0, 2));
  });

  let overallMessage = '';
  if (avg >= 75) {
    overallMessage = `Your relationship shows genuine strength — an overall health score of ${avg}% reflects real investment and care from both partners. The work you've already done is paying off. The next chapter is about deepening what's already good.`;
  } else if (avg >= 55) {
    overallMessage = `Your relationship score of ${avg}% shows a foundation worth building on. Like any living thing, relationships need consistent nurturing. The challenges you're facing are very common — and very solvable with the right tools and support.`;
  } else {
    overallMessage = `A score of ${avg}% signals that your relationship is under significant strain right now — and that takes courage to acknowledge. The fact that you're here means you care enough to seek change. Real transformation is possible, and it often starts with exactly this kind of honest reflection.`;
  }

  return { overallMessage, tips, weakest, strongest, avg };
}export default function AssessmentPage() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (showResults) {
      const scores = calculateScores(answers);
      const { avg } = generateAIInsights(scores, answers);
      
      const stored = localStorage.getItem('tm_completed_assessments');
      let list = stored ? JSON.parse(stored) : [];
      
      const todayLabel = new Date().toLocaleDateString('en-US', { month: 'short' });
      
      const entry = {
        id: Date.now(),
        date: todayLabel,
        fullDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        avg,
        scores
      };
      
      list.push(entry);
      localStorage.setItem('tm_completed_assessments', JSON.stringify(list));
    }
  }, [showResults]);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion]: answer });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (showResults) {
    const scores = calculateScores(answers);
    const { overallMessage, tips, weakest, strongest, avg } = generateAIInsights(scores, answers);

    const scoreColor = avg >= 75 ? 'text-emerald-600' : avg >= 55 ? 'text-amber-500' : 'text-rose-500';

    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
        <Header />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">

          {/* Score overview */}
          <Card className="border-rose-100 shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">Your Relationship Health Report</CardTitle>
              <CardDescription className="text-lg">
                Personalised insights based on your {questions.length}-question assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center">
                <div className={`text-7xl font-bold mb-2 ${scoreColor}`}>{avg}%</div>
                <div className="text-lg text-gray-600">Overall Relationship Health Score</div>
              </div>

              <div className="bg-rose-50 p-6 rounded-xl">
                <h3 className="font-semibold text-lg mb-4 text-center">Radar Assessment</h3>
                <div className="flex justify-center">
                  <ChartContainer
                    config={{ score: { label: 'Score', color: '#c4637a' } }}
                    className="h-[300px] w-full max-w-[420px]"
                  >
                    <RadarChart data={scores}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                      <Radar name="Score" dataKey="score" stroke="#c4637a" fill="#c4637a" fillOpacity={0.55} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </RadarChart>
                  </ChartContainer>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Detailed Breakdown</h3>
                {scores.map((item) => (
                  <div key={item.category}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm font-medium">{item.score}%</span>
                    </div>
                    <Progress value={item.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card className="border-rose-200 shadow-lg bg-gradient-to-br from-rose-50 to-pink-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="bg-rose-500 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">AI Relationship Analysis</CardTitle>
                  <CardDescription>Personalised guidance from your responses</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white rounded-xl p-5 border border-rose-100">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-rose-500 mt-0.5 shrink-0" />
                  <p className="text-gray-700 leading-relaxed">{overallMessage}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-emerald-500" />
                    <span className="font-semibold text-emerald-700">Your Strength</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>{strongest.category}</strong> ({strongest.score}%) — This is where your relationship shines. Keep investing here to use it as a foundation for other areas.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-rose-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-rose-500" />
                    <span className="font-semibold text-rose-600">Focus Area</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    <strong>{weakest[0].category}</strong> ({weakest[0].score}%) — This area needs the most attention right now. Small, consistent changes here will have the biggest impact.
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="h-5 w-5 text-rose-500" />
                  <h4 className="font-semibold text-gray-900">Your Personalised Action Plan</h4>
                </div>
                <div className="space-y-3">
                  {tips.map((tip, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 border border-rose-100 flex gap-3">
                      <div className="bg-rose-100 text-rose-600 rounded-full w-6 h-6 flex items-center justify-center shrink-0 text-xs font-bold">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-700">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-rose-100">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-rose-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Our Recommendation</p>
                    <p className="text-sm text-gray-700">
                      Based on your {weakest[0].category.toLowerCase()} and {weakest[1]?.category.toLowerCase()} scores, we recommend booking a session with a therapist who specialises in these areas. Couples who combine self-guided work with professional support typically see results 3× faster.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate('/therapists')}
              className="bg-rose-500 hover:bg-rose-600 text-white h-12 text-base"
            >
              Find a Therapist
            </Button>
            <Button
              onClick={() => navigate('/ai-coach')}
              variant="outline"
              className="h-12 text-base border-rose-300 text-rose-600 hover:bg-rose-50"
            >
              Chat with AI Coach
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="h-12 text-base border-rose-300 text-rose-600 hover:bg-rose-50"
            >
              View Dashboard
            </Button>
            <Button
              onClick={() => { setShowResults(false); setCurrentQuestion(0); setAnswers({}); }}
              variant="ghost"
              className="h-12 text-base"
            >
              Retake Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    background: 'About Your Relationship',
    communication: 'Communication',
    conflict: 'Conflict Patterns',
    trust: 'Trust & Safety',
    intimacy: 'Intimacy',
    goals: 'Goals & Vision',
    wellbeing: 'Emotional Wellbeing',
    commitment: 'Commitment',
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <Header />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-12">
        <Card className="border-rose-100 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-rose-500 uppercase tracking-wide">
                {categoryLabels[currentQ.category]}
              </span>
              <span className="text-xs text-gray-500">
                {currentQuestion + 1} / {questions.length}
              </span>
            </div>
            <Progress value={progress} className="mb-4 h-2" />
            <CardTitle className="text-2xl">Relationship Assessment</CardTitle>
            <CardDescription>
              Take your time — honest answers lead to the most helpful insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">{currentQ.question}</h3>
              <RadioGroup
                value={answers[currentQuestion] || ''}
                onValueChange={handleAnswer}
              >
                {currentQ.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 mb-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                      answers[currentQuestion] === option
                        ? 'border-rose-400 bg-rose-50'
                        : 'border-gray-200 hover:border-rose-200 hover:bg-rose-50/50'
                    }`}
                    onClick={() => handleAnswer(option)}
                  >
                    <RadioGroupItem value={option} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex gap-4">
              {currentQuestion > 0 && (
                <Button onClick={handlePrevious} variant="outline" className="flex-1 border-rose-200">
                  Previous
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!answers[currentQuestion]}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
              >
                {currentQuestion === questions.length - 1 ? 'See My Results' : 'Next Question'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
