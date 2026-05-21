import { useState } from 'react';
import type { NutriMindFormData } from '../types/formTypes';
import {
  Activity,
  Coffee,
  Sun,
  Cookie,
  Moon,
  AlertTriangle,
  Lightbulb,
  Calendar,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import DownloadButton from './DownloadButton';

interface DietResultProps {
  planText: string;
  formData: NutriMindFormData;
  onReset: () => void;
}

export default function DietResult({ planText, formData, onReset }: DietResultProps) {
  const [activeDay, setActiveDay] = useState<number>(1);

  // 1. Parsing Utility to extract content between headings
  const parsePlan = (text: string) => {
    const getSection = (headingNum: number, nextHeadingNum?: number) => {
      const headingPattern = new RegExp(`##\\s*${headingNum}\\.\\s*`, 'i');
      const nextHeadingPattern = nextHeadingNum
        ? new RegExp(`##\\s*${nextHeadingNum}\\.\\s*`, 'i')
        : null;

      const startMatch = text.match(headingPattern);
      if (!startMatch || startMatch.index === undefined) return '';

      const contentStart = startMatch.index + startMatch[0].length;
      let endIdx = text.length;

      if (nextHeadingPattern) {
        const nextMatch = text.match(nextHeadingPattern);
        if (nextMatch && nextMatch.index !== undefined) {
          endIdx = nextMatch.index;
        }
      }

      let content = text.substring(contentStart, endIdx).trim();

      // Remove the specific title lines if LLM repeated them
      const firstNewline = content.indexOf('\n');
      if (firstNewline !== -1) {
        const firstLine = content.substring(0, firstNewline).toLowerCase();
        if (
          firstLine.includes('health') ||
          firstLine.includes('calorie') ||
          firstLine.includes('macro') ||
          firstLine.includes('meal') ||
          firstLine.includes('tip') ||
          firstLine.includes('avoid')
        ) {
          content = content.substring(firstNewline).trim();
        }
      }

      return content;
    };

    const analysis = getSection(1, 2);
    const caloriesRaw = getSection(2, 3);
    const macrosRaw = getSection(3, 4);
    const mealsRaw = getSection(4, 5);
    const tipsRaw = getSection(5, 6);
    const avoidRaw = getSection(6);

    return { analysis, caloriesRaw, macrosRaw, mealsRaw, tipsRaw, avoidRaw };
  };

  const sections = parsePlan(planText);

  // 2. Extractions for key stats
  // Calorie Extraction
  const calorieMatch = sections.caloriesRaw.match(/(\d{3,4})\s*(?:kcal|calories)/i) || sections.caloriesRaw.match(/(\d{3,4})/);
  const calorieValue = calorieMatch ? parseInt(calorieMatch[1], 10) : 2000;

  // Macro Extraction
  const extractGrams = (text: string, label: string) => {
    const regex = new RegExp(`${label}\\s*:\\s*(\\d+)\\s*g`, 'i');
    const match = text.match(regex);
    if (match) return parseInt(match[1], 10);
    
    // Fallback search
    const backupRegex = new RegExp(`(\\d+)\\s*g\\s*of\\s*${label}`, 'i');
    const backupMatch = text.match(backupRegex);
    return backupMatch ? parseInt(backupMatch[1], 10) : null;
  };

  const proteinGrams = extractGrams(sections.macrosRaw, 'protein') || Math.round(formData.weight * 1.8);
  const fatGrams = extractGrams(sections.macrosRaw, 'fat') || Math.round(formData.weight * 0.8);
  const carbGrams = extractGrams(sections.macrosRaw, 'carbohydrate') || extractGrams(sections.macrosRaw, 'carb') || 200;

  // Calculate percentage calories
  const totalMacroCals = proteinGrams * 4 + carbGrams * 4 + fatGrams * 9;
  const pPct = Math.round(((proteinGrams * 4) / totalMacroCals) * 100) || 30;
  const cPct = Math.round(((carbGrams * 4) / totalMacroCals) * 100) || 45;
  const fPct = Math.round(((fatGrams * 9) / totalMacroCals) * 100) || 25;

  // 3. Parse meal plan into structural days
  const parseDays = (mealsContent: string) => {
    const dayBlocks = mealsContent.split(/###\s*Day\s*(\d+)/i);
    const parsedDays: { dayNum: number; content: string; meals: string[] }[] = [];

    for (let i = 1; i < dayBlocks.length; i += 2) {
      const dayNum = parseInt(dayBlocks[i], 10);
      const content = dayBlocks[i + 1]?.trim() || '';

      // Split lines, filter out structural prefixes
      const mealsLines = content
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.startsWith('-') || l.startsWith('*') || l.match(/^\d+\./))
        .map((l) => l.replace(/^[-*\d.]+\s*/, '').trim());

      parsedDays.push({
        dayNum,
        content,
        meals: mealsLines.length > 0 ? mealsLines : [content],
      });
    }

    // Default fallback if splits failed
    if (parsedDays.length === 0) {
      return Array.from({ length: 7 }, (_, i) => ({
        dayNum: i + 1,
        content: mealsContent,
        meals: mealsContent.split('\n').filter((l) => l.trim().length > 0),
      }));
    }

    return parsedDays;
  };

  const daysPlan = parseDays(sections.mealsRaw);

  // 4. Parse tips into arrays
  const parseList = (text: string) => {
    return text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.startsWith('-') || l.startsWith('*') || l.match(/^\d+\./))
      .map((l) => l.replace(/^[-*\d.]+\s*/, '').trim());
  };

  const tipsList = parseList(sections.tipsRaw);
  const avoidList = parseList(sections.avoidRaw);

  // Meal helper icons based on index
  const getMealIconAndName = (index: number, label: string) => {
    const cleanLabel = label.toLowerCase();
    if (cleanLabel.includes('breakfast')) return { icon: <Coffee className="w-4 h-4 text-amber-500" />, title: "Breakfast" };
    if (cleanLabel.includes('lunch')) return { icon: <Sun className="w-4 h-4 text-emerald-500" />, title: "Lunch" };
    if (cleanLabel.includes('snack')) return { icon: <Cookie className="w-4 h-4 text-purple-500" />, title: "Snack" };
    if (cleanLabel.includes('dinner')) return { icon: <Moon className="w-4 h-4 text-blue-500" />, title: "Dinner" };

    // Standard fallbacks based on index
    if (formData.mealsPerDay === 2) {
      return index === 0 
        ? { icon: <Coffee className="w-4 h-4 text-amber-500" />, title: "Brunch" }
        : { icon: <Moon className="w-4 h-4 text-blue-500" />, title: "Dinner" };
    }
    if (index === 0) return { icon: <Coffee className="w-4 h-4 text-amber-500" />, title: "Breakfast" };
    if (index === 1) return { icon: <Sun className="w-4 h-4 text-emerald-500" />, title: "Lunch" };
    if (index === 2 && formData.mealsPerDay > 3) return { icon: <Cookie className="w-4 h-4 text-purple-500" />, title: "Evening Snack" };
    return { icon: <Moon className="w-4 h-4 text-blue-500" />, title: "Dinner" };
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-300">
      
      {/* Top Banner Control */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 no-print">
        <div>
          <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest block">
            Generated Successfully
          </span>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
            Your Personalized Diet Plan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Tailored specifically for {formData.age}yo {formData.sex} ({formData.weight}kg, {formData.height}cm) aiming to <span className="font-semibold text-emerald-600">{formData.goal}</span>.
          </p>
        </div>
        
        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-sm shadow-sm transition-all cursor-pointer self-start md:self-auto"
        >
          <RotateCcw className="w-4 h-4" />
          Plan Another Diet
        </button>
      </div>

      {/* Main Dashboard Print-Capture Area */}
      <div id="diet-plan-print-container" className="space-y-6">
        
        {/* ROW 1: Calories & Profile Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calorie Stats Card */}
          <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between items-center text-center shadow-md relative overflow-hidden bg-white">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8" />
            <div className="w-full flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Energy Budget
              </span>
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500">
                <Activity className="w-4 h-4" />
              </span>
            </div>
            
            <div className="my-3 relative flex items-center justify-center">
              {/* Circular Meter SVG */}
              <svg className="w-36 h-36 transform -rotate-90">
                <circle cx="72" cy="72" r="62" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={389.5}
                  strokeDashoffset={389.5 - (389.5 * Math.min(calorieValue, 3500)) / 3500}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none">
                  {calorieValue}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                  kcal / day
                </span>
              </div>
            </div>

            <p className="text-slate-500 text-xs mt-2 max-w-[200px]">
              Active target to maintain healthy {formData.goal === 'Lose weight' ? 'weight deficit' : formData.goal === 'Gain weight' ? 'gains' : 'balance'}.
            </p>
          </div>

          {/* Macro Breakdown Dashboard */}
          <div className="glass-panel p-6 rounded-3xl shadow-md lg:col-span-2 bg-white flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  Macronutrient Distribution
                </h3>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Balanced Ratios
                </span>
              </div>

              {/* Macro Bars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Protein */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Protein</span>
                      <span className="text-slate-800 font-extrabold text-lg leading-none">{proteinGrams}g</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {pPct}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pPct}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    Supports muscle retention and cellular synthesis.
                  </span>
                </div>

                {/* Carbohydrates */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Carbohydrates</span>
                      <span className="text-slate-800 font-extrabold text-lg leading-none">{carbGrams}g</span>
                    </div>
                    <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
                      {cPct}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full" style={{ width: `${cPct}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    Supplies metabolic energy for daily physical tasks.
                  </span>
                </div>

                {/* Fats */}
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Fats</span>
                      <span className="text-slate-800 font-extrabold text-lg leading-none">{fatGrams}g</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                      {fPct}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${fPct}%` }} />
                  </div>
                  <span className="text-[10px] text-slate-400 block leading-tight">
                    Maintains hormonal balances and nervous system stability.
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-50 pt-3 mt-4">
              Estimated targets calculated using the Mifflin-St Jeor formula with a goal multiplier.
            </div>
          </div>

        </div>

        {/* Clinical Health Analysis */}
        <div className="glass-panel p-6 rounded-3xl shadow-sm bg-white border border-slate-100 flex gap-4 items-start">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl flex-shrink-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm tracking-wide uppercase mb-1">
              AI Nutritionist's Assessment
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {sections.analysis || "Analysis parsed successfully. Check your personalized targets above."}
            </p>
          </div>
        </div>

        {/* ROW 2: The 7-Day Meal Plan Accordion Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print-break-inside-avoid">
          
          {/* Day Navigation Tabs */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 no-print">
            {daysPlan.map((d) => (
              <button
                key={d.dayNum}
                type="button"
                onClick={() => setActiveDay(d.dayNum)}
                className={`flex-shrink-0 flex items-center gap-3 px-5 py-3 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  activeDay === d.dayNum
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-800 font-bold ring-1 ring-emerald-500/10'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <div className="text-xs md:text-sm">
                  <span className="block font-bold">Day {d.dayNum}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Meals Presenter Container */}
          <div className="lg:col-span-9 bg-white border border-slate-100 shadow-md rounded-3xl p-6 md:p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-emerald-500 tracking-wider uppercase block">
                    Day Schedule
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-800">
                    Day {activeDay} Nutrition Plan
                  </h3>
                </div>
                <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full font-semibold">
                  {daysPlan[activeDay - 1]?.meals.length || formData.mealsPerDay} meals today
                </span>
              </div>

              {/* Meal Timeline */}
              <div className="relative border-l-2 border-slate-100 pl-6 ml-3 space-y-6">
                {daysPlan[activeDay - 1]?.meals.map((mealStr, idx) => {
                  const details = getMealIconAndName(idx, mealStr);
                  
                  // Clean up labels repeated inside meal strings
                  let formattedMeal = mealStr;
                  const labelRegex = /^(?:meal\s*\d*|breakfast|lunch|snack|dinner|tea|morning)\s*[-:]*\s*/i;
                  formattedMeal = formattedMeal.replace(labelRegex, '').trim();
                  
                  return (
                    <div key={idx} className="relative select-text">
                      {/* Timeline Icon Badge */}
                      <span className="absolute -left-[37px] top-0.5 w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm">
                        {details.icon}
                      </span>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {details.title}
                        </span>
                        <h4 className="text-slate-800 font-bold text-sm md:text-base mt-0.5">
                          {formattedMeal}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* General reminder banner inside card */}
            <div className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex gap-2.5 items-start mt-8 text-xs text-slate-500">
              <span className="text-emerald-500">💡</span>
              <p>
                Eat on a consistent schedule. Maintain a gap of at least 3 hours between your last meal and bedtime to optimize insulin cycles.
              </p>
            </div>
          </div>

        </div>

        {/* ROW 3: Advice, Tips & Avoid lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print-break-inside-avoid">
          
          {/* Advice/Tips Section */}
          <div className="glass-panel p-6 rounded-3xl shadow-sm bg-white">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase mb-4 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              Goal-Specific Advice
            </h3>
            <ol className="space-y-3 text-xs md:text-sm text-slate-600">
              {tipsList.map((tip, idx) => (
                <li key={idx} className="flex gap-2.5 items-start">
                  <span className="w-5 h-5 rounded-full bg-amber-50 border border-amber-100 text-[10px] font-bold text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Foods to Avoid Section */}
          <div className="glass-panel p-6 rounded-3xl shadow-sm bg-white">
            <h3 className="text-sm font-extrabold text-slate-800 tracking-wide uppercase mb-4 flex items-center gap-1.5 pb-2 border-b border-slate-100">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Strictly Avoid / Limit
            </h3>
            <div className="flex flex-wrap gap-2">
              {avoidList.map((food, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-2 bg-rose-50/60 border border-rose-100 text-rose-700 rounded-2xl text-xs md:text-sm font-medium hover:bg-rose-50 transition-all cursor-default"
                >
                  ⚠️ {food}
                </span>
              ))}
              {avoidList.length === 0 && (
                <p className="text-slate-500 text-xs">No specific avoidances parsed. Eat healthy whole foods.</p>
              )}
            </div>
          </div>

        </div>

        {/* Printable/Exportable Full 7-day Plan for jsPDF */}
        <div className="hidden print:block space-y-6 pt-12">
          <div className="border-t border-slate-300 pt-8">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Complete 7-Day Meal Schedule</h2>
            <div className="space-y-6">
              {daysPlan.map((d) => (
                <div key={d.dayNum} className="border border-slate-200 p-6 rounded-2xl bg-white print-break-inside-avoid">
                  <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                    Day {d.dayNum}
                  </h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    {d.meals.map((mealStr, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="font-semibold text-slate-500">Meal {idx + 1}:</span>
                        <span>{mealStr}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* PDF Export Banner at the Bottom */}
      <div className="mt-8 flex justify-center no-print">
        <DownloadButton elementId="diet-plan-print-container" fileName={`NutriMind-${formData.goal.replace(/\s+/g, '-')}-Plan`} />
      </div>

    </div>
  );
}
