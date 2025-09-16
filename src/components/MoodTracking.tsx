// src/components/MoodTracking.tsx

import { useState } from "react";
import { ArrowLeft, Send, TrendingUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ... (The rest of the complete MoodTracking component code) ...
interface MoodTrackingProps {
  onBack: () => void;
}

const MoodTracking = ({ onBack }: MoodTrackingProps) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [journalEntry, setJournalEntry] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state for the button
  const { toast } = useToast();

  const moods = [
    { emoji: "😢", label: "Very Sad", value: 1, color: "from-red-400 to-red-300", bgColor: "bg-red-50 hover:bg-red-100" },
    { emoji: "😟", label: "Sad", value: 2, color: "from-orange-400 to-orange-300", bgColor: "bg-orange-50 hover:bg-orange-100" },
    { emoji: "😐", label: "Neutral", value: 3, color: "from-yellow-400 to-yellow-300", bgColor: "bg-yellow-50 hover:bg-yellow-100" },
    { emoji: "😊", label: "Happy", value: 4, color: "from-green-400 to-green-300", bgColor: "bg-green-50 hover:bg-green-100" },
    { emoji: "😁", label: "Very Happy", value: 5, color: "from-emerald-400 to-emerald-300", bgColor: "bg-emerald-50 hover:bg-emerald-100" }
  ];

  // ✨ --- Updated handleSubmit with Firestore --- ✨
  const handleSubmit = async () => {
    if (selectedMood === null) return;

    // 1. Get the current user
    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Not signed in",
        description: "You must be logged in to track your mood.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // 2. Add a new document to the "moodEntries" collection
      const moodData = {
        userId: user.uid,
        moodValue: selectedMood,
        moodLabel: moods.find(m => m.value === selectedMood)?.label || "Unknown",
        journalEntry: journalEntry,
        createdAt: serverTimestamp(), // Use server timestamp for consistency
      };
      
      await addDoc(collection(db, "moodEntries"), moodData);
      
      setIsSubmitted(true); // Show the success screen

      // 3. Navigate back after a short delay
      setTimeout(() => {
        setIsSubmitted(false);
        onBack();
      }, 3000);

    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: "Could not save your mood entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAIResponse = () => {
    if (selectedMood === null) return "";
    
    const responses = [
      "I notice you're feeling quite low today. Remember, it's okay to have difficult days. Consider trying a breathing exercise or reaching out to someone you trust.",
      "It sounds like you're going through a tough time. Your feelings are valid. Would you like to try some grounding techniques to help you feel more centered?",
      "Thank you for sharing how you're feeling. Acknowledging your emotions is a healthy step. Let's explore some gentle ways to support your wellbeing today.",
      "It's wonderful that you're feeling positive today! These good moments are important to celebrate. What's contributing to your happiness?",
      "I'm so glad to see you're feeling great! Your positive energy is beautiful. Consider journaling about what's making you feel this way to remember for tougher days."
    ];
    
    return responses[selectedMood - 1];
  };

  if (isSubmitted) {
    // --- No changes needed in the success screen JSX ---
    return (
      <div className="min-h-screen bg-gradient-therapy flex items-center justify-center p-4">
        {/* ... (Success screen JSX remains the same) ... */}
      </div>
    );
  }

  // --- No major changes needed in the form JSX below, just the button's loading state ---
  return (
    <div className="min-h-screen bg-gradient-calm p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8 pb-6">
            {/* ... (Header JSX remains the same) ... */}
        </div>

        {/* Mood Selection */}
        <div className="card-therapy mb-6 slide-up">
            {/* ... (Mood selection JSX remains the same) ... */}
        </div>

        {/* Journal Entry */}
        <div className="card-therapy mb-6 slide-up" style={{ animationDelay: '0.1s' }}>
            {/* ... (Journal entry JSX remains the same) ... */}
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={selectedMood === null || loading} // Disable button while loading
          className="w-full btn-therapy disabled:opacity-50 disabled:cursor-not-allowed slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Logging...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Log My Mood
            </>
          )}
        </Button>

        {/* Encouragement */}
        <div className="mt-6 text-center slide-up" style={{ animationDelay: '0.3s' }}>
            {/* ... (Encouragement JSX remains the same) ... */}
        </div>
      </div>
    </div>
  );
};

export default MoodTracking;