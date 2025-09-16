import { useState } from "react";
import { Heart, MessageCircle, BookOpen, Wind, BarChart3, User, Sun, Moon, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeDashboardProps {
  onNavigate: (screen: string) => void;
  userName?: string;
}

const HomeDashboard = ({ onNavigate, userName = "Friend" }: HomeDashboardProps) => {
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: <Sun className="w-5 h-5" /> };
    if (hour < 17) return { text: "Good afternoon", icon: <Cloud className="w-5 h-5" /> };
    return { text: "Good evening", icon: <Moon className="w-5 h-5" /> };
  });

  const dailyTips = [
    "Take three deep breaths and notice how you feel in this moment.",
    "Remember: it's okay to not be okay. You're taking steps to care for yourself.",
    "Small progress is still progress. Every step counts on your wellness journey.",
    "Try the 5-4-3-2-1 grounding technique: notice 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste.",
    "Your feelings are valid. Allow yourself to experience them without judgment."
  ];

  const [dailyTip] = useState(() => 
    dailyTips[Math.floor(Math.random() * dailyTips.length)]
  );

  const quickActions = [
    {
      id: "mood",
      title: "Track Mood",
      subtitle: "How are you feeling?",
      icon: <Heart className="w-6 h-6" />,
      color: "from-primary to-primary-light",
      action: () => onNavigate("mood")
    },
    {
      id: "chat",
      title: "AI Chat",
      subtitle: "Talk it out",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "from-secondary to-secondary-light",
      action: () => onNavigate("chat")
    },
    {
      id: "journal",
      title: "Daily Journal",
      subtitle: "Write your thoughts",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-accent to-accent-light",
      action: () => onNavigate("journal")
    },
    {
      id: "breathing",
      title: "Breathing",
      subtitle: "Calm your mind",
      icon: <Wind className="w-6 h-6" />,
      color: "from-green-400 to-green-300",
      action: () => onNavigate("breathing")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-calm p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center pt-8 pb-4">
          <div className="fade-in">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              {greeting.icon}
              <span className="text-sm font-medium">{greeting.text}</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground font-inter">
              Hi {userName} 👋
            </h1>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate("profile")}
            className="rounded-full hover:bg-card-soft"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>

        {/* Daily Tip Card */}
        <div className="card-mood slide-up">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-light to-accent-light rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Daily Wellness Tip</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{dailyTip}</p>
            </div>
          </div>
        </div>

        {/* Quick Mood Check */}
        <div className="card-therapy slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-semibold text-foreground mb-3">How are you feeling today?</h3>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {['😢', '😟', '😐', '😊', '😁'].map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate("mood")}
                  className="mood-indicator"
                  title={['Very sad', 'Sad', 'Neutral', 'Happy', 'Very happy'][index]}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <Button
              onClick={() => onNavigate("mood")}
              className="btn-gentle text-sm"
            >
              Track Mood
            </Button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={action.id}
              onClick={action.action}
              className="card-mood p-4 text-left hover:scale-[1.02] transition-all duration-300 slide-up"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-3 text-white shadow-soft`}>
                {action.icon}
              </div>
              <h4 className="font-semibold text-foreground mb-1">{action.title}</h4>
              <p className="text-sm text-muted-foreground">{action.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Progress Overview */}
        <div className="card-therapy slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-foreground mb-1">Your Progress</h3>
              <p className="text-sm text-muted-foreground">3 days streak 🔥</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => onNavigate("progress")}
              className="text-primary hover:text-primary-dark hover:bg-primary-light/20"
            >
              <BarChart3 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0l1.5 4.5L18 6l-4.5 1.5L12 12l-1.5-4.5L6 6l4.5-1.5L12 0z" />
    <path d="M19 10l.75 2.25L22 13l-2.25.75L19 16l-.75-2.25L16 13l2.25-.75L19 10z" />
    <path d="M5 16l.5 1.5L7 18l-1.5.5L5 20l-.5-1.5L3 18l1.5-.5L5 16z" />
  </svg>
);

export default HomeDashboard;