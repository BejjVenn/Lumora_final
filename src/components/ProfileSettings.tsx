import { useState, useEffect } from "react";
import { ArrowLeft, LogOut, FileText, Upload, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// ✨ --- Firebase Imports --- ✨
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

interface ProfileSettingsProps {
  onBack: () => void;
}

// Define a type for our mood entries for better code quality
type MoodEntry = {
  id: string;
  moodLabel: string;
  journalEntry: string;
  createdAt: Date;
};

const ProfileSettings = ({ onBack }: ProfileSettingsProps) => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const user = auth.currentUser;

  // Fetch user's mood history when the component loads
  useEffect(() => {
    const fetchMoodHistory = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        const q = query(
          collection(db, "moodEntries"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(10) // Fetch the last 10 entries
        );
        const querySnapshot = await getDocs(q);
        const history = querySnapshot.docs.map(doc => ({
          id: doc.id,
          moodLabel: doc.data().moodLabel,
          journalEntry: doc.data().journalEntry,
          createdAt: doc.data().createdAt.toDate(),
        })) as MoodEntry[];
        
        setMoodHistory(history);
      } catch (error) {
        console.error("Error fetching mood history:", error);
        toast({ title: "Error", description: "Could not load your mood history.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchMoodHistory();
  }, [user, toast]);

  // Handle user sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
      // The parent component's auth listener will handle redirecting to the login screen.
    } catch (error) {
      toast({ title: "Error", description: "Failed to sign out.", variant: "destructive" });
    }
  };

  const moodsConfig: { [key: string]: string } = {
    "Very Sad": "😢", "Sad": "😟", "Neutral": "😐", "Happy": "😊", "Very Happy": "😁"
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 pt-8 pb-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-card-soft">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground font-inter">Profile & Settings</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* Mood History Section */}
        <Card className="card-therapy">
          <h3 className="font-semibold text-foreground mb-4">Recent Mood Entries</h3>
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading history...</p>
          ) : moodHistory.length > 0 ? (
            <div className="space-y-3">
              {moodHistory.map(entry => (
                <div key={entry.id} className="flex items-center gap-4 p-3 bg-card-soft rounded-lg">
                  <div className="text-2xl">{moodsConfig[entry.moodLabel] || "📝"}</div>
                  <div>
                    <p className="font-medium text-foreground">
                      {entry.moodLabel} - {entry.createdAt.toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {entry.journalEntry || "No journal entry."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No mood entries found.</p>
          )}
        </Card>

        {/* Medical Reports Section */}
        <Card className="card-therapy">
          <h3 className="font-semibold text-foreground mb-4">Medical Reports</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Store your reports securely. This feature is coming soon.
          </p>
          {/* Placeholder for report list */}
          <button className="flex justify-between items-center w-full p-3 bg-card-soft rounded-lg text-left text-muted-foreground cursor-not-allowed opacity-50">
            <div>
              <p className="font-medium">Example_Report.pdf</p>
              <p className="text-xs">Uploaded on 15 Sep 2025</p>
            </div>
            <ChevronRight className="w-5 h-5" />
          </button>
          <Button className="w-full mt-4" disabled>
            <Upload className="w-4 h-4 mr-2" />
            Upload New Report
          </Button>
        </Card>
        
        {/* Sign Out Button */}
        <Button onClick={handleSignOut} variant="destructive" className="w-full">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default ProfileSettings;