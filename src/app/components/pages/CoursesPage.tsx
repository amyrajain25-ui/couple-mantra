import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Award, CheckCircle2, Lock, Play, X, Star } from 'lucide-react';

const allCourses = [
  {
    id: 1,
    title: 'Better Communication Fundamentals',
    description: 'Master the art of expressing yourself clearly and listening actively',
    instructor: 'Dr. Sarah Johnson',
    duration: '4 weeks',
    lessons: 16,
    enrolled: false,
    level: 'Beginner',
    rating: 4.9,
    students: 2543,
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400',
    accent: '#f43f5e',
    bg: '#fff0f3',
    modules: [
      'Introduction to Communication Styles',
      'Active Listening Techniques',
      'Non-Violent Communication',
      'Difficult Conversations',
    ],
  },
  {
    id: 2,
    title: 'Rebuilding Trust After Infidelity',
    description: 'A comprehensive program for couples healing from betrayal',
    instructor: 'Dr. Michael Chen',
    duration: '6 weeks',
    lessons: 24,
    enrolled: false,
    level: 'Intermediate',
    rating: 4.8,
    students: 1821,
    image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=400',
    accent: '#7c3aed',
    bg: '#f5f3ff',
    modules: [
      'Understanding the Impact of Betrayal',
      'Transparency and Accountability',
      'Healing Emotional Wounds',
      'Rebuilding Intimacy',
    ],
  },
  {
    id: 3,
    title: 'Conflict Resolution Mastery',
    description: 'Transform arguments into opportunities for deeper connection',
    instructor: 'Dr. Priya Sharma',
    duration: '3 weeks',
    lessons: 12,
    enrolled: true,
    level: 'Beginner',
    rating: 5.0,
    students: 3102,
    progress: 65,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    accent: '#059669',
    bg: '#ecfdf5',
    modules: [
      'Understanding Conflict Patterns',
      'De-escalation Techniques',
      'Fair Fighting Rules',
      'Finding Win-Win Solutions',
    ],
  },
  {
    id: 4,
    title: 'Preparing for Marriage',
    description: 'Essential conversations and skills for engaged couples',
    instructor: 'Dr. James Martinez',
    duration: '5 weeks',
    lessons: 20,
    enrolled: false,
    level: 'Beginner',
    rating: 4.9,
    students: 1965,
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=400',
    accent: '#d97706',
    bg: '#fffbeb',
    modules: [
      'Financial Planning Together',
      'In-Laws and Boundaries',
      'Children and Parenting Philosophies',
      'Managing Expectations',
    ],
  },
  {
    id: 5,
    title: 'Strengthening Emotional Intimacy',
    description: 'Deepen your emotional connection and vulnerability',
    instructor: 'Dr. Emily Roberts',
    duration: '4 weeks',
    lessons: 16,
    enrolled: true,
    level: 'Intermediate',
    rating: 4.7,
    students: 2234,
    progress: 30,
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400',
    accent: '#db2777',
    bg: '#fdf2f8',
    modules: [
      'Emotional Availability',
      'Vulnerability and Trust',
      'Love Languages Deep Dive',
      'Creating Rituals of Connection',
    ],
  },
];

const lessonsByCourse: Record<number, { title: string; duration: string; done: boolean }[]> = {
  3: [
    { title: 'Understanding Conflict Patterns', duration: '12 min', done: true },
    { title: 'De-escalation Techniques', duration: '15 min', done: true },
    { title: 'Fair Fighting Rules', duration: '18 min', done: true },
    { title: 'Finding Win-Win Solutions', duration: '20 min', done: false },
    { title: 'Communication Under Pressure', duration: '14 min', done: false },
    { title: 'Repair Attempts & Reconnection', duration: '16 min', done: false },
  ],
  5: [
    { title: 'Emotional Availability', duration: '11 min', done: true },
    { title: 'Vulnerability and Trust', duration: '14 min', done: false },
    { title: 'Love Languages Deep Dive', duration: '22 min', done: false },
    { title: 'Creating Rituals of Connection', duration: '17 min', done: false },
  ],
};

