// import { useState, useEffect } from "react";
// import { ArrowLeft, LogOut, FileText, Upload, ChevronRight } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { useToast } from "@/hooks/use-toast";

// // ✨ --- Firebase Imports --- ✨
// import { auth, db } from "@/lib/firebase";
// import { signOut } from "firebase/auth";
// import { collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

// interface ProfileSettingsProps {
//   onBack: () => void;
// }

// // Define a type for our mood entries for better code quality
// type MoodEntry = {
//   id: string;
//   moodLabel: string;
//   journalEntry: string;
//   createdAt: Date;
// };

// const ProfileSettings = ({ onBack }: ProfileSettingsProps) => {
//   const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();
  
//   const user = auth.currentUser;

//   // Fetch user's mood history when the component loads
//   useEffect(() => {
//     const fetchMoodHistory = async () => {
//       if (!user) {
//         setLoading(false);
//         return;
//       }
      
//       try {
//         const q = query(
//           collection(db, "moodEntries"),
//           where("userId", "==", user.uid),
//           orderBy("createdAt", "desc"),
//           limit(10) // Fetch the last 10 entries
//         );
//         const querySnapshot = await getDocs(q);
//         const history = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           moodLabel: doc.data().moodLabel,
//           journalEntry: doc.data().journalEntry,
//           createdAt: doc.data().createdAt.toDate(),
//         })) as MoodEntry[];
        
//         setMoodHistory(history);
//       } catch (error) {
//         console.error("Error fetching mood history:", error);
//         toast({ title: "Error", description: "Could not load your mood history.", variant: "destructive" });
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMoodHistory();
//   }, [user, toast]);

//   // Handle user sign-out
//   const handleSignOut = async () => {
//     try {
//       await signOut(auth);
//       toast({ title: "Signed Out", description: "You have been successfully signed out." });
//       // The parent component's auth listener will handle redirecting to the login screen.
//     } catch (error) {
//       toast({ title: "Error", description: "Failed to sign out.", variant: "destructive" });
//     }
//   };

//   const moodsConfig: { [key: string]: string } = {
//     "Very Sad": "😢", "Sad": "😟", "Neutral": "😐", "Happy": "😊", "Very Happy": "😁"
//   };

//   return (
//     <div className="min-h-screen bg-gradient-calm p-4">
//       <div className="max-w-md mx-auto space-y-6">
//         {/* Header */}
//         <div className="flex items-center gap-4 pt-8 pb-4">
//           <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full hover:bg-card-soft">
//             <ArrowLeft className="w-5 h-5" />
//           </Button>
//           <div>
//             <h1 className="text-xl font-semibold text-foreground font-inter">Profile & Settings</h1>
//             <p className="text-sm text-muted-foreground">{user?.email}</p>
//           </div>
//         </div>

//         {/* Mood History Section */}
//         <Card className="card-therapy">
//           <h3 className="font-semibold text-foreground mb-4">Recent Mood Entries</h3>
//           {loading ? (
//             <p className="text-muted-foreground text-sm">Loading history...</p>
//           ) : moodHistory.length > 0 ? (
//             <div className="space-y-3">
//               {moodHistory.map(entry => (
//                 <div key={entry.id} className="flex items-center gap-4 p-3 bg-card-soft rounded-lg">
//                   <div className="text-2xl">{moodsConfig[entry.moodLabel] || "📝"}</div>
//                   <div>
//                     <p className="font-medium text-foreground">
//                       {entry.moodLabel} - {entry.createdAt.toLocaleDateString()}
//                     </p>
//                     <p className="text-sm text-muted-foreground truncate">
//                       {entry.journalEntry || "No journal entry."}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-muted-foreground text-sm">No mood entries found.</p>
//           )}
//         </Card>

