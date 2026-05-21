import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { NutriMindFormData, ActivityLevelType } from '../../types/formTypes';
import { Sparkles, Moon, Droplet, HeartPulse } from 'lucide-react';

interface Step3Props {
  register: UseFormRegister<NutriMindFormData>;
  errors: FieldErrors<NutriMindFormData>;
  setValue: UseFormSetValue<NutriMindFormData>;
  watch: UseFormWatch<NutriMindFormData>;
}

export default function Step3Lifestyle({ register, errors, setValue, watch }: Step3Props) {
  const selectedActivity = watch('activityLevel');
  const sleepValue = watch('sleep');
  const waterValue = watch('water');

  const activityOptions: { value: ActivityLevelType; label: string; desc: string; emoji: string }[] = [
    {
      value: 'Sedentary',
      label: 'Sedentary',
      desc: 'Desk job, little to no planned physical exercise.',
      emoji: '🪑',
    },
    {
      value: 'Lightly active',
      label: 'Lightly Active',
      desc: 'Light workout/sports 1–3 days a week.',
      emoji: '🚶',
    },
    {
      value: 'Moderately active',
      label: 'Moderately Active',
      desc: 'Moderate physical training 3–5 days a week.',
      emoji: '🏃',
    },
    {
      value: 'Very active',
      label: 'Very Active',
      desc: 'Heavy hard exercise/athletic training 6–7 days a week.',
      emoji: '🏋️',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Your Daily Lifestyle</h2>
        <p className="text-slate-500 text-sm">Tell us about your active habits, rest cycles, and medical conditions.</p>
      </div>

      {/* Activity Level Selector */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700 block flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          Activity Level
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activityOptions.map((option) => {
            const isSelected = selectedActivity === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('activityLevel', option.value, { shouldValidate: true })}
                className={`p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/25 shadow-sm shadow-primary-500/5'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl select-none">{option.emoji}</span>
                <div>
                  <h4 className="font-semibold text-slate-800 text-sm">{option.label}</h4>
                  <p className="text-slate-500 text-xs mt-0.5">{option.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.activityLevel && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
            {errors.activityLevel.message}
          </p>
        )}
      </div>

      {/* Sleep and Water Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sleep Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5" htmlFor="sleep">
              <Moon className="w-4 h-4 text-purple-500" />
              Sleep per night (Hours)
            </label>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              {sleepValue || 8} hrs
            </span>
          </div>
          <div className="relative">
            <input
              id="sleep"
              type="number"
              min="4"
              max="12"
              placeholder="e.g. 8"
              {...register('sleep', { valueAsNumber: true })}
              className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                errors.sleep ? 'border-red-500 bg-red-50/10' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.sleep && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
              {errors.sleep.message}
            </p>
          )}
        </div>

        {/* Water Intake Field */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5" htmlFor="water">
              <Droplet className="w-4 h-4 text-blue-500" />
              Daily Water Intake (Glasses)
            </label>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              {waterValue || 8} glasses
            </span>
          </div>
          <div className="relative">
            <input
              id="water"
              type="number"
              min="1"
              max="20"
              placeholder="e.g. 10"
              {...register('water', { valueAsNumber: true })}
              className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                errors.water ? 'border-red-500 bg-red-50/10' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.water && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
              {errors.water.message}
            </p>
          )}
        </div>
      </div>

      {/* Medical Conditions Field */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5" htmlFor="medicalConditions">
          <HeartPulse className="w-4 h-4 text-rose-500" />
          Medical Conditions / Health Concerns <span className="text-slate-400 font-normal text-xs">(Optional)</span>
        </label>
        <textarea
          id="medicalConditions"
          rows={3}
          placeholder="e.g. Type 2 Diabetes, Thyroid, Acid Reflux, PCOD. Write 'None' if none apply."
          {...register('medicalConditions')}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-slate-400 text-sm"
        />
        <p className="text-slate-400 text-xs">
          Our AI nutritionist will adapt the meal choices and tips to ensure safety with these medical guidelines.
        </p>
      </div>
    </div>
  );
}
