import React from 'react';
import { ChevronLeft, ChevronRight, Settings, Heart } from 'lucide-react';

interface FormShellProps {
  currentStepIndex: number;
  progressPercent: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onBack: () => void;
  children: React.ReactNode;
  stepNames: string[];
  onOpenSettings: () => void;
}

export default function FormShell({
  currentStepIndex,
  progressPercent,
  isFirstStep,
  isLastStep,
  onNext,
  onBack,
  children,
  stepNames,
  onOpenSettings,
}: FormShellProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Brand Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-md shadow-emerald-500/20 font-bold text-xl select-none">
            N
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800 tracking-tight leading-none">
              Nutri<span className="text-emerald-500">Mind</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
              Personalized AI Diet Consultant
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-700 shadow-sm transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">API Key</span>
        </button>
      </header>

      {/* Progress Tracker Card */}
      <div className="glass-panel rounded-3xl shadow-xl shadow-slate-100/40 border border-slate-100 overflow-hidden mb-6">
        {/* Step List (Desktop) */}
        <div className="hidden md:flex border-b border-slate-100 bg-slate-50/50">
          {stepNames.map((name, index) => {
            const isCompleted = index < currentStepIndex;
            const isActive = index === currentStepIndex;
            return (
              <div
                key={name}
                className={`flex-1 flex items-center justify-center py-4 px-2 border-r last:border-r-0 border-slate-100 transition-all ${
                  isActive ? 'bg-white' : ''
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-2 ${
                    isCompleted
                      ? 'bg-emerald-500 text-white'
                      : isActive
                      ? 'bg-primary-500 text-white shadow-sm shadow-primary-500/10'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </span>
                <span
                  className={`text-xs font-bold ${
                    isActive ? 'text-slate-800' : isCompleted ? 'text-slate-500' : 'text-slate-400'
                  }`}
                >
                  {name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile Step Header */}
        <div className="md:hidden flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/30">
          <div>
            <span className="text-[10px] font-extrabold text-primary-500 uppercase tracking-widest block">
              Step {currentStepIndex + 1} of {stepNames.length}
            </span>
            <span className="text-base font-bold text-slate-800 block">
              {stepNames[currentStepIndex]}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            {progressPercent}% Complete
          </span>
        </div>

        {/* Real Visual Progress Bar */}
        <div className="w-full h-1 bg-slate-100">
          <div
            className="h-full gradient-bg transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Inner Content Area */}
        <div className="p-6 md:p-8 bg-white min-h-[380px] flex flex-col justify-between">
          <div>{children}</div>

          {/* Navigation Controls */}
          {!isLastStep && (
            <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-8">
              <button
                type="button"
                onClick={onBack}
                disabled={isFirstStep}
                className={`flex items-center gap-1.5 px-5 py-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                  isFirstStep
                    ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-slate-50'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white hover:bg-slate-50'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>

              <button
                type="button"
                onClick={onNext}
                className="flex items-center gap-1.5 px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold transition-all shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Small Footer Signature */}
      <footer className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1 mt-4">
        <span>Made with</span>
        <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
        <span>NutriMind AI Nutrition Planner • Secure & Frontend-only</span>
      </footer>
    </div>
  );
}