//         {/* Medical Reports Section */}
//         <Card className="card-therapy">
//           <h3 className="font-semibold text-foreground mb-4">Medical Reports</h3>
//           <p className="text-sm text-muted-foreground mb-4">
//             Store your reports securely. This feature is coming soon.
//           </p>
//           {/* Placeholder for report list */}
//           <button className="flex justify-between items-center w-full p-3 bg-card-soft rounded-lg text-left text-muted-foreground cursor-not-allowed opacity-50">
//             <div>
//               <p className="font-medium">Example_Report.pdf</p>
//               <p className="text-xs">Uploaded on 15 Sep 2025</p>
//             </div>
//             <ChevronRight className="w-5 h-5" />
//           </button>
//           <Button className="w-full mt-4" disabled>
//             <Upload className="w-4 h-4 mr-2" />
//             Upload New Report
//           </Button>
//         </Card>
        
//         {/* Sign Out Button */}
//         <Button onClick={handleSignOut} variant="destructive" className="w-full">
//           <LogOut className="w-4 h-4 mr-2" />
//           Sign Out
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ProfileSettings;


import { useState, useEffect, useRef } from "react";
import { ArrowLeft, LogOut, FileText, Upload, ChevronRight, Download, Paperclip, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils"; // Assuming you have a utility for classnames

// ✨ --- Firebase Imports --- ✨
import { auth, db, storage } from "@/lib/firebase"; // Import storage
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs, orderBy, limit, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface ProfileSettingsProps {
  onBack: () => void;
}

// Define a type for our data models for better code quality
type MoodEntry = {
  id: string;
  moodLabel: string;
  journalEntry: string;
  createdAt: Date;
};

type MedicalReport = {
  id: string;
  fileName: string;
  downloadURL: string;
  uploadedAt: Date;
};

const ProfileSettings = ({ onBack }: ProfileSettingsProps) => {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [medicalReports, setMedicalReports] = useState<MedicalReport[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);
  
  // States for the file dropzone
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const user = auth.currentUser;

  // Fetch all user data when the component loads
  useEffect(() => {
    if (!user) {
      setLoadingHistory(false);
      setLoadingReports(false);
      return;
    }

    const fetchMoodHistory = async () => {
      try {
        const q = query(
          collection(db, "moodEntries"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(10)
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
        setLoadingHistory(false);
      }
    };

    const fetchMedicalReports = async () => {
      try {
        const q = query(
            collection(db, "medicalReports"),
            where("userId", "==", user.uid),
            orderBy("uploadedAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const reports = querySnapshot.docs.map(doc => ({
            id: doc.id,
            fileName: doc.data().fileName,
            downloadURL: doc.data().downloadURL,
            uploadedAt: doc.data().uploadedAt.toDate(),
        })) as MedicalReport[];
        setMedicalReports(reports);
      } catch (error) {
          console.error("Error fetching medical reports:", error);
          toast({ title: "Error", description: "Could not load your reports.", variant: "destructive" });
      } finally {
          setLoadingReports(false);
      }
    };

    fetchMoodHistory();
    fetchMedicalReports();
  }, [user, toast]);

  // Handle user sign-out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({ title: "Signed Out", description: "You have been successfully signed out." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to sign out.", variant: "destructive" });
    }
  };

  // ✨ --- NEW: Export Mood History to CSV --- ✨
  const handleExportHistory = () => {
    if (moodHistory.length === 0) {
      toast({ title: "No History", description: "There are no mood entries to export." });
      return;
    }

    // Prepare CSV content
    const headers = "Date,Mood,Journal Entry\n";
    const rows = moodHistory.map(entry => {
      const date = entry.createdAt.toISOString().split('T')[0];
      const mood = entry.moodLabel;
      // Sanitize journal entry for CSV (wrap in quotes, escape existing quotes)
      const journal = `"${entry.journalEntry.replace(/"/g, '""')}"`;
      return [date, mood, journal].join(',');
    }).join('\n');

    const csvContent = headers + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a link to trigger the download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mood_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({ title: "Success", description: "Your mood history has been exported." });
  };
  
  // ✨ --- NEW: Handle File Upload --- ✨
  const handleFileUpload = (file: File | null) => {
    if (!file || !user) return;
    setIsUploading(true);

    // Create a storage reference with a unique path for each user and file
    const storagePath = `medicalReports/${user.uid}/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => { /* Can be used for progress indicators */ },
      (error) => {
        console.error("Upload error:", error);
        toast({ title: "Upload Failed", description: "There was an error uploading your file.", variant: "destructive" });
        setIsUploading(false);
      },
      () => {
        // Upload completed successfully, now get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          // Save file metadata to Firestore
          await addDoc(collection(db, "medicalReports"), {
            userId: user.uid,
            fileName: file.name,
            downloadURL: downloadURL,
            storagePath: storagePath, // Store path for potential deletion later
            fileType: file.type,
            uploadedAt: serverTimestamp(),
          });

          // Optimistically update UI
          const newReport: MedicalReport = {
            id: `temp-${Date.now()}`, // Temporary ID
            fileName: file.name,
            downloadURL: downloadURL,
            uploadedAt: new Date(),
          };
          setMedicalReports(prev => [newReport, ...prev]);

          toast({ title: "Success", description: `${file.name} has been uploaded.` });
          setIsUploading(false);
        }).catch(err => {
            console.error("Firestore error:", err);
            toast({ title: "Error", description: "Failed to save file details.", variant: "destructive" });
            setIsUploading(false);
        });
      }
    );
  };
  
  // Drag and drop event handlers
  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, action: 'over' | 'leave' | 'drop') => {
      e.preventDefault();
      e.stopPropagation();
      if (isUploading) return;

      if (action === 'over') setIsDragging(true);
      if (action === 'leave') setIsDragging(false);
      if (action === 'drop') {
          setIsDragging(false);
          const droppedFile = e.dataTransfer.files?.[0];
          if (droppedFile) {
              handleFileUpload(droppedFile);
          }
      }
  };

  const moodsConfig: { [key: string]: string } = {
    "Very Sad": "😢", "Sad": "😟", "Neutral": "😐", "Happy": "😊", "Very Happy": "😁"
  };

  return (
    <div className="min-h-screen bg-gradient-calm p-4">
      <div className="max-w-md mx-auto space-y-6 pb-12">
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
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-foreground">Recent Mood Entries</h3>
            <Button variant="outline" size="sm" onClick={handleExportHistory} disabled={moodHistory.length === 0}>
                <Download className="w-4 h-4 mr-2" />
                Export
            </Button>
          </div>
          {loadingHistory ? (
            <p className="text-muted-foreground text-sm">Loading history...</p>
          ) : moodHistory.length > 0 ? (
            <div className="space-y-3">
              {moodHistory.map(entry => (
                <div key={entry.id} className="flex items-center gap-4 p-3 bg-card-soft rounded-lg">
                  <div className="text-2xl">{moodsConfig[entry.moodLabel] || "📝"}</div>
                  <div>
                    <p className="font-medium text-foreground">{entry.moodLabel} - {entry.createdAt.toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground truncate">{entry.journalEntry || "No journal entry."}</p>
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
          
          {/* --- Dropzone UI --- */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.heic" // Specify accepted file types
          />
          <div
            onClick={() => !isUploading && fileInputRef.current?.click()}
            onDragOver={(e) => handleDragEvents(e, 'over')}
            onDragLeave={(e) => handleDragEvents(e, 'leave')}
            onDrop={(e) => handleDragEvents(e, 'drop')}
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              "border-muted-foreground/30 text-muted-foreground hover:border-primary/50 hover:text-primary",
              { "border-primary bg-primary/10": isDragging },
              { "cursor-not-allowed opacity-60": isUploading }
            )}
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p className="font-medium">Uploading...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-8 h-8" />
                <p className="font-medium">
                  <span className="text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs">PDF, PNG, JPG up to 10MB</p>
              </div>
            )}
          </div>

          {/* --- Reports List --- */}
          <div className="mt-4 space-y-2">
            {loadingReports ? (
              <p className="text-muted-foreground text-sm">Loading reports...</p>
            ) : medicalReports.length > 0 ? (
              medicalReports.map(report => (
                <a 
                  key={report.id}
                  href={report.downloadURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-between items-center w-full p-3 bg-card-soft rounded-lg text-left hover:bg-card-soft/80 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Paperclip className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground truncate">{report.fileName}</p>
                      <p className="text-xs text-muted-foreground">Uploaded on {report.uploadedAt.toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </a>
              ))
            ) : (
                <p className="text-center text-muted-foreground text-sm pt-2">No reports uploaded yet.</p>
            )}
          </div>
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