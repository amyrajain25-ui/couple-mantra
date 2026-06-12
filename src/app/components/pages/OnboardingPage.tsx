import { useState } from 'react';
import { Heart, ChevronRight, ArrowLeft } from 'lucide-react';
import { useCouple } from '../contexts/CoupleContext';

type Step = 'welcome' | 'name1' | 'name2' | 'since' | 'done';

export default function OnboardingPage() {
  const { setCouple } = useCouple();
  const [step, setStep] = useState<Step>('welcome');
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [since, setSince] = useState('');

  function finish() {
    setCouple({ partner1: partner1.trim(), partner2: partner2.trim(), since });
  }

  if (step === 'welcome') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: 'linear-gradient(160deg, #fff0f3 0%, #f5f0ff 100%)' }}>
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #f43f5e, #a855f7)' }}
        >
          <Heart className="h-10 w-10 text-white fill-white" />
        </div>
        <h1 className="text-gray-900 mb-2" style={{ fontSize: '28px', fontWeight: 800 }}>
          Welcome to Bond
        </h1>
        <p className="text-gray-500 mb-10" style={{ fontSize: '15px', lineHeight: '1.7', maxWidth: '300px' }}>
          A space for you and your partner to connect, grow, and stay close — every single day.
        </p>
        <button
          onClick={() => setStep('name1')}
          className="w-full max-w-xs py-4 rounded-2xl text-white flex items-center justify-center gap-2 shadow-md"
          style={{ background: 'linear-gradient(135deg, #f43f5e, #a855f7)', fontSize: '15px', fontWeight: 700 }}
        >
          Let's get started <ChevronRight className="h-5 w-5" />
        </button>
        <p className="text-gray-400 mt-4" style={{ fontSize: '12px' }}>Takes 30 seconds · Stored on your device</p>
      </div>
    );
  }

  if (step === 'name1') {
    return (
      <div className="min-h-screen flex flex-col px-6 pt-20 pb-10"
        style={{ background: 'linear-gradient(160deg, #fff0f3 0%, #f5f0ff 100%)' }}>
        <StepDots current={0} />
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-gray-400 mb-2" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Step 1 of 3
          </p>
          <h2 className="text-gray-900 mb-2" style={{ fontSize: '26px', fontWeight: 800, lineHeight: '1.3' }}>
            What's your name?
          </h2>
          <p className="text-gray-400 mb-8" style={{ fontSize: '14px' }}>This is the person setting up the app.</p>
          <input
            autoFocus
            value={partner1}
            onChange={e => setPartner1(e.target.value)}
            placeholder="Your first name"
            className="w-full rounded-2xl px-5 py-4 border-2 outline-none text-gray-900 transition-all"
            style={{
              fontSize: '18px',
              fontWeight: 500,
              borderColor: partner1.trim() ? '#f43f5e' : '#e5e7eb',
              background: '#fff',
            }}
            onKeyDown={e => e.key === 'Enter' && partner1.trim() && setStep('name2')}
          />
        </div>
        <button
          onClick={() => setStep('name2')}
          disabled={!partner1.trim()}
          className="w-full py-4 rounded-2xl text-white"
          style={{
            background: partner1.trim() ? 'linear-gradient(135deg, #f43f5e, #a855f7)' : '#e5e7eb',
            fontSize: '15px',
            fontWeight: 700,
            color: partner1.trim() ? '#fff' : '#9ca3af',
          }}
        >
          Continue →
        </button>
      </div>
    );
  }

  if (step === 'name2') {
    return (
      <div className="min-h-screen flex flex-col px-6 pt-20 pb-10"
        style={{ background: 'linear-gradient(160deg, #fff0f3 0%, #f5f0ff 100%)' }}>
        <StepDots current={1} />
        <div className="flex-1 flex flex-col justify-center">
          <button onClick={() => setStep('name1')} className="flex items-center gap-1 text-gray-400 mb-8" style={{ fontSize: '13px' }}>
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <p className="text-gray-400 mb-2" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Step 2 of 3
          </p>
          <h2 className="text-gray-900 mb-2" style={{ fontSize: '26px', fontWeight: 800, lineHeight: '1.3' }}>
            Your partner's name?
          </h2>
          <p className="text-gray-400 mb-8" style={{ fontSize: '14px' }}>The other half of this beautiful duo.</p>
          <input
            autoFocus
            value={partner2}
            onChange={e => setPartner2(e.target.value)}
            placeholder="Their first name"
            className="w-full rounded-2xl px-5 py-4 border-2 outline-none text-gray-900 transition-all"
            style={{
              fontSize: '18px',
              fontWeight: 500,
              borderColor: partner2.trim() ? '#a855f7' : '#e5e7eb',
              background: '#fff',
            }}
            onKeyDown={e => e.key === 'Enter' && partner2.trim() && setStep('since')}
          />
        </div>
        <button
          onClick={() => setStep('since')}
          disabled={!partner2.trim()}
          className="w-full py-4 rounded-2xl"
          style={{
            background: partner2.trim() ? 'linear-gradient(135deg, #f43f5e, #a855f7)' : '#e5e7eb',
            fontSize: '15px',
            fontWeight: 700,
            color: partner2.trim() ? '#fff' : '#9ca3af',
          }}
        >
          Continue →
        </button>
      </div>
    );
  }

  if (step === 'since') {
    return (
      <div className="min-h-screen flex flex-col px-6 pt-20 pb-10"
        style={{ background: 'linear-gradient(160deg, #fff0f3 0%, #f5f0ff 100%)' }}>
        <StepDots current={2} />
        <div className="flex-1 flex flex-col justify-center">
          <button onClick={() => setStep('name2')} className="flex items-center gap-1 text-gray-400 mb-8" style={{ fontSize: '13px' }}>
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <p className="text-gray-400 mb-2" style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Step 3 of 3
          </p>
          <h2 className="text-gray-900 mb-2" style={{ fontSize: '26px', fontWeight: 800, lineHeight: '1.3' }}>
            When did you get together?
          </h2>
          <p className="text-gray-400 mb-8" style={{ fontSize: '14px' }}>
            Your anniversary date — we'll track how long you've been together.
          </p>
          <input
            type="date"
            value={since}
            onChange={e => setSince(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full rounded-2xl px-5 py-4 border-2 outline-none text-gray-900 transition-all"
            style={{
              fontSize: '16px',
              fontWeight: 500,
              borderColor: since ? '#f43f5e' : '#e5e7eb',
              background: '#fff',
            }}
          />
          <p className="text-gray-400 mt-3" style={{ fontSize: '12px' }}>Not sure of the exact date? Just pick approximately.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { setSince(''); finish(); }}
            className="flex-1 py-4 rounded-2xl border-2"
            style={{ fontSize: '14px', fontWeight: 600, color: '#9ca3af', borderColor: '#e5e7eb' }}
          >
            Skip
          </button>
          <button
            onClick={finish}
            disabled={!since}
            className="flex-2 flex-1 py-4 rounded-2xl"
            style={{
              background: since ? 'linear-gradient(135deg, #f43f5e, #a855f7)' : '#e5e7eb',
              fontSize: '15px',
              fontWeight: 700,
              color: since ? '#fff' : '#9ca3af',
            }}
          >
            Start our journey 💕
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function StepDots({ current }: { current: number }) {
  return (
    <div className="flex gap-2 justify-center mb-2">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="rounded-full transition-all"
          style={{
            width: i === current ? '20px' : '8px',
            height: '8px',
            background: i === current ? '#f43f5e' : i < current ? '#a855f7' : '#e5e7eb',
          }}
        />
      ))}
    </div>
  );
}
