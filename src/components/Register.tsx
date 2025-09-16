import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
// ✨ --- Firebase Imports --- ✨
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore"; 

import { Mail, Phone, Chrome, ArrowLeft, User } from "lucide-react";

interface RegisterProps {
  onBack: () => void;
  onNavigateToLogin: () => void;
  onRegisterSuccess: () => void;
}

const Register = ({ onBack, onNavigateToLogin, onRegisterSuccess }: RegisterProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // ✨ --- Replaced with Firebase Email Auth --- ✨
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({ title: "Password mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters long.", variant: "destructive" });
      return;
    }

    setLoading(true);
    
    try {
      // 1. Create the user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Update the user's profile with their full name
      await updateProfile(user, { displayName: fullName });

      // 3. Create a document in Firestore to store additional user info
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        fullName: fullName,
        email: email,
        createdAt: serverTimestamp(),
      });

      toast({ title: "Account created!", description: "You have been successfully registered." });
      onRegisterSuccess();
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message.replace('Firebase: ', ''), // Clean up Firebase error messages
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✨ --- Replaced with Firebase Google Auth --- ✨
  const handleGoogleRegister = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create a Firestore document for the new Google user
      // setDoc is used to either create a new doc or update an existing one
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username, // From the form state
        fullName: user.displayName, // From the Google profile
        email: user.email,
        createdAt: serverTimestamp(),
      }, { merge: true }); // Use merge to avoid overwriting data if user already exists

      toast({ title: "Signed in with Google!", description: "Welcome to Lumora." });
      onRegisterSuccess();
    } catch (error: any) {
      toast({
        title: "Google Sign-In failed",
        description: error.message.replace('Firebase: ', ''),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✨ --- Updated Phone Auth Stub --- ✨
  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // NOTE: Firebase phone auth requires a multi-step process with reCAPTCHA.
    // This is a placeholder to inform the user.
    toast({
      title: "Phone sign-up is coming soon!",
      description: "This feature is under development. Please use Email or Google to register.",
      variant: "default",
    });
    /* Firebase Phone Auth Steps:
      1. Set up a reCAPTCHA verifier on this page.
      2. Call `signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)`.
      3. This returns a confirmation result. Show a new input field for the OTP code.
      4. Call `confirmationResult.confirm(otpCode)` to sign the user in.
    */
  };

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
      <Card className="card-therapy w-full max-w-md p-6">
        {/* --- No changes needed in the JSX below this line --- */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold gradient-text">Join Lumora</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>

        <p className="text-center text-muted-foreground mb-8">
          Start your mental wellness journey today
        </p>

        {/* Profile Information */}
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              required
            />
          </div>
        </div>

        {/* Auth Method Selector */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={authMethod === "email" ? "default" : "outline"}
            size="sm"
            onClick={() => setAuthMethod("email")}
            className="flex-1"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button
            variant={authMethod === "phone" ? "default" : "outline"}
            size="sm"
            onClick={() => setAuthMethod("phone")}
            className="flex-1"
          >
            <Phone className="h-4 w-4 mr-2" />
            Phone
          </Button>
        </div>

        {/* Google Register */}
        <Button
          onClick={handleGoogleRegister}
          variant="outline"
          className="w-full mb-4"
          disabled={loading || !username || !fullName}
        >
          <Chrome className="h-4 w-4 mr-2" />
          Continue with Google
        </Button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {/* Email Register Form */}
        {authMethod === "email" && (
          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        )}

        {/* Phone Register Form */}
        {authMethod === "phone" && (
          <form onSubmit={handlePhoneRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 12345 67890"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phonePassword">Password</Label>
              <Input
                id="phonePassword"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Continue with Phone"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={onNavigateToLogin}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Register;