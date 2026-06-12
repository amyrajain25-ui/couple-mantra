import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { CoupleProvider, useCouple } from './components/contexts/CoupleContext';
import AppShell from './components/layout/AppShell';
import AuthGuard from './components/AuthGuard';
import OnboardingPage from './components/pages/OnboardingPage';
import TodayPage from './components/pages/TodayPage';
import ActivitiesPage from './components/pages/ActivitiesPage';
import CouplePage from './components/pages/CouplePage';
import ConnectPage from './components/pages/ConnectPage';
import ProfilePage from './components/pages/ProfilePage';
import TherapistsPage from './components/pages/TherapistsPage';
import AssessmentPage from './components/pages/AssessmentPage';
import DashboardPage from './components/pages/DashboardPage';
import ResourcesPage from './components/pages/ResourcesPage';
import CoursesPage from './components/pages/CoursesPage';
import BookingPage from './components/pages/BookingPage';
import SettingsPage from './components/pages/SettingsPage';

function AppContent() {
  const { couple } = useCouple();

  if (!couple) {
    return <OnboardingPage />;
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<TodayPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/log" element={<CouplePage />} />
        <Route path="/connect" element={<ConnectPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/therapists" element={<TherapistsPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/booking/:therapistId" element={<BookingPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppShell>
  );
}

export default function App() {
  return (
    <Router>
      {/* AuthGuard MUST wrap everything — no UI renders before identity is confirmed */}
      <AuthGuard>
        <CoupleProvider>
          <AppContent />
          <Toaster />
        </CoupleProvider>
      </AuthGuard>
    </Router>
  );
}
