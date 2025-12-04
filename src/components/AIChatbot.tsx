import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Bot, User, Loader2, Minimize2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "What crops should I plant this season?",
  "How can I improve my credit score?",
  "What's the best market for my maize?",
  "How do I prevent crop diseases?"
];

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm Múnda AI, your agricultural advisor. How can I help you today? You can ask me about crops, soil, weather, markets, or credit scores."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response (would connect to Lovable AI in production)
    setTimeout(() => {
      const responses: Record<string, string> = {
        "crop": "Based on your soil analysis showing good nitrogen levels and current weather patterns, I recommend planting maize, beans, or tomatoes. Maize has a 92% suitability for your farm conditions.",
        "credit": "Your credit score is influenced by 5 factors: Climate Resilience, Predicted Yield, Farm Efficiency, Payment History, and Insurance Coverage. To improve, consider getting parametric insurance (+60 points) or installing soil sensors (+30 points).",
        "market": "Current maize prices are highest in Nairobi (KES 55/kg) followed by Mombasa (KES 52/kg). Based on your location, Nairobi offers the best profit margin after transport costs.",
        "disease": "Common crop diseases in Kenya include maize streak virus, bean rust, and tomato blight. Prevention tips: Use certified seeds, practice crop rotation, maintain proper spacing, and scout fields weekly.",
        "weather": "Current forecast shows partly cloudy conditions with 24°C temperature and 65% humidity. Light rain expected tomorrow - good for planting if you haven't started.",
        "soil": "Your latest soil readings show: Nitrogen 45%, Phosphorus 32%, Potassium 28%. Recommendation: Apply DAP fertilizer at planting and top-dress with CAN for optimal yields.",
        "loan": "Based on your credit score of 720, you qualify for loans from KCB (up to KES 500K at 12%), Equity Bank (KES 350K at 13%), and AFC (KES 1M at 10% for long-term).",
        "insurance": "Recommended insurance options: ACRE Africa (Index-Based, KES 8K premium, KES 300K coverage) or APA Insurance (Crop Insurance, KES 15K premium, KES 500K coverage)."
      };

      let response = "I understand you're asking about farming. ";
      const lowerMessage = userMessage.toLowerCase();
      
      if (lowerMessage.includes("crop") || lowerMessage.includes("plant")) {
        response = responses["crop"];
      } else if (lowerMessage.includes("credit") || lowerMessage.includes("score")) {
        response = responses["credit"];
      } else if (lowerMessage.includes("market") || lowerMessage.includes("price") || lowerMessage.includes("sell")) {
        response = responses["market"];
      } else if (lowerMessage.includes("disease") || lowerMessage.includes("pest")) {
        response = responses["disease"];
      } else if (lowerMessage.includes("weather") || lowerMessage.includes("rain")) {
        response = responses["weather"];
      } else if (lowerMessage.includes("soil") || lowerMessage.includes("fertilizer")) {
        response = responses["soil"];
      } else if (lowerMessage.includes("loan") || lowerMessage.includes("bank") || lowerMessage.includes("borrow")) {
        response = responses["loan"];
      } else if (lowerMessage.includes("insurance") || lowerMessage.includes("cover")) {
        response = responses["insurance"];
      } else {
        response = "I can help you with information about crops, soil testing, weather forecasts, market prices, credit scores, loans, and insurance. What would you like to know more about?";
      }

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSuggestion = (question: string) => {
    setInput(question);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full shadow-lg bg-primary hover:bg-primary/90"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-24 right-6 z-50 w-[380px] h-[500px] flex flex-col shadow-2xl border-primary/20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">Múnda AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsOpen(false)}>
            <Minimize2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${message.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}>
              {message.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-2xl ${
              message.role === "user" 
                ? "bg-primary text-primary-foreground rounded-tr-sm" 
                : "bg-card border rounded-tl-sm"
            }`}>
              <p className="text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Bot className="w-4 h-4 text-secondary-foreground" />
            </div>
            <div className="bg-card border rounded-2xl rounded-tl-sm p-3">
              <Loader2 className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 border-t bg-background">
          <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
          <div className="flex flex-wrap gap-1">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(q)}
                className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t bg-background rounded-b-lg">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask about crops, weather, markets..."
            className="flex-1 px-4 py-2 rounded-full bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button size="icon" className="rounded-full" onClick={handleSend} disabled={isLoading || !input.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
