import { useState, useCallback, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, Pause, Square, Play, Languages } from "lucide-react";

const SPEEDS = [0.75, 1, 1.25, 1.5];
const LANGUAGES: { code: string; label: string }[] = [
  { code: "hi-IN", label: "हिंदी" },
  { code: "en-US", label: "EN" },
];

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [lang, setLang] = useState("hi-IN");
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const sentencesRef = useRef<string[]>([]);
  const currentIdxRef = useRef(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const autoNextRef = useRef<(() => void) | null>(null);

  const splitSentences = (text: string): string[] => {
    const clean = text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    // Split on sentence boundaries
    return clean.split(/(?<=[।.!?])\s+/).filter((s) => s.trim().length > 0);
  };

  const speakSentence = useCallback((idx: number) => {
    if (idx >= sentencesRef.current.length) {
      // End of page — auto-continue to next page if callback set
      setIsPlaying(false);
      setIsPaused(false);
      setHighlightIndex(-1);
      if (autoNextRef.current) autoNextRef.current();
      return;
    }

    const utt = new SpeechSynthesisUtterance(sentencesRef.current[idx]);
    utt.rate = speed;
    utt.lang = lang;
    utt.onend = () => {
      currentIdxRef.current = idx + 1;
      speakSentence(idx + 1);
    };
    utt.onerror = () => { setIsPlaying(false); setIsPaused(false); setHighlightIndex(-1); };
    utteranceRef.current = utt;
    setHighlightIndex(idx);
    window.speechSynthesis.speak(utt);
  }, [speed, lang]);

  const speak = useCallback((text: string, onPageEnd?: () => void) => {
    window.speechSynthesis.cancel();
    const sentences = splitSentences(text);
    sentencesRef.current = sentences;
    currentIdxRef.current = 0;
    autoNextRef.current = onPageEnd || null;
    if (sentences.length === 0) return;
    setIsPlaying(true);
    setIsPaused(false);
    speakSentence(0);
  }, [speakSentence]);

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
    setHighlightIndex(-1);
    sentencesRef.current = [];
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeed((prev) => {
      const idx = SPEEDS.indexOf(prev);
      return SPEEDS[(idx + 1) % SPEEDS.length];
    });
  }, []);

  const cycleLang = useCallback(() => {
    setLang((prev) => {
      const idx = LANGUAGES.findIndex((l) => l.code === prev);
      return LANGUAGES[(idx + 1) % LANGUAGES.length].code;
    });
  }, []);

  useEffect(() => {
    return () => { window.speechSynthesis.cancel(); };
  }, []);

  const currentLangLabel = LANGUAGES.find((l) => l.code === lang)?.label || "EN";

  return {
    isPlaying, isPaused, speed, lang, highlightIndex, currentLangLabel,
    sentences: sentencesRef.current,
    speak, pause, resume, stop, cycleSpeed, cycleLang,
  };
}

export function TTSControls({
  isPlaying, isPaused, speed, langLabel,
  onPlay, onPause, onResume, onStop, onCycleSpeed, onCycleLang,
  darkMode,
}: {
  isPlaying: boolean;
  isPaused: boolean;
  speed: number;
  langLabel: string;
  onPlay: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onCycleSpeed: () => void;
  onCycleLang: () => void;
  darkMode: boolean;
}) {
  const btnColor = darkMode ? "hsl(36 44% 80%)" : undefined;
  const activeColor = "hsl(140 50% 50%)";

  if (!isPlaying) {
    return (
      <div className="flex items-center gap-0.5">
        <Button variant="ghost" size="icon" onClick={onPlay} className="h-8 w-8" title="Read Aloud" style={{ color: btnColor }}>
          <Volume2 className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onCycleLang} className="h-7 px-1.5 text-xs font-mono" title="Change language" style={{ color: btnColor }}>
          {langLabel}
        </Button>
      </div>
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
      <Button variant="ghost" size="sm" onClick={onCycleSpeed} className="h-7 px-1.5 text-xs font-mono" style={{ color: btnColor }}>
        {speed}x
      </Button>
      <Button variant="ghost" size="sm" onClick={onCycleLang} className="h-7 px-1.5 text-xs font-mono" title="Change language" style={{ color: btnColor }}>
        {langLabel}
      </Button>
    </div>
  );
}
