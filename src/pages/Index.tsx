import { useState } from "react";
import WelcomeScreen from "@/components/WelcomeScreen";
import HomeDashboard from "@/components/HomeDashboard";
import MoodTracking from "@/components/MoodTracking";
import AIChat from "@/components/AIChat";

type Screen = "welcome" | "home" | "mood" | "chat" | "journal" | "breathing" | "profile" | "progress";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  const handleGetStarted = () => {
    setHasCompletedOnboarding(true);
    setCurrentScreen("home");
  };

  const handleNavigate = (screen: string) => {
    setCurrentScreen(screen as Screen);
  };

  const handleBack = () => {
    setCurrentScreen("home");
  };

  // Show welcome screen for first-time users
  if (!hasCompletedOnboarding && currentScreen === "welcome") {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  // Render current screen
  switch (currentScreen) {
    case "home":
      return <HomeDashboard onNavigate={handleNavigate} userName="Friend" />;
    
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