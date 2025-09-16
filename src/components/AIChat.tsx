import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send, Mic, MicOff, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleGenerativeAI, ChatSession, Part } from "@google/generative-ai";

// --- Type Definitions ---
interface Message {
  id: string;
  text: string | JSX.Element;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  onBack: () => void;
}

// --- API and Model Initialization (Secure) ---
const apiKey = "AIzaSyDzhRueGH0JhbHgFRdOa12-Jg_MwFEe4F8";
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in the environment variables");
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- Enhanced AI Persona and Instructions ---
const systemInstruction = {
  role: "system",
  parts: [{ text: `
    You are Lumora AI, a friendly and empathetic wellness companion. Your primary goal is to listen, provide support, and offer gentle guidance. Always respond with compassion and understanding. Do not give medical advice. Keep your responses concise (2-3 sentences) and caring.

    ---
    
    ## SPECIAL INSTRUCTIONS FOR HANDLING USER DISTRESS
    When a user expresses feelings of hopelessness, worthlessness, or deep sadness (e.g., "I hate my life," "nothing matters," "what's the point"), you MUST follow this three-step process:

    1.  **VALIDATE & LABEL THE FEELING:** Start by acknowledging the user's specific emotion. Use phrases like "It sounds like you're feeling a deep sense of hopelessness," or "That feeling of emptiness is incredibly heavy." This shows you're truly listening.

    2.  **INQUIRE GENTLY:** Ask a soft, open-ended question to encourage the user to share more. This makes them feel heard. Examples:
        - "Can you tell me a little more about what's bringing up this feeling right now?"
        - "When did you start feeling this way?"
        - "That sounds incredibly tough. What does that feeling of 'nothing matters' feel like in your body?"

    3.  **SUGGEST A SMALL, SHARED ACTION:** Propose a simple, immediate grounding technique. Frame it as something you can do "together." This moves the user from passively feeling bad to actively doing something small to help themselves. Examples:
        - "Let's try a simple exercise together, just for a moment. Can we try to slowly breathe in for a count of 4, and out for a count of 6? I'll do it with you."
        - "Before we talk more, let's ground ourselves. Can you look around the room and name just one thing you can see that is the color blue?"

    **Crucially, AVOID generic, dismissive reassurances like "Things will get better" or "You're not alone" until AFTER you have completed these steps. Focus on being present with their current feeling.**
  `}],
};


// --- Keyword Definitions ---
const crisisKeywords = ["suicide", "kill myself", "end my life", "want to die"];
const distressKeywords = [
    "hate my life", "don't want to live", "can't go on anymore",
    "no reason to live", "nothing matters", "what's the point",
    "I'm so empty", "feel numb"
];

// --- Static JSX Components ---
const CrisisResponse = () => (
    <div className="text-sm leading-relaxed">
        <p className="mb-3">
            I’m really sorry — I’m glad you told me. You’re not alone in this. I want to help you get safe right now.
        </p>
        <p className="mb-3">
            If you are in immediate danger or think you might act on these thoughts, please call your local emergency number right now: <strong>dial 112 in India</strong>. <a href="https://timesofindia.indiatimes.com/india" target="_blank" rel="noopener noreferrer" className="underline">The Times of India</a>
        </p>
        <p className="mb-2">
            Here are several places in India you can call or text right now to get someone trained to listen and help:
        </p>
        <ul className="list-disc pl-5 space-y-2 mb-3">
            <li><strong>Tele-MANAS (Govt. of India)</strong> — free 24/7 mental health counselling: call <a href="tel:14416" className="underline">14416</a>. <a href="https://telemanas.mohfw.gov.in/" target="_blank" rel="noopener noreferrer" className="underline">Telemanas</a></li>
            <li><strong>KIRAN (mental health helpline)</strong> — toll-free <a href="tel:1800-599-0019" className="underline">1800-599-0019</a>. <a href="https://www.pib.gov.in/pressreleaseshare.aspx?prid=1652240" target="_blank" rel="noopener noreferrer" className="underline">Press Information Bureau</a></li>
            <li><strong>iCALL (TISS)</strong> — phone <a href="tel:022-25521111" className="underline">022-25521111</a> or <a href="tel:9152987821" className="underline">9152987821</a>. <a href="https://tiss.ac.in/view/6/projects/icall-telephonic-counselling-service-for-individua/contact-us-6/" target="_blank" rel="noopener noreferrer" className="underline">iCALL Helpline</a></li>
            <li><strong>AASRA</strong> — suicide prevention and counselling. <a href="https://www.aasra.info/" target="_blank" rel="noopener noreferrer" className="underline">AASRA</a></li>
        </ul>
        <p>You deserve safety and care. I’m here with you.</p>
    </div>
);


// --- Main Component ---
const AIChat = ({ onBack }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi there! I'm Lumora, your wellness companion. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [chat, setChat] = useState<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = () => {
      const chatSession = model.startChat({
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
        systemInstruction: systemInstruction as { role: string, parts: Part[] },
        history: [],
      });
      setChat(chatSession);
    };
    initChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const checkForKeywords = (message: string, keywords: string[]): boolean => {
      const lowerCaseMessage = message.toLowerCase();
      return keywords.some(keyword => lowerCaseMessage.includes(keyword));
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    if (!chat) {
      return "I'm sorry, the chat session isn't initialized yet. Please wait a moment.";
    }
    try {
      const result = await chat.sendMessage(userMessage);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating AI response:", error);
      return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    let aiResponse: Message;

    if (checkForKeywords(currentInput, crisisKeywords)) {
        aiResponse = {
            id: (Date.now() + 1).toString(),
            text: <CrisisResponse />,
            sender: 'ai',
            timestamp: new Date()
        };
    } else {
        let messageToSend = currentInput;
        if (checkForKeywords(currentInput, distressKeywords)) {
            messageToSend = `
                User message: "${currentInput}"
                ---
                SYSTEM NOTE: The user has expressed high distress but is not in immediate crisis. 
                Activate the three-step process from your special instructions (VALIDATE, INQUIRE, SUGGEST ACTION) 
                to provide an empathetic and active response.
            `;
        }
        const aiText = await generateAIResponse(messageToSend);
        aiResponse = {
            id: (Date.now() + 1).toString(),
            text: aiText,
            sender: 'ai',
            timestamp: new Date()
        };
    }
    
    setMessages(prev => [...prev, aiResponse]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
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
              {typeof message.text === 'string' ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
              ) : (
                  message.text
              )}
              <p className={`text-xs mt-1 opacity-70 ${
                message.sender === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        
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
              disabled={isTyping}
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
            disabled={!inputMessage.trim() || isTyping}
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