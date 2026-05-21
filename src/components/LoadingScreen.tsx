import { useState, useEffect } from 'react';
import { Sparkles, BrainCircuit } from 'lucide-react';

export default function LoadingScreen() {
  const [tipIndex, setTipIndex] = useState(0);
  const [statusText, setStatusText] = useState('Ingesting physiological metrics...');

  const loadingTips = [
    "Water accounts for nearly 60% of your body weight and is critical for calorie absorption.",
    "Protein has a high thermic effect—your body burns more energy digesting protein than fats or carbs.",
    "Sleeping less than 7 hours can trigger Ghrelin (the hunger hormone) and lower Leptin (satiety).",
    "Complex carbohydrates like quinoa and sweet potato release energy slowly, preventing glucose spikes.",
    "A caloric deficit of just 300-500 kcal per day is the healthiest and most sustainable rate for fat loss."
  ];

  const statusPhases = [
    "Reading physical profile details...",
    "Calculating Basal Metabolic Rate (BMR)...",
    "Running activity multiplier algorithms...",
    "Formulating optimal macro-nutrient distributions...",
    "Generating meal recipes using Gemini AI...",
    "Cross-checking safety and food allergens...",
    "Compiling goal tips and foods to avoid...",
    "Polishing layout... Almost ready!"
  ];

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % loadingTips.length);
    }, 2500);

    const statusInterval = setInterval(() => {
      setStatusText((prev) => {
        const currentIdx = statusPhases.indexOf(prev);
        if (currentIdx === -1 || currentIdx === statusPhases.length - 1) {
          return statusPhases[0];
        }
        return statusPhases[currentIdx + 1];
      });
    }, 1800);

    return () => {
      clearInterval(tipInterval);
      clearInterval(statusInterval);
    };
  }, [loadingTips.length, statusPhases]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100/10 shadow-2xl flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Animated Spin Ring */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Pulsing Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/10" />
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
          
          {/* Inner pulsating icon */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 pulse-ring">
            <BrainCircuit className="w-8 h-8" />
          </div>
        </div>

        {/* Action Header */}
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center justify-center gap-1.5">
            <Sparkles className="w-5 h-5 text-emerald-500 animate-pulse" />
            NutriMind AI at Work
          </h2>
          <p className="text-xs text-emerald-600 font-bold tracking-wide uppercase">
            {statusText}
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-slate-100 my-2" />

        {/* Ticker Health Card */}
        <div className="w-full bg-slate-50/60 border border-slate-100 p-5 rounded-2xl text-left">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            Did You Know?
          </span>
          <p className="text-slate-600 text-xs md:text-sm leading-relaxed transition-all duration-300 min-h-[48px]">
            "{loadingTips[tipIndex]}"
          </p>
        </div>

        {/* Informative text */}
        <p className="text-[10px] text-slate-400">
          Generating personalized plans takes about 3 to 8 seconds. Please do not close or reload this tab.
        </p>
      </div>
    </div>
  );
}
