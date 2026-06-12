import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Video, DollarSign, Calendar, Award, Search, ChevronRight } from 'lucide-react';

const therapists = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    credentials: 'PhD, Licensed Marriage Therapist',
    specializations: ['Communication', 'Intimacy', 'Conflict Resolution'],
    languages: ['English', 'Spanish'],
    experience: '12 years',
    rating: 4.9,
    reviews: 156,
    price: 120,
    availability: 'Available today',
    bio: 'Specializing in helping couples rebuild connection and communication.',
    accent: '#f43f5e',
    bg: '#fff0f3',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    credentials: 'PsyD, Certified Gottman Therapist',
    specializations: ['Trust Issues', 'Infidelity Recovery', 'Premarital'],
    languages: ['English', 'Mandarin'],
    experience: '15 years',
    rating: 5.0,
    reviews: 203,
    price: 150,
    availability: 'Next: Tomorrow',
    bio: 'Expert in helping couples heal from betrayal and rebuild trust.',
    accent: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    id: 3,
    name: 'Dr. Priya Sharma',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    credentials: 'LMFT, Emotionally Focused Therapy',
    specializations: ['Emotional Connection', 'Long Distance', 'Cultural Issues'],
    languages: ['English', 'Hindi', 'Urdu'],
    experience: '8 years',
    rating: 4.8,
    reviews: 92,
    price: 100,
    availability: 'Available today',
    bio: 'Passionate about helping couples navigate cultural and emotional challenges.',
    accent: '#0891b2',
    bg: '#ecfeff',
  },
  {
    id: 4,
    name: 'Dr. James Martinez',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    credentials: 'PhD, LGBTQ+ Affirmative Therapist',
    specializations: ['LGBTQ+ Couples', 'Communication', 'Life Transitions'],
    languages: ['English', 'Portuguese'],
    experience: '10 years',
    rating: 4.9,
    reviews: 128,
    price: 130,
    availability: 'Available today',
    bio: 'Dedicated to supporting LGBTQ+ couples through all relationship stages.',
    accent: '#059669',
    bg: '#ecfdf5',
  },
  {
    id: 5,
    name: 'Dr. Emily Roberts',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400',
    credentials: 'LCSW, Trauma-Informed Therapist',
    specializations: ['Trauma', 'Anxiety', 'Parenting Conflicts'],
    languages: ['English', 'French'],
    experience: '14 years',
    rating: 5.0,
    reviews: 187,
    price: 140,
    availability: 'Next: Tomorrow',
    bio: 'Expert in helping couples heal from past trauma and build resilience.',
    accent: '#d97706',
    bg: '#fffbeb',
  },
  {
    id: 6,
    name: 'Dr. Raj Patel',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
    credentials: 'MD, Relationship Psychiatrist',
    specializations: ['Financial Stress', 'Career Balance', 'Blended Families'],
    languages: ['English', 'Gujarati'],
    experience: '11 years',
    rating: 4.7,
    reviews: 74,
    price: 110,
    availability: 'Available today',
    bio: 'Helping couples navigate life transitions and financial pressures.',
    accent: '#db2777',
    bg: '#fdf2f8',
  },
];

export default function TherapistsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');

  const specs = ['All', 'Communication', 'Trust Issues', 'Intimacy', 'Conflict Resolution', 'Premarital', 'LGBTQ+'];

  const filtered = therapists.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specializations.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchSpec = selectedSpec === 'All' || t.specializations.some(s => s.includes(selectedSpec));
    return matchSearch && matchSpec;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div
        className="relative px-5 pt-14 pb-6"
        style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 55%, #a855f7 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="flex items-center gap-3 relative mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div>
            <h1 className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>Find a Therapist</h1>
            <p className="text-white/75" style={{ fontSize: '12px' }}>500+ licensed couples therapists</p>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#9ca3af' }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or specialty…"
            className="w-full rounded-2xl pl-10 pr-4 py-3 outline-none"
            style={{ fontSize: '14px', background: 'rgba(255,255,255,0.95)', color: '#1f2937' }}
          />
        </div>
      </div>

      {/* Specialty filter pills */}
      <div className="px-5 pt-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {specs.map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpec(spec)}
              className="shrink-0 px-3.5 py-1.5 rounded-full border transition-all"
              style={{
                background: selectedSpec === spec ? '#f43f5e' : '#f9fafb',
                color: selectedSpec === spec ? '#fff' : '#6b7280',
                borderColor: selectedSpec === spec ? '#f43f5e' : '#f3f4f6',
                fontSize: '12px',
                fontWeight: 600,
              }}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="px-5 py-2">
        <p className="text-gray-400" style={{ fontSize: '12px' }}>
          {filtered.length} therapist{filtered.length !== 1 ? 's' : ''} available
        </p>
      </div>

      {/* Therapist cards */}
      <div className="px-5 space-y-3 pb-6">
        {filtered.map(t => (
          <div
            key={t.id}
            className="rounded-2xl overflow-hidden"
            style={{ background: t.bg, border: `1px solid ${t.bg}` }}
          >
            <div className="p-4">
              <div className="flex gap-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-16 h-16 rounded-2xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p style={{ fontSize: '15px', fontWeight: 700, color: '#1f2937' }}>{t.name}</p>
                      <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '1px' }}>{t.credentials}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#1f2937' }}>{t.rating}</span>
                      <span style={{ fontSize: '11px', color: '#9ca3af' }}>({t.reviews})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-3.5 w-3.5" style={{ color: '#9ca3af' }} />
                      <span style={{ fontSize: '11px', color: '#6b7280' }}>{t.experience}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-3" style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.55' }}>{t.bio}</p>

              {/* Specializations */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {t.specializations.map((spec, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(0,0,0,0.06)', color: t.accent, fontSize: '11px', fontWeight: 600 }}
                  >
                    {spec}
                  </span>
                ))}
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Video className="h-3.5 w-3.5" style={{ color: '#9ca3af' }} />
                    <span style={{ fontSize: '11px', color: '#6b7280' }}>Online · ${t.price}/session</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" style={{ color: '#16a34a' }} />
                    <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>{t.availability}</span>
                  </div>
                </div>
                <Link to={`/booking/${t.id}`}>
                  <button
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl"
                    style={{ background: t.accent, color: '#fff', fontSize: '13px', fontWeight: 600 }}
                  >
                    Book
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p style={{ fontSize: '32px' }}>🔍</p>
            <p className="text-gray-500 mt-3" style={{ fontSize: '14px' }}>No therapists match your search</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedSpec('All'); }}
              className="mt-3 px-4 py-2 rounded-xl"
              style={{ background: '#fce7f3', color: '#f43f5e', fontSize: '13px', fontWeight: 600 }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
