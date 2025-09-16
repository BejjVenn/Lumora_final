import { useState } from "react";
import { Heart, ArrowRight, Shield, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen = ({ onGetStarted }: WelcomeScreenProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      icon: <Heart className="w-16 h-16 text-primary" />,
      title: "Welcome to Lumora",
      subtitle: "Your personal mental wellness companion",
      description: "A safe space for your thoughts, feelings, and mental health journey."
    },
    {
      icon: <Shield className="w-16 h-16 text-accent" />,
      title: "Safe & Private",
      subtitle: "Your data stays secure",
      description: "Everything you share is encrypted and private. We never share your personal information."
    },
    {
      icon: <Sparkles className="w-16 h-16 text-secondary" />,
      title: "AI-Powered Support",
      subtitle: "Personalized guidance",
      description: "Get CBT-based coping strategies and empathetic responses tailored to your needs."
    },
    {
      icon: <Users className="w-16 h-16 text-primary" />,
      title: "Always Here for You",
      subtitle: "24/7 companion",
      description: "Whether you need to talk, reflect, or practice mindfulness - we're here anytime."
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onGetStarted();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="card-therapy text-center fade-in">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 shadow-therapy">
              <Heart className="w-10 h-10 text-white" fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold text-foreground font-inter">Lumora</h1>
          </div>

          {/* Slide Content */}
          <div className="mb-8 slide-up" key={currentSlide}>
            <div className="flex justify-center mb-6">
              {slides[currentSlide].icon}
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2 font-inter">
              {slides[currentSlide].title}
            </h2>
            <h3 className="text-lg text-primary font-medium mb-4">
              {slides[currentSlide].subtitle}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mb-8">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'bg-primary w-6' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="text-muted-foreground hover:text-foreground"
            >
              Previous
            </Button>
            
            <Button
              onClick={nextSlide}
              className="btn-therapy"
            >
              {currentSlide === slides.length - 1 ? (
                <>
                  Get Started
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-card-soft rounded-lg border border-border/50">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Important:</strong> Lumora is for wellness support, not medical advice. 
              If you're experiencing a mental health crisis, please contact emergency services or a mental health professional.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;