type Course = typeof allCourses[0];

export default function CoursesPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'enrolled' | 'all'>('enrolled');
  const [certificateCourse, setCertificateCourse] = useState<Course | null>(null);
  const [learningCourse, setLearningCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState(0);

  const enrolledCourses = allCourses.filter(c => c.enrolled);
  const availableCourses = allCourses.filter(c => !c.enrolled);

  const openLearning = (course: Course) => {
    setLearningCourse(course);
    const lessons = lessonsByCourse[course.id] || [];
    const firstIncomplete = lessons.findIndex(l => !l.done);
    setActiveLesson(firstIncomplete >= 0 ? firstIncomplete : 0);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Certificate Modal */}
      {certificateCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setCertificateCourse(null)}>
          <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex justify-end p-4">
              <button onClick={() => setCertificateCourse(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="mx-5 mb-5 border-4 border-double rounded-2xl p-6 text-center" style={{ borderColor: '#fda4af', background: 'linear-gradient(135deg, #fff0f3, #fff)' }}>
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-full" style={{ background: '#fce7f3' }}>
                  <Award className="h-10 w-10" style={{ color: '#f43f5e' }} />
                </div>
              </div>
              <p className="uppercase tracking-widest mb-1" style={{ fontSize: '10px', color: '#f43f5e' }}>Certificate of Completion</p>
              <p className="text-gray-500 mb-3" style={{ fontSize: '13px' }}>This certifies that</p>
              <p style={{ fontSize: '20px', fontWeight: 800, color: '#1f2937' }}>You & Your Partner</p>
              <p className="text-gray-500 my-2" style={{ fontSize: '13px' }}>have successfully completed</p>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#f43f5e' }}>{certificateCourse.title}</p>
              <p className="text-gray-500 mt-1 mb-3" style={{ fontSize: '12px' }}>by {certificateCourse.instructor}</p>
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-gray-400" style={{ fontSize: '11px' }}>
                Issued: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="px-5 pb-5">
              <button
                className="w-full py-3 rounded-2xl text-white"
                style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)', fontSize: '14px', fontWeight: 600 }}
              >
                Download Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Continue Learning Modal */}
      {learningCourse && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center" onClick={() => setLearningCourse(null)}>
          <div
            className="bg-white w-full shadow-2xl overflow-hidden flex flex-col"
            style={{ maxWidth: '430px', maxHeight: '90vh', borderRadius: '24px 24px 0 0' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#f3f4f6' }}>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 700, color: '#1f2937' }}>{learningCourse.title}</p>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>{learningCourse.instructor}</p>
              </div>
              <button onClick={() => setLearningCourse(null)}><X className="h-5 w-5 text-gray-400" /></button>
            </div>
            <div className="flex flex-1 overflow-hidden">
              {/* Lesson list */}
              <div className="w-44 border-r overflow-y-auto shrink-0" style={{ background: '#f9fafb', borderColor: '#f3f4f6' }}>
                {(lessonsByCourse[learningCourse.id] || learningCourse.modules.map((m, i) => ({ title: m, duration: `${12 + i * 3} min`, done: false }))).map((lesson, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveLesson(i)}
                    className="w-full text-left px-3 py-3 border-b flex items-start gap-2 transition-colors"
                    style={{
                      borderColor: '#f3f4f6',
                      background: activeLesson === i ? '#fce7f3' : 'transparent',
                      borderLeft: activeLesson === i ? '3px solid #f43f5e' : '3px solid transparent',
                    }}
                  >
                    <div className="shrink-0 mt-0.5">
                      {lesson.done
                        ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                        : <div className="h-3.5 w-3.5 rounded-full border-2" style={{ borderColor: activeLesson === i ? '#f43f5e' : '#d1d5db' }} />}
                    </div>
                    <div>
                      <p style={{ fontSize: '11px', fontWeight: 600, color: '#374151', lineHeight: '1.4' }}>{lesson.title}</p>
                      <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>{lesson.duration}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Viewer */}
              <div className="flex-1 flex flex-col overflow-y-auto">
                {(() => {
                  const lessons = lessonsByCourse[learningCourse.id] || learningCourse.modules.map((m, i) => ({ title: m, duration: `${12 + i * 3} min`, done: false }));
                  const lesson = lessons[activeLesson];
                  return (
                    <>
                      <div className="relative" style={{ aspectRatio: '16/9', background: '#111' }}>
                        <img src={learningCourse.image} alt="" className="w-full h-full object-cover opacity-40" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <button className="rounded-full p-4 shadow-lg mb-2" style={{ background: '#f43f5e' }}>
                            <Play className="h-7 w-7 text-white fill-white ml-0.5" />
                          </button>
                          <p className="text-white/70" style={{ fontSize: '12px' }}>Lesson {activeLesson + 1} of {lessons.length}</p>
                        </div>
                      </div>
                      <div className="p-4 flex-1">
                        <span
                          className="px-2.5 py-0.5 rounded-full inline-block mb-2"
                          style={{ background: learningCourse.bg, color: learningCourse.accent, fontSize: '11px', fontWeight: 600 }}
                        >
                          {learningCourse.level}
                        </span>
                        <p style={{ fontSize: '15px', fontWeight: 700, color: '#1f2937', marginBottom: '4px' }}>{lesson?.title}</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>{lesson?.duration} · {learningCourse.instructor}</p>
                        <p style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.6', marginBottom: '16px' }}>
                          In this lesson, you'll explore practical techniques and research-backed insights to strengthen your relationship.
                        </p>
                        <div className="flex gap-2">
                          <button
                            className="flex-1 py-2.5 rounded-xl border"
                            style={{ fontSize: '13px', color: '#f43f5e', borderColor: '#fda4af' }}
                            disabled={activeLesson === 0}
                            onClick={() => setActiveLesson(a => a - 1)}
                          >
                            ← Prev
                          </button>
                          <button
                            className="flex-1 py-2.5 rounded-xl text-white"
                            style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)', fontSize: '13px', fontWeight: 600 }}
                            disabled={activeLesson >= lessons.length - 1}
                            onClick={() => setActiveLesson(a => a + 1)}
                          >
                            Next →
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page header */}
      <div
        className="relative px-5 pt-14 pb-6"
        style={{ background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 55%, #a855f7 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full"
            style={{ background: 'rgba(255,255,255,0.2)' }}
          >
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div>
            <h1 className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>Courses</h1>
            <p className="text-white/75" style={{ fontSize: '12px' }}>Expert-led relationship programmes</p>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex px-5 gap-2 pt-4 pb-2">
        {(['enrolled', 'all'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-full"
            style={{
              background: tab === t ? '#f43f5e' : '#f9fafb',
              color: tab === t ? '#fff' : '#6b7280',
              fontSize: '13px',
              fontWeight: 600,
              border: `1px solid ${tab === t ? '#f43f5e' : '#f3f4f6'}`,
            }}
          >
            {t === 'enrolled' ? `My Courses (${enrolledCourses.length})` : `Browse All (${allCourses.length})`}
          </button>
        ))}
      </div>

      <div className="px-5 pb-6 space-y-3">
        {tab === 'enrolled' && (
          <>
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-16">
                <p style={{ fontSize: '40px' }}>📚</p>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937', marginTop: '12px' }}>No courses yet</p>
                <p className="text-gray-400 mt-1" style={{ fontSize: '13px' }}>Browse all courses to start learning</p>
                <button
                  onClick={() => setTab('all')}
                  className="mt-4 px-5 py-2.5 rounded-2xl text-white"
                  style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)', fontSize: '13px', fontWeight: 600 }}
                >
                  Browse Courses
                </button>
              </div>
            ) : (
              enrolledCourses.map(course => (
                <div key={course.id} className="rounded-2xl overflow-hidden" style={{ background: course.bg }}>
                  <img src={course.image} alt={course.title} className="w-full h-36 object-cover" />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.07)', color: course.accent, fontSize: '11px', fontWeight: 600 }}>
                        {course.level}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: 600 }}>
                        Enrolled
                      </span>
                    </div>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#1f2937' }}>{course.title}</p>
                    <p className="text-gray-500 mt-1" style={{ fontSize: '12px' }}>{course.description}</p>

                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex justify-between mb-1">
                        <span style={{ fontSize: '11px', color: '#6b7280' }}>Progress</span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: course.accent }}>{course.progress ?? 0}%</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.08)' }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${course.progress ?? 0}%`, background: course.accent }} />
                      </div>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        className="flex items-center gap-1.5 flex-1 justify-center py-2.5 rounded-xl text-white"
                        style={{ background: course.accent, fontSize: '13px', fontWeight: 600 }}
                        onClick={() => openLearning(course)}
                      >
                        <Play className="h-3.5 w-3.5 fill-white" /> Continue
                      </button>
                      <button
                        className="px-4 py-2.5 rounded-xl"
                        style={{ background: 'rgba(0,0,0,0.06)', color: '#4b5563', fontSize: '13px', fontWeight: 600 }}
                        onClick={() => setCertificateCourse(course)}
                      >
                        Certificate
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {tab === 'all' && (
          <>
            {allCourses.map(course => (
              <div key={course.id} className="rounded-2xl overflow-hidden" style={{ background: course.bg }}>
                <div className="relative">
                  <img src={course.image} alt={course.title} className="w-full h-36 object-cover" />
                  <span
                    className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.92)', color: '#374151', fontSize: '11px', fontWeight: 600 }}
                  >
                    {course.level}
                  </span>
                  {course.enrolled && (
                    <span
                      className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full"
                      style={{ background: '#dcfce7', color: '#15803d', fontSize: '11px', fontWeight: 600 }}
                    >
                      Enrolled
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#1f2937' }}>{course.title}</p>
                  <p className="text-gray-500 mt-1 mb-3" style={{ fontSize: '12px' }}>{course.description}</p>

                  <div className="flex items-center justify-between mb-3" style={{ fontSize: '12px', color: '#6b7280' }}>
                    <span>by {course.instructor}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span style={{ fontWeight: 600, color: '#1f2937' }}>{course.rating}</span>
                      <span>({course.students.toLocaleString()})</span>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-3" style={{ fontSize: '12px', color: '#6b7280' }}>
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{course.lessons} lessons</span>
                  </div>

                  <div className="space-y-1 mb-4">
                    {course.modules.slice(0, 3).map((mod, i) => (
                      <div key={i} className="flex items-center gap-2" style={{ fontSize: '12px', color: '#4b5563' }}>
                        {course.enrolled
                          ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                          : <Lock className="h-3.5 w-3.5 shrink-0" style={{ color: '#d1d5db' }} />}
                        {mod}
                      </div>
                    ))}
                    {course.modules.length > 3 && (
                      <p style={{ fontSize: '12px', color: '#9ca3af', paddingLeft: '19px' }}>+{course.modules.length - 3} more modules</p>
                    )}
                  </div>

                  {course.enrolled ? (
                    <button
                      className="w-full py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-white"
                      style={{ background: course.accent, fontSize: '13px', fontWeight: 600 }}
                      onClick={() => openLearning(course)}
                    >
                      <Play className="h-3.5 w-3.5 fill-white" /> Continue Course
                    </button>
                  ) : (
                    <button
                      className="w-full py-2.5 rounded-xl"
                      style={{ background: 'rgba(0,0,0,0.06)', color: '#374151', fontSize: '13px', fontWeight: 600 }}
                    >
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
