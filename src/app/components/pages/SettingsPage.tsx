import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Target, CheckCircle2, Sparkles, Bell, Volume2, LogOut, Trash2 } from 'lucide-react';
import { useCouple } from '../contexts/CoupleContext';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { couple, clearCouple } = useCouple();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleLogout = () => {
    clearCouple();
    navigate('/');
  };

  const handleClearData = () => {
    localStorage.removeItem('tm_log_entries');
    localStorage.removeItem('tm_sent_love_bombs');
    localStorage.removeItem('tm_completed_worksheets');
    // We could clear other specific keys here
    setShowClearConfirm(false);
    // Refresh to update state
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div
        className="relative px-5 pt-14 pb-6"
        style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}
      >
        <div className="flex items-center gap-3 relative mb-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <ArrowLeft className="h-4 w-4 text-white" />
          </button>
          <div>
            <h1 className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>Settings</h1>
          </div>
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        
        {/* Preferences */}
        <div>
          <h2 className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Preferences
          </h2>
          <div className="rounded-2xl border" style={{ borderColor: '#f3f4f6', background: '#fafafa' }}>
            
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#f3f4f6' }}>
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-400" />
                <span style={{ fontSize: '15px', fontWeight: 500, color: '#1f2937' }}>Notifications</span>
              </div>
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${notificationsEnabled ? 'bg-indigo-500' : 'bg-gray-300'}`}
              >
                <div 
                  className={`w-5 h-5 bg-white rounded-full absolute transition-transform ${notificationsEnabled ? 'translate-x-5' : 'translate-x-1'}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Volume2 className="h-5 w-5 text-gray-400" />
                <span style={{ fontSize: '15px', fontWeight: 500, color: '#1f2937' }}>Sound Effects</span>
              </div>
              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center ${soundEnabled ? 'bg-indigo-500' : 'bg-gray-300'}`}
              >
                <div 
                  className={`w-5 h-5 bg-white rounded-full absolute transition-transform ${soundEnabled ? 'translate-x-5' : 'translate-x-1'}`}
                />
              </button>
            </div>

          </div>
        </div>

        {/* Account */}
        <div>
          <h2 className="text-gray-400 mb-3" style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Account
          </h2>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: '#f3f4f6', background: '#fafafa' }}>
            
            <button 
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-between p-4 border-b bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors" 
              style={{ borderColor: '#f3f4f6' }}
            >
              <div className="flex items-center gap-3 text-gray-700">
                <LogOut className="h-5 w-5" />
                <span style={{ fontSize: '15px', fontWeight: 500 }}>Log Out</span>
              </div>
            </button>

            <button 
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-red-50 active:bg-red-100 transition-colors"
            >
              <div className="flex items-center gap-3 text-red-600">
                <Trash2 className="h-5 w-5" />
                <span style={{ fontSize: '15px', fontWeight: 500 }}>Clear All App Data</span>
              </div>
            </button>

          </div>
        </div>

      </div>

      {/* Modals */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Log Out</h3>
            <p className="text-gray-500 text-sm mb-6">Are you sure you want to log out of your profile?</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 py-3 rounded-xl bg-rose-500 text-white font-semibold text-sm hover:bg-rose-600"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 text-center shadow-xl">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Clear All Data?</h3>
            <p className="text-gray-500 text-sm mb-6">This will permanently delete all your log entries, love bombs, and saved worksheets. This cannot be undone.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleClearData}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
