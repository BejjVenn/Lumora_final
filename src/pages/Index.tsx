import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import WelcomeScreen from "@/components/WelcomeScreen";
import Login from "@/components/Login";
import Register from "@/components/Register";
import HomeDashboard from "@/components/HomeDashboard";
import MoodTracking from "@/components/MoodTracking";
import AIChat from "@/components/AIChat";

type Screen = "welcome" | "login" | "register" | "home" | "mood" | "chat" | "journal" | "breathing" | "profile" | "progress";

const Index = () => {
  const { user, loading } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const handleGetStarted = () => {
    setCurrentScreen("login");
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    if (user) {
      setCurrentScreen("home");
    } else {
      setCurrentScreen("welcome");
    }
  };

  const handleLoginSuccess = () => {
    setHasCompletedOnboarding(true);
    setCurrentScreen("home");
  };

  const handleRegisterSuccess = () => {
    setCurrentScreen("login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <div className="h-8 w-32 bg-primary/20 rounded mx-auto"></div>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show welcome screen for first-time users
  if (!user && currentScreen === "welcome") {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  // Show login screen
  if (!user && currentScreen === "login") {
    return (
      <Login
        onBack={() => setCurrentScreen("welcome")}
        onNavigateToRegister={() => setCurrentScreen("register")}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Show register screen
  if (!user && currentScreen === "register") {
    return (
      <Register
        onBack={() => setCurrentScreen("login")}
        onNavigateToLogin={() => setCurrentScreen("login")}
        onRegisterSuccess={handleRegisterSuccess}
      />
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Login
        onBack={() => setCurrentScreen("welcome")}
        onNavigateToRegister={() => setCurrentScreen("register")}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Render current screen for authenticated users
  switch (currentScreen) {
    case "home":
      return <HomeDashboard onNavigate={handleNavigate} userName={user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Friend"} />;
    
    case "mood":
      return <MoodTracking onBack={handleBack} />;
    
    case "chat":
      return <AIChat onBack={handleBack} />;
    
    case "journal":
      return (
        <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
          <div className="card-therapy text-center max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Daily Journal</h2>
            <p className="text-muted-foreground mb-6">Coming soon! A beautiful space for your thoughts and reflections.</p>
            <button onClick={handleBack} className="btn-therapy">
              Back to Home
            </button>
          </div>
        </div>
      );
    
    case "breathing":
      return (
        <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
          <div className="card-therapy text-center max-w-md mx-auto">
            <div className="breathing-circle mx-auto mb-6"></div>
            <h2 className="text-xl font-semibold mb-4">Breathing Exercise</h2>
            <p className="text-muted-foreground mb-6">
              Focus on the circle above. Breathe in as it expands, breathe out as it contracts.
            </p>
            <button onClick={handleBack} className="btn-therapy">
              Back to Home
            </button>
          </div>
        </div>
      );
    
    case "profile":
      return (
        <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
          <div className="card-therapy text-center max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Profile & Settings</h2>
            <p className="text-muted-foreground mb-6">Manage your account and preferences.</p>
            <button onClick={handleBack} className="btn-therapy">
              Back to Home
            </button>
          </div>
        </div>
      );
    
    case "progress":
      return (
        <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
          <div className="card-therapy text-center max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
            <p className="text-muted-foreground mb-6">Track your wellness journey over time.</p>
            <button onClick={handleBack} className="btn-therapy">
              Back to Home
            </button>
          </div>
        </div>
      );
    
    default:
      return <HomeDashboard onNavigate={handleNavigate} userName="Friend" />;
  }
};

export default Index;