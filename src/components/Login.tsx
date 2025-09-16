import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
// ✨ --- Firebase Imports --- ✨
import { auth } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from "firebase/auth";
import { Mail, Phone, Chrome, ArrowLeft } from "lucide-react";

interface LoginProps {
  onBack: () => void;
  onNavigateToRegister: () => void;
  onLoginSuccess: () => void;
}

const Login = ({ onBack, onNavigateToRegister, onLoginSuccess }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // ✨ --- Replaced with Firebase Email Auth --- ✨
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      
      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });
      onLoginSuccess();
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message.replace('Firebase: ', ''), // Clean up Firebase error messages
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✨ --- Replaced with Firebase Google Auth --- ✨
  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    
    try {
      await signInWithPopup(auth, provider);
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in with Google.",
      });
      onLoginSuccess();
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
  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // NOTE: Firebase phone auth requires a multi-step process with reCAPTCHA.
    // This is a placeholder to inform the user.
    toast({
      title: "Phone sign-in is coming soon!",
      description: "This feature is under development. Please use Email or Google.",
    });
    /* To implement Firebase Phone Auth, you would need to:
      1. Add a reCAPTCHA verifier to your UI (can be invisible).
      2. Call `signInWithPhoneNumber` to send the OTP.
      3. Update the UI to show an input field for the user to enter the OTP.
      4. Call the `confirmationResult.confirm(otp)` method to sign the user in.
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
          <h1 className="text-2xl font-bold gradient-text">Welcome Back</h1>
          <div className="w-9" /> {/* Spacer */}
        </div>

        <p className="text-center text-muted-foreground mb-8">
          Sign in to continue your wellness journey
        </p>

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

        {/* Google Login */}
        <Button
          onClick={handleGoogleLogin}
          variant="outline"
          className="w-full mb-4"
          disabled={loading}
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

        {/* Email Login Form */}
        {authMethod === "email" && (
          <form onSubmit={handleEmailLogin} className="space-y-4">
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
                placeholder="Enter your password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        )}

        {/* Phone Login Form */}
        {authMethod === "phone" && (
          <form onSubmit={handlePhoneLogin} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending code..." : "Send Verification Code"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <button
              onClick={onNavigateToRegister}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;