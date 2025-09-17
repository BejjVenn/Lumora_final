// // src/components/MoodTracking.tsx

// import { useState } from "react";
// import { ArrowLeft, Send, TrendingUp, Heart } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { useToast } from "@/hooks/use-toast";
// import { auth, db } from "@/lib/firebase";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// // ... (The rest of the complete MoodTracking component code) ...
// interface MoodTrackingProps {
//   onBack: () => void;
// }

// const MoodTracking = ({ onBack }: MoodTrackingProps) => {
//   const [selectedMood, setSelectedMood] = useState<number | null>(null);
//   const [journalEntry, setJournalEntry] = useState("");
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [loading, setLoading] = useState(false); // Add loading state for the button
//   const { toast } = useToast();

//   const moods = [
//     { emoji: "😢", label: "Very Sad", value: 1, color: "from-red-400 to-red-300", bgColor: "bg-red-50 hover:bg-red-100" },
//     { emoji: "😟", label: "Sad", value: 2, color: "from-orange-400 to-orange-300", bgColor: "bg-orange-50 hover:bg-orange-100" },
//     { emoji: "😐", label: "Neutral", value: 3, color: "from-yellow-400 to-yellow-300", bgColor: "bg-yellow-50 hover:bg-yellow-100" },
//     { emoji: "😊", label: "Happy", value: 4, color: "from-green-400 to-green-300", bgColor: "bg-green-50 hover:bg-green-100" },
//     { emoji: "😁", label: "Very Happy", value: 5, color: "from-emerald-400 to-emerald-300", bgColor: "bg-emerald-50 hover:bg-emerald-100" }
//   ];

//   // ✨ --- Updated handleSubmit with Firestore --- ✨
//   const handleSubmit = async () => {
//     if (selectedMood === null) return;

//     // 1. Get the current user
//     const user = auth.currentUser;
//     if (!user) {
//       toast({
//         title: "Not signed in",
//         description: "You must be logged in to track your mood.",
//         variant: "destructive",
//       });
//       return;
//     }

//     setLoading(true);

//     try {
//       // 2. Add a new document to the "moodEntries" collection
//       const moodData = {
//         userId: user.uid,
//         moodValue: selectedMood,
//         moodLabel: moods.find(m => m.value === selectedMood)?.label || "Unknown",
//         journalEntry: journalEntry,
//         createdAt: serverTimestamp(), // Use server timestamp for consistency
//       };
      
//       await addDoc(collection(db, "moodEntries"), moodData);
      
//       setIsSubmitted(true); // Show the success screen

//       // 3. Navigate back after a short delay
//       setTimeout(() => {
//         setIsSubmitted(false);
//         onBack();
//       }, 3000);

//     } catch (error: any) {
//       toast({
//         title: "Submission failed",
//         description: "Could not save your mood entry. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAIResponse = () => {
//     if (selectedMood === null) return "";
    
//     const responses = [
//       "I notice you're feeling quite low today. Remember, it's okay to have difficult days. Consider trying a breathing exercise or reaching out to someone you trust.",
//       "It sounds like you're going through a tough time. Your feelings are valid. Would you like to try some grounding techniques to help you feel more centered?",
//       "Thank you for sharing how you're feeling. Acknowledging your emotions is a healthy step. Let's explore some gentle ways to support your wellbeing today.",
//       "It's wonderful that you're feeling positive today! These good moments are important to celebrate. What's contributing to your happiness?",
//       "I'm so glad to see you're feeling great! Your positive energy is beautiful. Consider journaling about what's making you feel this way to remember for tougher days."
//     ];
    
//     return responses[selectedMood - 1];
//   };

//   if (isSubmitted) {
//     // --- No changes needed in the success screen JSX ---
//     return (
//       <div className="min-h-screen bg-gradient-therapy flex items-center justify-center p-4">
//         {/* ... (Success screen JSX remains the same) ... */}
//       </div>
//     );
//   }

//   // --- No major changes needed in the form JSX below, just the button's loading state ---
//   return (
//     <div className="min-h-screen bg-gradient-calm p-4">
//       <div className="max-w-md mx-auto">
//         {/* Header */}
//         <div className="flex items-center gap-4 pt-8 pb-6">
//             {/* ... (Header JSX remains the same) ... */}
//         </div>

//         {/* Mood Selection */}
//         <div className="card-therapy mb-6 slide-up">
//             {/* ... (Mood selection JSX remains the same) ... */}
//         </div>

//         {/* Journal Entry */}
//         <div className="card-therapy mb-6 slide-up" style={{ animationDelay: '0.1s' }}>
//             {/* ... (Journal entry JSX remains the same) ... */}
//         </div>

//         {/* Submit Button */}
//         <Button
//           onClick={handleSubmit}
//           disabled={selectedMood === null || loading} // Disable button while loading
//           className="w-full btn-therapy disabled:opacity-50 disabled:cursor-not-allowed slide-up"
//           style={{ animationDelay: '0.2s' }}
//         >
//           {loading ? (
//             <>
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//               Logging...
//             </>
//           ) : (
//             <>
//               <Send className="w-4 h-4 mr-2" />
//               Log My Mood
//             </>
//           )}
//         </Button>

