import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { RealtimeChat } from "@/utils/RealtimeAudio";
import { Mic, MicOff, Phone, PhoneOff, Volume2, Loader2, MessageCircle } from "lucide-react";

interface VoiceBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceBot({ isOpen, onClose }: VoiceBotProps) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const chatRef = useRef<RealtimeChat | null>(null);

  const handleMessage = (event: any) => {
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
      case 'response.audio_transcript.done':
        // Response complete
        break;
      case 'response.done':
        setAiResponse("");
        break;
    }
  };

  const startConversation = async () => {
    setIsConnecting(true);
    try {
      chatRef.current = new RealtimeChat(handleMessage);
      await chatRef.current.init();
      setIsConnected(true);
      
      toast({
        title: "Connected to Múnda AI",
        description: "Start speaking to get farming advice",
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : 'Failed to connect',
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const endConversation = () => {
    chatRef.current?.disconnect();
    chatRef.current = null;
    setIsConnected(false);
    setIsSpeaking(false);
    setTranscript("");
    setAiResponse("");
  };

  useEffect(() => {
    return () => {
      chatRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isOpen && isConnected) {
      endConversation();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 p-6 rounded-2xl bg-card border border-border shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">Múnda AI Voice</h2>
              <p className="text-xs text-muted-foreground">Agricultural Advisor</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Status Display */}
        <div className="flex flex-col items-center py-8">
          {/* Animated Voice Indicator */}
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

          {/* Status Text */}
          <p className="text-sm text-muted-foreground mb-2">
            {isConnecting 
              ? "Connecting to Múnda AI..." 
              : isConnected 
                ? isSpeaking 
                  ? "Múnda AI is speaking..." 
                  : "Listening... Speak now"
                : "Ready to connect"
            }
          </p>

          {/* Live Transcript */}
          {transcript && (
            <div className="w-full p-3 rounded-lg bg-muted/50 mb-4">
              <p className="text-xs text-muted-foreground mb-1">You said:</p>
              <p className="text-sm text-foreground">{transcript}</p>
            </div>
          )}

          {/* AI Response */}
          {aiResponse && (
            <div className="w-full p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs text-primary mb-1">Múnda AI:</p>
              <p className="text-sm text-foreground">{aiResponse}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {!isConnected ? (
            <Button 
              onClick={startConversation}
              disabled={isConnecting}
              className="flex-1"
            >
              {isConnecting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Phone className="w-4 h-4 mr-2" />
              )}
              Start Conversation
            </Button>
          ) : (
            <Button 
              onClick={endConversation}
              variant="destructive"
              className="flex-1"
            >
              <PhoneOff className="w-4 h-4 mr-2" />
              End Conversation
            </Button>
          )}
        </div>

        {/* Help Text */}
        <p className="text-xs text-center text-muted-foreground mt-4">
          Ask about crop prices, weather, loans, or farming tips
        </p>
      </div>
    </div>
  );
}