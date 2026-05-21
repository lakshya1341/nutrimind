import type { NutriMindFormData } from '../../types/formTypes';
import { User, Target, Zap, ChefHat, Sparkles } from 'lucide-react';

interface Step5Props {
  formData: NutriMindFormData;
  onSubmit: () => void;
  isGenerating: boolean;
}

export default function Step5Review({ formData, onSubmit, isGenerating }: Step5Props) {
  // Safe default calculations to display during review
  const bmrEstimate =
    formData.sex === 'Male'
      ? Math.round(10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5)
      : formData.sex === 'Female'
      ? Math.round(10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 161)
      : Math.round(10 * formData.weight + 6.25 * formData.height - 5 * formData.age - 80); // generic baseline

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Review Your Profile</h2>
        <p className="text-slate-500 text-sm">Please verify your inputs. Our AI engine uses these precise metrics to map your nutritional program.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Physical Stats Card */}
        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-50">
            <User className="w-4 h-4 text-emerald-500" />
            Physical Profile
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Age</span>
              <span className="text-slate-700 font-semibold">{formData.age} Years</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Sex</span>
              <span className="text-slate-700 font-semibold">{formData.sex}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Height</span>
              <span className="text-slate-700 font-semibold">{formData.height} cm</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Weight</span>
              <span className="text-slate-700 font-semibold">{formData.weight} kg</span>
            </div>
          </div>
          <div className="pt-2">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Est. Basal Metabolic Rate (BMR)</span>
            <span className="text-emerald-600 font-bold text-sm">{bmrEstimate} kcal / day</span>
          </div>
        </div>

        {/* Goal Card */}
        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-50">
            <Target className="w-4 h-4 text-rose-500" />
            Primary Goal
          </h3>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Objective</span>
            <span className="text-slate-800 font-bold text-base block mt-0.5">{formData.goal}</span>
            <span className="inline-block mt-2 px-3 py-1 bg-rose-50 text-rose-600 font-medium text-xs rounded-full">
              {formData.goal === 'Lose weight'
                ? 'Caloric Deficit'
                : formData.goal === 'Gain weight' || formData.goal === 'Build muscle'
                ? 'Caloric Surplus'
                : 'Caloric Maintenance'}
            </span>
          </div>
        </div>

        {/* Lifestyle Habits Card */}
        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-50">
            <Zap className="w-4 h-4 text-amber-500" />
            Lifestyle & Habits
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Activity</span>
              <span className="text-slate-700 font-semibold">{formData.activityLevel}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Sleep</span>
              <span className="text-slate-700 font-semibold">{formData.sleep} Hours</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Water</span>
              <span className="text-slate-700 font-semibold">{formData.water} Glasses</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Medical Details</span>
              <span className="text-slate-700 font-semibold truncate block max-w-[150px]">
                {formData.medicalConditions || 'None'}
              </span>
            </div>
          </div>
        </div>

        {/* Diet Category and Details Card */}
        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-3">
          <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-50">
            <ChefHat className="w-4 h-4 text-blue-500" />
            Diet preferences
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Category</span>
              <span className="text-slate-700 font-semibold">{formData.dietType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Meal Frequency</span>
              <span className="text-slate-700 font-semibold">{formData.mealsPerDay} Meals / Day</span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Allergies</span>
              <span className="text-slate-700 font-semibold block truncate">
                {formData.allergies && formData.allergies.length > 0
                  ? formData.allergies.join(', ')
                  : 'None'}
              </span>
            </div>
            <div className="col-span-2">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Cuisines Preferred</span>
              <span className="text-slate-700 font-semibold block truncate">
                {formData.cuisine && formData.cuisine.length > 0
                  ? formData.cuisine.join(', ')
                  : 'No preference'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 text-center">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isGenerating}
          className="w-full md:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer mx-auto disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
          {isGenerating ? 'Building Diet Plan...' : 'Generate My Diet Plan'}
        </button>
        <p className="text-xs text-slate-400 mt-2.5">
          By clicking generate, the profile will be processed securely via Google Gemini 1.5 Flash.
        </p>
      </div>
    </div>
  );
}
