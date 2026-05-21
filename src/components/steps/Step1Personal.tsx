import type { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import type { NutriMindFormData, SexType } from '../../types/formTypes';
import { Calendar } from 'lucide-react';

interface Step1Props {
  register: UseFormRegister<NutriMindFormData>;
  errors: FieldErrors<NutriMindFormData>;
  setValue: UseFormSetValue<NutriMindFormData>;
  watch: UseFormWatch<NutriMindFormData>;
}

export default function Step1Personal({ register, errors, setValue, watch }: Step1Props) {
  const selectedSex = watch('sex');

  const sexOptions: { value: SexType; label: string; icon: string }[] = [
    { value: 'Male', label: 'Male', icon: '👨' },
    { value: 'Female', label: 'Female', icon: '👩' },
    { value: 'Other', label: 'Other / Prefer not to say', icon: '🧑' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Tell us about yourself</h2>
        <p className="text-slate-500 text-sm">We use these physical metrics to calculate your custom BMR and calorie targets.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 block" htmlFor="age">
            Age (Years)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Calendar className="w-5 h-5" />
            </span>
            <input
              id="age"
              type="number"
              placeholder="e.g. 28"
              {...register('age', { valueAsNumber: true })}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                errors.age ? 'border-red-500 bg-red-50/10' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.age && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
              {errors.age.message}
            </p>
          )}
        </div>

        {/* Height Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 block" htmlFor="height">
            Height (cm)
          </label>
          <div className="relative font-medium text-slate-700">
            <input
              id="height"
              type="number"
              placeholder="e.g. 175"
              {...register('height', { valueAsNumber: true })}
              className={`w-full pl-4 pr-12 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                errors.height ? 'border-red-500 bg-red-50/10' : 'border-slate-200'
              }`}
            />
            <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 font-normal">
              cm
            </span>
          </div>
          {errors.height && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
              {errors.height.message}
            </p>
          )}
        </div>

        {/* Weight Field */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 block" htmlFor="weight">
            Weight (kg)
          </label>
          <div className="relative">
            <input
              id="weight"
              type="number"
              placeholder="e.g. 70"
              {...register('weight', { valueAsNumber: true })}
              className={`w-full pl-4 pr-12 py-3 rounded-xl border bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all ${
                errors.weight ? 'border-red-500 bg-red-50/10' : 'border-slate-200'
              }`}
            />
            <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 font-normal">
              kg
            </span>
          </div>
          {errors.weight && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
              {errors.weight.message}
            </p>
          )}
        </div>
      </div>

      {/* Sex Field */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700 block">
          Biological Sex
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {sexOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setValue('sex', option.value, { shouldValidate: true })}
              className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                selectedSex === option.value
                  ? 'border-primary-500 bg-primary-50/60 ring-2 ring-primary-500/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.icon}</span>
                <span className="font-medium text-slate-700">{option.label}</span>
              </div>
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  selectedSex === option.value
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {selectedSex === option.value && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </div>
            </button>
          ))}
        </div>
        {errors.sex && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
            {errors.sex.message}
          </p>
        )}
      </div>
    </div>
  );
}
