import { useState, useEffect } from "react";
import { Heart, MessageCircle, BookOpen, Wind, BarChart3, User, Sun, Moon, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
// ✨ --- Firebase Imports --- ✨
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

interface HomeDashboardProps {
  onNavigate: (screen: string) => void;
  // userName prop is no longer needed as we fetch it, but can be kept for fallbacks
}

const HomeDashboard = ({ onNavigate }: HomeDashboardProps) => {
  const [displayName, setDisplayName] = useState("Friend");
  const [dailyTip, setDailyTip] = useState("Loading your daily tip...");
  const [streak, setStreak] = useState(0);

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: <Sun className="w-5 h-5" /> };
    if (hour < 17) return { text: "Good afternoon", icon: <Cloud className="w-5 h-5" /> };
    return { text: "Good evening", icon: <Moon className="w-5 h-5" /> };
  })();

  // ✨ --- Fetch Data from Firebase on Component Mount --- ✨
  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        // Handle case where user is not logged in
        setDailyTip("Take three deep breaths and notice how you feel in this moment.");
        return;
      }

      // 1. Set User's Display Name
      setDisplayName(user.displayName || "Friend");

      // 2. Fetch a Random Daily Tip from Firestore
      try {
        const tipsCollection = collection(db, "tips");
        const tipSnapshot = await getDocs(tipsCollection);
        const tipsList = tipSnapshot.docs.map(doc => doc.data().text);
        if (tipsList.length > 0) {
          const randomTip = tipsList[Math.floor(Math.random() * tipsList.length)];
          setDailyTip(randomTip);
        }
      } catch (error) {
        console.error("Error fetching daily tip:", error);
        setDailyTip("Remember: it's okay to not be okay. You're taking steps to care for yourself.");
      }

      // 3. Calculate Mood Tracking Streak
      try {
        const q = query(
          collection(db, "moodEntries"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const moodSnapshot = await getDocs(q);
        const entries = moodSnapshot.docs.map(doc => ({
          ...doc.data(),
          // Ensure createdAt is a Date object
          createdAt: doc.data().createdAt.toDate(),
        }));
        
        setStreak(calculateStreak(entries));

      } catch (error) {
        console.error("Error fetching mood entries for streak:", error);
      }
    };

    fetchData();
  }, []);

  // Helper function to calculate the streak
  const calculateStreak = (entries: { createdAt: Date }[]): number => {
    if (entries.length === 0) return 0;

    let currentStreak = 0;
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    
    // Function to check if a date is today or yesterday
    const isRecent = (date: Date) => {
      return date.toDateString() === today.toDateString() || date.toDateString() === yesterday.toDateString();
    };

    if (!isRecent(entries[0].createdAt)) {
      return 0; // Streak is broken if no entry for today or yesterday
    }

    currentStreak = 1;
    let lastDate = entries[0].createdAt;

    for (let i = 1; i < entries.length; i++) {
      const currentDate = entries[i].createdAt;
      const diffTime = lastDate.setHours(0,0,0,0) - currentDate.setHours(0,0,0,0);
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
        lastDate = currentDate;
      } else if (diffDays > 1) {
        break; // Gap found, streak ends
      }
      // If diffDays is 0, it's the same day, so we continue to the next unique day
    }

    return currentStreak;
  };

  const quickActions = [
    { id: "mood", title: "Track Mood", subtitle: "How are you feeling?", icon: <Heart className="w-6 h-6" />, color: "from-primary to-primary-light", action: () => onNavigate("mood") },
    { id: "chat", title: "AI Chat", subtitle: "Talk it out", icon: <MessageCircle className="w-6 h-6" />, color: "from-secondary to-secondary-light", action: () => onNavigate("chat") },
    { id: "journal", title: "Daily Journal", subtitle: "Write your thoughts", icon: <BookOpen className="w-6 h-6" />, color: "from-accent to-accent-light", action: () => onNavigate("journal") },
    { id: "breathing", title: "Breathing", subtitle: "Calm your mind", icon: <Wind className="w-6 h-6" />, color: "from-green-400 to-green-300", action: () => onNavigate("breathing") }
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
            {/* ✨ Use fetched display name */}
            <h1 className="text-2xl font-bold text-foreground font-inter">
              Hi {displayName} 👋
            </h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => onNavigate("profile")} className="rounded-full hover:bg-card-soft">
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
              {/* ✨ Use fetched daily tip */}
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
                <button key={index} onClick={() => onNavigate("mood")} className="mood-indicator" title={['Very sad', 'Sad', 'Neutral', 'Happy', 'Very happy'][index]}>
                  {emoji}
                </button>
              ))}
            </div>
            <Button onClick={() => onNavigate("mood")} className="btn-gentle text-sm">
              Track Mood
            </Button>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <button key={action.id} onClick={action.action} className="card-mood p-4 text-left hover:scale-[1.02] transition-all duration-300 slide-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
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
              {/* ✨ Use calculated streak */}
              <p className="text-sm text-muted-foreground">{streak > 0 ? `${streak} days streak 🔥` : "Log your mood to start a streak!"}</p>
            </div>
            <Button variant="ghost" onClick={() => onNavigate("progress")} className="text-primary hover:text-primary-dark hover:bg-primary-light/20">
              <BarChart3 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Included for completeness as it was missing in the original file
const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0l1.5 4.5L18 6l-4.5 1.5L12 12l-1.5-4.5L6 6l4.5-1.5L12 0z" />
    <path d="M19 10l.75 2.25L22 13l-2.25.75L19 16l-.75-2.25L16 13l2.25-.75L19 10z" />
    <path d="M5 16l.5 1.5L7 18l-1.5.5L5 20l-.5-1.5L3 18l1.5-.5L5 16z" />
  </svg>
);

export default HomeDashboard;