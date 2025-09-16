import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

// Import all of your page components
import HomeDashboard from '@/components/HomeDashboard';
import Login from '@/components/Login';
import Register from '@/components/Register';
import AIChat from '@/components/AIChat';
import MoodTracking from '@/components/MoodTracking';
import ProfileSettings from '@/components/ProfileSettings';

// A simple loading component to show while Firebase checks authentication
const FullScreenLoader = () => (
  <div className="min-h-screen bg-gradient-calm flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
  </div>
);

const Index = () => {
  const { user, loading } = useAuth();
  const [screen, setScreen] = useState('home'); // Manages navigation inside the app
  const [authScreen, setAuthScreen] = useState('login'); // Toggles between login/register

  // 1. Show a loader while Firebase initializes
  if (loading) {
    return <FullScreenLoader />;
  }

  // 2. If a user is logged in, show the main application
  if (user) {
    switch (screen) {
      case 'home':
        return <HomeDashboard onNavigate={setScreen} />;
      case 'chat':
        return <AIChat onBack={() => setScreen('home')} />;
      case 'mood':
        return <MoodTracking onBack={() => setScreen('home')} />;
      case 'profile':
        return <ProfileSettings onBack={() => setScreen('home')} />;
      // --- Add cases for other screens as you build them ---
      // case 'journal':
      //   return <Journal onBack={() => setScreen('home')} />;
      // case 'breathing':
      //   return <BreathingExercise onBack={() => setScreen('home')} />;
      // case 'progress':
      //   return <Progress onBack={() => setScreen('home')} />;
      default:
        return <HomeDashboard onNavigate={setScreen} />;
    }
  }

  // 3. If no user is logged in, show the authentication flow
  if (!user) {
    switch (authScreen) {
      case 'login':
        return (
          <Login
            onNavigateToRegister={() => setAuthScreen('register')}
            onLoginSuccess={() => {}} // AuthProvider handles state change automatically
            onBack={() => setAuthScreen('login')} // Or a potential 'welcome' screen
          />
        );
      case 'register':
        return (
          <Register
            onNavigateToLogin={() => setAuthScreen('login')}
            onRegisterSuccess={() => setAuthScreen('login')} // Guide user to login after registering
            onBack={() => setAuthScreen('login')}
          />
        );
      default:
        return (
          <Login
            onNavigateToRegister={() => setAuthScreen('register')}
            onLoginSuccess={() => {}}
            onBack={() => {}}
          />
        );
    }
  }

  // Fallback return
  return <FullScreenLoader />;
};

export default Index;