//         {/* Encouragement */}
//         <div className="mt-6 text-center slide-up" style={{ animationDelay: '0.3s' }}>
//             {/* ... (Encouragement JSX remains the same) ... */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MoodTracking;
import { useState } from "react";
import { ArrowLeft, Send, TrendingUp, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface MoodTrackingProps {
  onBack: () => void;
}

const MoodTracking = ({ onBack }: MoodTrackingProps) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [journalEntry, setJournalEntry] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const moods = [
    { 
      emoji: "😢", 
      label: "Very Sad", 
      value: 1, 
      color: "from-red-400 to-red-300",
      bgColor: "bg-red-50 hover:bg-red-100"
    },
    { 
      emoji: "😟", 
      label: "Sad", 
      value: 2, 
      color: "from-orange-400 to-orange-300",
      bgColor: "bg-orange-50 hover:bg-orange-100"
    },
    { 
      emoji: "😐", 
      label: "Neutral", 
      value: 3, 
      color: "from-yellow-400 to-yellow-300",
      bgColor: "bg-yellow-50 hover:bg-yellow-100"
    },
    { 
      emoji: "😊", 
      label: "Happy", 
      value: 4, 
      color: "from-green-400 to-green-300",
      bgColor: "bg-green-50 hover:bg-green-100"
    },
    { 
      emoji: "😁", 
      label: "Very Happy", 
      value: 5, 
      color: "from-emerald-400 to-emerald-300",
      bgColor: "bg-emerald-50 hover:bg-emerald-100"
    }
  ];

  const handleSubmit = () => {
    if (selectedMood !== null) {
      // Here you would typically send data to your AI backend
      setIsSubmitted(true);
      
      // Simulate AI response after submission
      setTimeout(() => {
        setIsSubmitted(false);
        onBack(); // Navigate back to home
      }, 3000);
    }
  };

  const getAIResponse = () => {
    if (selectedMood === null) return "";
    
    const responses = [
      "I notice you're feeling quite low today. Remember, it's okay to have difficult days. Consider trying a breathing exercise or reaching out to someone you trust.",
      "It sounds like you're going through a tough time. Your feelings are valid. Would you like to try some grounding techniques to help you feel more centered?",
      "Thank you for sharing how you're feeling. It takes courage to acknowledge when we're not at our best. Let's explore some gentle ways to support your wellbeing today.",
      "It's wonderful that you're feeling positive today! These good moments are important to celebrate. What's contributing to your happiness?",
      "I'm so glad to see you're feeling great! Your positive energy is beautiful. Consider journaling about what's making you feel this way to remember for tougher days."
    ];
    
    return responses[selectedMood - 1];
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-therapy flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="card-therapy text-center fade-in">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Heart className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Thank you for sharing
            </h2>
            
            <div className="p-4 bg-card-soft rounded-lg border border-border/50 mb-6">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {getAIResponse()}
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 text-primary">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Mood logged successfully</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-calm p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8 pb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full hover:bg-card-soft"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground font-inter">
              How are you feeling?
            </h1>
            <p className="text-sm text-muted-foreground">
              Track your daily mood and emotions
            </p>
          </div>
        </div>

        {/* Mood Selection */}
        <div className="card-therapy mb-6 slide-up">
          <h3 className="font-semibold text-foreground mb-4">Select your mood</h3>
          <div className="grid grid-cols-5 gap-2">
            {moods.map((mood) => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`
                  p-3 rounded-xl border-2 transition-all duration-300 hover:scale-105
                  ${selectedMood === mood.value 
                    ? 'border-primary bg-primary/10 shadow-soft' 
                    : 'border-border hover:border-primary/50 bg-card'
                  }
                `}
              >
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className="text-xs text-muted-foreground font-medium">
                  {mood.label.split(' ')[0]}
                </div>
              </button>
            ))}
          </div>
          
          {selectedMood && (
            <div className="mt-4 p-3 bg-card-soft rounded-lg border border-border/50 fade-in">
              <p className="text-sm text-foreground font-medium">
                You selected: {moods.find(m => m.value === selectedMood)?.label}
              </p>
            </div>
          )}
        </div>

        {/* Journal Entry */}
        <div className="card-therapy mb-6 slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-semibold text-foreground mb-3">
            Want to share more? <span className="text-muted-foreground font-normal">(Optional)</span>
          </h3>
          <Textarea
            placeholder="What's on your mind today? How are you feeling? What happened?"
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
            className="min-h-[120px] resize-none border-border/50 focus:border-primary bg-card-soft"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Your thoughts are private and secure. Share as much or as little as you'd like.
          </p>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={selectedMood === null}
          className="w-full btn-therapy disabled:opacity-50 disabled:cursor-not-allowed slide-up"
          style={{ animationDelay: '0.2s' }}
        >
          <Send className="w-4 h-4 mr-2" />
          Log My Mood
        </Button>

        {/* Encouragement */}
        <div className="mt-6 text-center slide-up" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every feeling you have is valid. Thank you for taking time to check in with yourself today. 💙
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoodTracking;