import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Zap, BookOpen, Heart, User } from 'lucide-react';

const mainNav = [
  { path: '/', icon: Home, label: 'Today' },
  { path: '/activities', icon: Zap, label: 'Play' },
  { path: '/log', icon: BookOpen, label: 'Log' },
  { path: '/connect', icon: Heart, label: 'Connect' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const mainPaths = ['/', '/activities', '/log', '/connect', '/profile'];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const showNav = mainPaths.includes(location.pathname);

  return (
    <div className="flex items-start justify-center min-h-screen" style={{ background: '#e8e8f0' }}>
      <div
        className="w-full flex flex-col min-h-screen bg-white relative overflow-hidden"
        style={{ maxWidth: '430px', boxShadow: '0 0 60px rgba(0,0,0,0.2)' }}
      >
        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: showNav ? '72px' : '0' }}>
          {children}
        </div>

        {showNav && (
          <nav
            className="fixed bottom-0 bg-white z-50"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '430px',
              borderTop: '1px solid #f0f0f5',
            }}
          >
            <div className="flex">
              {mainNav.map(item => {
                const active = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className="flex-1 flex flex-col items-center py-2.5 gap-1 transition-all"
                    style={{ color: active ? '#f43f5e' : '#9ca3af' }}
                  >
                    <item.icon
                      className="h-5 w-5"
                      style={{ fill: active ? 'rgba(244,63,94,0.15)' : 'none' }}
                    />
                    <span style={{ fontSize: '10px', fontWeight: active ? 600 : 400 }}>{item.label}</span>
                    {active && (
                      <div className="w-4 h-0.5 rounded-full" style={{ background: '#f43f5e' }} />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
