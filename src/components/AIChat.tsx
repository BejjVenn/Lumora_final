import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Mic, MicOff, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  onBack: () => void;
}

const AIChat = ({ onBack }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm here to listen and support you. How are you feeling today? What's on your mind?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Simple response logic - in a real app this would be connected to an AI API
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      return "I hear that you're feeling sad right now, and I want you to know that your feelings are completely valid. It's okay to feel this way. Would you like to try a grounding exercise together, or would you prefer to talk about what's making you feel down?";
    }
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('stress')) {
      return "Anxiety can feel overwhelming, but you're not alone in this. One technique that might help is the 4-7-8 breathing method: breathe in for 4 counts, hold for 7, then exhale for 8. Would you like to try this together, or tell me more about what's causing your anxiety?";
    }
    
    if (lowerMessage.includes('happy') || lowerMessage.includes('good') || lowerMessage.includes('great')) {
      return "I'm so glad to hear you're feeling positive! It's wonderful when we can recognize and celebrate these good moments. What's contributing to your happiness today? Sharing positive experiences can help us remember them during tougher times.";
    }
    
    if (lowerMessage.includes('tired') || lowerMessage.includes('exhausted') || lowerMessage.includes('sleep')) {
      return "Feeling tired can really affect our mood and wellbeing. Are you getting enough rest? Sometimes when we're emotionally drained, it shows up as physical tiredness too. Would you like to talk about what might be contributing to your fatigue?";
    }
    
    if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
      return "I'm here to support you in whatever way I can. Whether you need someone to listen, want to explore coping strategies, or just need a safe space to express your thoughts - I'm here. What kind of support would feel most helpful right now?";
    }
    
    // Default empathetic responses
    const defaultResponses = [
      "Thank you for sharing that with me. Your feelings and experiences matter. Can you tell me more about what you're going through?",
      "I appreciate you opening up. It takes courage to share our thoughts and feelings. How has this been affecting you?",
      "I'm here to listen without judgment. Your experiences are valid, and I want to understand better. What would be most helpful for you right now?",
      "That sounds like a lot to handle. You're doing well by reaching out and talking about it. How are you taking care of yourself through this?",
      "I hear you. Sometimes just putting our thoughts into words can be helpful. What emotions are coming up for you as you think about this?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000); // 1.5-2.5 seconds delay
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // In a real app, this would handle voice recording
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputMessage("This would be the transcribed voice message...");
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-card/80 backdrop-blur-sm border-b border-border/50">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="rounded-full hover:bg-card-soft"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground font-inter">Lumora AI</h1>
            <p className="text-xs text-muted-foreground">
              Your wellness companion
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} fade-in`}
          >
            <div
              className={`
                max-w-[80%] p-3 rounded-2xl shadow-soft
                ${message.sender === 'user'
                  ? 'bg-primary text-primary-foreground ml-12'
                  : 'bg-card border border-border/50 mr-12'
                }
              `}
            >
              <p className="text-sm leading-relaxed">{message.text}</p>
              <p className={`text-xs mt-1 opacity-70 ${
                message.sender === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start fade-in">
            <div className="bg-card border border-border/50 p-3 rounded-2xl shadow-soft mr-12">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card/80 backdrop-blur-sm border-t border-border/50">
        <div className="flex items-center gap-2 max-w-md mx-auto">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="pr-12 bg-card-soft border-border/50 focus:border-primary rounded-full"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleRecording}
              className={`absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full w-8 h-8 ${
                isRecording ? 'text-destructive hover:text-destructive' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() && !isRecording}
            size="icon"
            className="rounded-full bg-primary hover:bg-primary-dark text-primary-foreground shadow-soft"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {isRecording && (
          <div className="mt-2 text-center">
            <p className="text-xs text-muted-foreground">
              🎤 Recording... Tap mic to stop
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIChat;