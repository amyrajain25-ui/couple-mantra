import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Therapists', path: '/therapists' },
    { name: 'Assessment', path: '/assessment' },
    { name: 'Resources', path: '/resources' },
    { name: 'Courses', path: '/courses' },

  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-rose-400 to-pink-500 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white fill-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">TherapyMantra Couples</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === item.path
                    ? 'text-rose-500'
                    : 'text-gray-600 hover:text-rose-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/dashboard">
              <Button size="sm" className="bg-rose-500 hover:bg-rose-600">
                Dashboard
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block py-2 text-sm font-medium text-gray-600 hover:text-rose-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full mt-2 bg-rose-500 hover:bg-rose-600">
                Dashboard
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
