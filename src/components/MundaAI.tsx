import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { RealtimeChat } from "@/utils/RealtimeAudio";
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Volume2,
  MessageSquare
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type Mode = "chat" | "voice";

const suggestedQuestions = [
  "What crops should I plant this season?",
  "How can I improve my credit score?",
  "What's the best market for my maize?",
  "How do I prevent crop diseases?",
  "Tell me about soil fertilization",
  "What insurance options do I have?"
];

export function MundaAI() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Jambo! I'm Múnda AI, your agricultural advisor. Ask me about crops, soil, weather, markets, loans, or insurance. You can also switch to voice mode for hands-free conversation."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Voice state
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const chatRef = useRef<RealtimeChat | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Chat handlers
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    setTimeout(() => {
      const responses: Record<string, string> = {
        "crop": "Based on your soil analysis showing good nitrogen levels (45%) and current weather patterns, I recommend planting:\n\n🌽 **Maize** - 92% suitability, optimal for your conditions\n🫘 **Beans** - 88% match, benefits from nitrogen fixing\n🍅 **Tomatoes** - 85% suitability, good for the temperature range\n🥬 **Cabbage** - 82% match, thrives in your climate\n\nWould you like detailed planting guides for any of these crops?",
        "credit": "Your agricultural credit score is influenced by these factors:\n\n📊 **Climate Resilience** - How well your farm handles weather changes\n📈 **Predicted Yield** - Expected harvest based on conditions\n⚡ **Farm Efficiency** - Resource utilization metrics\n💳 **Payment History** - Past loan repayment record\n🏠 **Farm Assets** - Equipment and land value\n\n**Tips to Improve:**\n• Install soil sensors (+30 points)\n• Get parametric insurance (+60 points)\n• Diversify crops (+25 points)",
        "market": "Current crop prices across markets:\n\n**Nairobi** (Best prices):\n• Maize: KES 55/kg ↑ 5%\n• Beans: KES 120/kg ↑ 3%\n• Tomatoes: KES 80/kg → stable\n\n**Mombasa**:\n• Maize: KES 52/kg\n• Beans: KES 115/kg\n\n**Nakuru**:\n• Maize: KES 48/kg\n• Beans: KES 110/kg\n\nBased on your location, Nairobi offers the best profit margin after transport costs. Would you like transport cost calculations?",
        "disease": "Common crop diseases in Kenya and prevention:\n\n🦠 **Maize Streak Virus**\n• Symptoms: Yellow streaks on leaves\n• Prevention: Use certified seeds, control leafhoppers\n\n🍂 **Bean Rust**\n• Symptoms: Orange pustules on leaves\n• Prevention: Rotate crops, remove infected plants\n\n🍅 **Tomato Blight**\n• Symptoms: Brown spots, wilting\n• Prevention: Proper spacing, avoid overhead watering\n\n**General Tips:**\n• Scout fields weekly\n• Practice crop rotation\n• Use integrated pest management (IPM)",
        "weather": "**Current Weather Conditions:**\n\n🌡️ Temperature: 24°C (comfortable)\n💧 Humidity: 65% (good for planting)\n💨 Wind: 12 km/h (light breeze)\n☁️ Condition: Partly Cloudy\n\n**7-Day Forecast:**\n• Tomorrow: Light rain expected - good for planting\n• Next 3 days: Sunny intervals\n• Weekend: Clear skies\n\n**Farming Advisory:**\nIdeal conditions for planting if you haven't started. The expected rain will help with seed germination.",
        "soil": "**Your Latest Soil Readings:**\n\n🟢 Nitrogen (N): 45% - Optimal\n🔵 Phosphorus (P): 32% - Moderate\n🟠 Potassium (K): 28% - Slightly low\n\n**pH Level:** 6.5 (ideal range)\n**Moisture:** 42%\n**Temperature:** 22°C\n\n**Recommendations:**\n• Apply DAP fertilizer at planting (50kg/acre)\n• Top-dress with CAN at knee-high stage for maize\n• Consider potash supplement for K levels\n• Use foliar feeds during flowering stage",
        "loan": "Based on your credit score, you qualify for:\n\n🏦 **KCB Bank**\n• Amount: Up to KES 500,000\n• Interest: 12% per annum\n• Term: 6-24 months\n\n🏦 **Equity Bank**\n• Amount: Up to KES 350,000\n• Interest: 13% per annum\n• Term: 6-18 months\n\n🏦 **AFC (Agricultural Finance Corporation)**\n• Amount: Up to KES 1,000,000\n• Interest: 10% per annum\n• Term: 12-60 months\n\nWould you like help applying for any of these loans?",
        "insurance": "**Recommended Insurance Options:**\n\n🛡️ **ACRE Africa - Index-Based**\n• Premium: KES 8,000/season\n• Coverage: KES 300,000\n• Triggers: Drought, excess rainfall\n• Payout: Automatic via M-Pesa\n\n🛡️ **APA Insurance - Crop Insurance**\n• Premium: KES 15,000/season\n• Coverage: KES 500,000\n• Covers: Pests, diseases, weather\n\n🛡️ **UAP Old Mutual - Multi-Peril**\n• Premium: KES 12,000/season\n• Coverage: KES 400,000\n• Comprehensive protection\n\nParametric insurance is recommended as payouts are automatic when thresholds are breached.",
        "fertilizer": "**Fertilizer Recommendations Based on Your Soil:**\n\n📍 **At Planting:**\n• DAP (18-46-0): 50kg/acre\n• Apply in furrows, 5cm from seeds\n\n📍 **Top Dressing (4-6 weeks):**\n• CAN (26-0-0): 50kg/acre\n• For maize: Apply at knee-high stage\n\n📍 **Foliar Application:**\n• NPK foliar feed during flowering\n• Apply early morning or late evening\n\n**Cost Estimate:**\n• DAP: ~KES 3,500/50kg bag\n• CAN: ~KES 2,800/50kg bag\n\n**Important:** Your potassium is low - consider adding Muriate of Potash (MOP) at 25kg/acre."
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
      } else if (lowerMessage.includes("weather") || lowerMessage.includes("rain") || lowerMessage.includes("forecast")) {
        response = responses["weather"];
      } else if (lowerMessage.includes("soil") || lowerMessage.includes("npk") || lowerMessage.includes("nutrient")) {
        response = responses["soil"];
      } else if (lowerMessage.includes("loan") || lowerMessage.includes("bank") || lowerMessage.includes("borrow") || lowerMessage.includes("finance")) {
        response = responses["loan"];
      } else if (lowerMessage.includes("insurance") || lowerMessage.includes("cover") || lowerMessage.includes("protect")) {
        response = responses["insurance"];
      } else if (lowerMessage.includes("fertilizer") || lowerMessage.includes("fertilize") || lowerMessage.includes("dap") || lowerMessage.includes("can")) {
        response = responses["fertilizer"];
      } else {
        response = "I can help you with:\n\n🌾 **Crops** - What to plant, when to plant\n🌍 **Soil** - NPK levels, pH, recommendations\n☀️ **Weather** - Forecasts, farming advisories\n💰 **Markets** - Prices, best selling locations\n📊 **Credit** - Your score, how to improve\n🏦 **Loans** - Available options, requirements\n🛡️ **Insurance** - Coverage, premiums, claims\n\nWhat would you like to know more about?";
      }

      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsLoading(false);
    }, 1200);
  };

  const handleSuggestion = (question: string) => {
    setInput(question);
  };

  // Voice handlers
  const handleVoiceMessage = (event: any) => {
    console.log('Voice event:', event.type);
    
    switch (event.type) {
      case 'response.audio.delta':
        setIsSpeaking(true);
        break;
      case 'response.audio.done':
        setIsSpeaking(false);
        break;
      case 'conversation.item.input_audio_transcription.completed':
        setTranscript(event.transcript || "");
        break;
      case 'response.audio_transcript.delta':
        setAiResponse(prev => prev + (event.delta || ""));
        break;
      case 'response.done':
        setAiResponse("");
        break;
    }
  };

  const startVoice = async () => {
    setIsConnecting(true);
    try {
      chatRef.current = new RealtimeChat(handleVoiceMessage);
      await chatRef.current.init();
      setIsConnected(true);
      
      toast({
        title: "Voice Connected",
        description: "Start speaking to Múnda AI",
      });
    } catch (error) {
      console.error('Error starting voice:', error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : 'Failed to connect voice',
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const endVoice = () => {
    chatRef.current?.disconnect();
    chatRef.current = null;
    setIsConnected(false);
    setIsSpeaking(false);
    setTranscript("");
    setAiResponse("");
  };

  const handleClose = () => {
    if (isConnected) {
      endVoice();
    }
    setIsOpen(false);
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg bg-gradient-to-br from-primary to-accent hover:shadow-xl transition-all hover:scale-105"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 z-50 w-[400px] h-[550px] flex flex-col shadow-2xl border-primary/20 bg-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <span className="font-semibold">Múnda AI</span>
          {isConnected && (
            <span className="text-xs bg-success px-2 py-0.5 rounded-full">Voice Active</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {/* Mode Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
            onClick={() => {
              if (isConnected) endVoice();
              setMode(mode === "chat" ? "voice" : "chat");
            }}
          >
            {mode === "chat" ? <Mic className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" 
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {mode === "chat" ? (
        <>
          {/* Chat Messages */}
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
                    : "bg-card border border-border rounded-tl-sm"
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4 text-secondary-foreground" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-tl-sm p-3">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 border-t bg-background">
              <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-1">
                {suggestedQuestions.slice(0, 4).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestion(q)}
                    className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="p-4 border-t bg-background rounded-b-lg">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about crops, weather, loans..."
                className="flex-1 px-4 py-2 rounded-full bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="icon" className="rounded-full" onClick={handleSend} disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        /* Voice Mode */
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-muted/30">
          {/* Voice Indicator */}
          <div className={`relative w-32 h-32 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
            isConnected 
              ? isSpeaking 
                ? 'bg-secondary/20 animate-pulse' 
                : 'bg-primary/20'
              : 'bg-muted'
          }`}>
            <div className={`absolute inset-2 rounded-full ${
              isConnected && isSpeaking ? 'bg-secondary/30 animate-ping' : ''
            }`} />
            {isConnecting ? (
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
            ) : isConnected ? (
              isSpeaking ? (
                <Volume2 className="w-12 h-12 text-secondary animate-pulse" />
              ) : (
                <Mic className="w-12 h-12 text-primary" />
              )
            ) : (
              <MicOff className="w-12 h-12 text-muted-foreground" />
            )}
          </div>

          {/* Status */}
          <p className="text-sm text-muted-foreground mb-4">
            {isConnecting 
              ? "Connecting to Múnda AI..." 
              : isConnected 
                ? isSpeaking 
                  ? "Múnda AI is speaking..." 
                  : "Listening... Speak now"
                : "Ready to connect"
            }
          </p>

          {/* Transcript */}
          {transcript && (
            <div className="w-full p-3 rounded-lg bg-muted/50 mb-4">
              <p className="text-xs text-muted-foreground mb-1">You said:</p>
              <p className="text-sm text-foreground">{transcript}</p>
            </div>
          )}

          {/* AI Response */}
          {aiResponse && (
            <div className="w-full p-3 rounded-lg bg-primary/5 border border-primary/20 mb-4">
              <p className="text-xs text-primary mb-1">Múnda AI:</p>
              <p className="text-sm text-foreground">{aiResponse}</p>
            </div>
          )}

          {/* Voice Controls */}
          <div className="flex gap-3 mt-auto">
            {!isConnected ? (
              <Button onClick={startVoice} disabled={isConnecting} className="px-8">
                {isConnecting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Phone className="w-4 h-4 mr-2" />
                )}
                Start Voice
              </Button>
            ) : (
              <Button onClick={endVoice} variant="destructive" className="px-8">
                <PhoneOff className="w-4 h-4 mr-2" />
                End Voice
              </Button>
            )}
          </div>

          <p className="text-xs text-center text-muted-foreground mt-4">
            Ask about crops, weather, loans, or farming tips
          </p>
        </div>
      )}
    </Card>
  );
}
