import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Pause, Square, Play } from "lucide-react";

interface TextToSpeechProps {
  text: string;
  darkMode: boolean;
}

const SPEEDS = [0.75, 1, 1.25, 1.5];

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speak = useCallback((text: string) => {
    window.speechSynthesis.cancel();
    // Strip HTML tags
    const clean = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    if (!clean) return;

    const utt = new SpeechSynthesisUtterance(clean);
    utt.rate = speed;
    utt.onend = () => { setIsPlaying(false); setIsPaused(false); };
    utt.onerror = () => { setIsPlaying(false); setIsPaused(false); };
    utteranceRef.current = utt;
    window.speechSynthesis.speak(utt);
    setIsPlaying(true);
    setIsPaused(false);
  }, [speed]);

  const pause = useCallback(() => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeed((prev) => {
      const idx = SPEEDS.indexOf(prev);
      return SPEEDS[(idx + 1) % SPEEDS.length];
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  return { isPlaying, isPaused, speed, speak, pause, resume, stop, cycleSpeed };
}

export function TTSControls({
  isPlaying,
  isPaused,
  speed,
  onPlay,
  onPause,
  onResume,
  onStop,
  onCycleSpeed,
  darkMode,
}: {
  isPlaying: boolean;
  isPaused: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onCycleSpeed: () => void;
  darkMode: boolean;
}) {
  const btnColor = darkMode ? "hsl(36 44% 80%)" : undefined;
  const activeColor = "hsl(140 50% 50%)";

  if (!isPlaying) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={onPlay}
        className="h-8 w-8"
        title="Read Aloud"
        style={{ color: btnColor }}
      >
        <Volume2 className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {isPaused ? (
        <Button variant="ghost" size="icon" onClick={onResume} className="h-7 w-7" style={{ color: activeColor }}>
          <Play className="w-3.5 h-3.5" />
        </Button>
      ) : (
        <Button variant="ghost" size="icon" onClick={onPause} className="h-7 w-7" style={{ color: activeColor }}>
          <Pause className="w-3.5 h-3.5" />
        </Button>
      )}
      <Button variant="ghost" size="icon" onClick={onStop} className="h-7 w-7" style={{ color: btnColor }}>
        <Square className="w-3 h-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCycleSpeed}
        className="h-7 px-1.5 text-xs font-mono"
        style={{ color: btnColor }}
      >
        {speed}x
      </Button>
    </div>
  );
}
