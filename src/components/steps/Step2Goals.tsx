import type { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import type { NutriMindFormData, GoalType } from '../../types/formTypes';

interface Step2Props {
  setValue: UseFormSetValue<NutriMindFormData>;
  watch: UseFormWatch<NutriMindFormData>;
  errors: FieldErrors<NutriMindFormData>;
}

export default function Step2Goals({ setValue, watch, errors }: Step2Props) {
  const selectedGoal = watch('goal');

  const goalOptions: { value: GoalType; label: string; description: string; emoji: string; color: string }[] = [
    {
      value: 'Lose weight',
      label: 'Lose Weight',
      description: 'Burn fat, drop body weight, and tone up with a controlled caloric deficit.',
      emoji: '🔥',
      color: 'from-orange-500/10 to-red-500/10 border-orange-200 text-orange-700',
    },
    {
      value: 'Gain weight',
      label: 'Gain Weight',
      description: 'Increase overall size and mass with healthy, nutrient-dense caloric surplus.',
      emoji: '📈',
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-200 text-blue-700',
    },
    {
      value: 'Build muscle',
      label: 'Build Muscle',
      description: 'Synthesize lean body mass and optimize protein intakes for strength training.',
      emoji: '💪',
      color: 'from-red-500/10 to-rose-500/10 border-red-200 text-rose-700',
    },
    {
      value: 'Maintain current weight',
      label: 'Maintain Weight',
      description: 'Stabilize body composition, balance energy expenditure, and feel great.',
      emoji: '⚖️',
      color: 'from-green-500/10 to-emerald-500/10 border-green-200 text-emerald-700',
    },
    {
      value: 'Eat healthier / improve energy',
      label: 'Eat Healthier & Boost Energy',
      description: 'Fuel your active day-to-day life, optimize micronutrients, and longevity.',
      emoji: '⚡',
      color: 'from-amber-500/10 to-yellow-500/10 border-amber-200 text-amber-700',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left mb-4">
        <h2 className="text-2xl font-bold text-slate-800">What is your primary objective?</h2>
        <p className="text-slate-500 text-sm">We'll adjust macronutrient ratios and calorie distributions based on this choice.</p>
      </div>

      <div className="space-y-3">
        {goalOptions.map((option) => {
          const isSelected = selectedGoal === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue('goal', option.value, { shouldValidate: true })}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-200 hover:-translate-y-0.5 ${
                isSelected
                  ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/25 shadow-sm shadow-primary-500/5'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 shadow-sm shadow-slate-100/5'
              }`}
            >
              <div className="flex-shrink-0 text-3xl p-3 bg-slate-50 rounded-2xl border border-slate-100 select-none">
                {option.emoji}
              </div>
              <div className="flex-grow">
                <h3 className="font-semibold text-slate-800 text-base">{option.label}</h3>
                <p className="text-slate-500 text-xs md:text-sm mt-0.5">{option.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border flex-shrink-0 flex items-center justify-center transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {errors.goal && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
          <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
          {errors.goal.message}
        </p>
      )}
    </div>
  );
}
