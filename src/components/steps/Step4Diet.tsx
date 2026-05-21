import type { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import type { NutriMindFormData, DietType, AllergyType, CuisineType, MealsPerDayType } from '../../types/formTypes';
import { Apple, EyeOff, Soup, ChefHat } from 'lucide-react';

interface Step4Props {
  setValue: UseFormSetValue<NutriMindFormData>;
  watch: UseFormWatch<NutriMindFormData>;
  errors: FieldErrors<NutriMindFormData>;
}

export default function Step4Diet({ setValue, watch, errors }: Step4Props) {
  const selectedDiet = watch('dietType');
  const selectedAllergies = (watch('allergies') || []) as AllergyType[];
  const selectedCuisines = (watch('cuisine') || []) as CuisineType[];
  const selectedMeals = watch('mealsPerDay') || 3;

  const dietOptions: { value: DietType; label: string; emoji: string }[] = [
    { value: 'Vegetarian', label: 'Vegetarian', emoji: '🥦' },
    { value: 'Non-Vegetarian', label: 'Non-Veg', emoji: '🍗' },
    { value: 'Vegan', label: 'Vegan', emoji: '🌱' },
    { value: 'Eggetarian', label: 'Eggetarian', emoji: '🍳' },
  ];

  const allergyOptions: AllergyType[] = ['Nuts', 'Dairy', 'Gluten', 'Seafood', 'Soy', 'None'];

  const cuisineOptions: CuisineType[] = ['Indian', 'Mediterranean', 'Continental', 'No preference'];

  const mealOptions: MealsPerDayType[] = [2, 3, 4, 5];

  // Allergy toggle logic (None is exclusive)
  const handleAllergyToggle = (allergy: AllergyType) => {
    if (allergy === 'None') {
      setValue('allergies', ['None'], { shouldValidate: true });
    } else {
      let updated: AllergyType[] = selectedAllergies.filter((a) => a !== 'None');
      if (updated.includes(allergy)) {
        updated = updated.filter((a) => a !== allergy);
      } else {
        updated.push(allergy);
      }
      if (updated.length === 0) {
        updated = ['None'];
      }
      setValue('allergies', updated, { shouldValidate: true });
    }
  };

  // Cuisine toggle logic (No preference is exclusive)
  const handleCuisineToggle = (cuisine: CuisineType) => {
    if (cuisine === 'No preference') {
      setValue('cuisine', ['No preference'], { shouldValidate: true });
    } else {
      let updated: CuisineType[] = selectedCuisines.filter((c) => c !== 'No preference');
      if (updated.includes(cuisine)) {
        updated = updated.filter((c) => c !== cuisine);
      } else {
        updated.push(cuisine);
      }
      if (updated.length === 0) {
        updated = ['No preference'];
      }
      setValue('cuisine', updated, { shouldValidate: true });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center md:text-left mb-4">
        <h2 className="text-2xl font-bold text-slate-800">Diet & Food Preferences</h2>
        <p className="text-slate-500 text-sm">Customize meal plans according to your lifestyle, culture, and safety needs.</p>
      </div>

      {/* Diet Type Selector */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700 block flex items-center gap-1.5">
          <Apple className="w-4 h-4 text-emerald-500" />
          Diet Category
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dietOptions.map((option) => {
            const isSelected = selectedDiet === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue('dietType', option.value, { shouldValidate: true })}
                className={`py-3 px-4 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/20 font-semibold'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-2xl select-none">{option.emoji}</span>
                <span className="text-slate-700 text-xs md:text-sm">{option.label}</span>
              </button>
            );
          })}
        </div>
        {errors.dietType && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
            {errors.dietType.message}
          </p>
        )}
      </div>

      {/* Allergies Multiselect */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700 block flex items-center gap-1.5">
          <EyeOff className="w-4 h-4 text-rose-500" />
          Food Allergies
        </label>
        <div className="flex flex-wrap gap-2">
          {allergyOptions.map((allergy) => {
            const isSelected = selectedAllergies.includes(allergy);
            return (
              <button
                key={allergy}
                type="button"
                onClick={() => handleAllergyToggle(allergy)}
                className={`px-4 py-2 rounded-full border text-xs md:text-sm transition-all ${
                  isSelected
                    ? allergy === 'None'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium'
                      : 'border-rose-500 bg-rose-50 text-rose-700 font-medium'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {allergy}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cuisine preferences */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700 block flex items-center gap-1.5">
          <ChefHat className="w-4 h-4 text-amber-500" />
          Preferred Cuisines
        </label>
        <div className="flex flex-wrap gap-2">
          {cuisineOptions.map((cuisine) => {
            const isSelected = selectedCuisines.includes(cuisine);
            return (
              <button
                key={cuisine}
                type="button"
                onClick={() => handleCuisineToggle(cuisine)}
                className={`px-4 py-2 rounded-full border text-xs md:text-sm transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50/50 text-primary-700 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
              >
                {cuisine}
              </button>
            );
          })}
        </div>
        {errors.cuisine && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
            {errors.cuisine.message}
          </p>
        )}
      </div>

      {/* Meals Per Day */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-slate-700 block flex items-center gap-1.5">
          <Soup className="w-4 h-4 text-blue-500" />
          Meal Frequency
        </label>
        <div className="grid grid-cols-4 gap-3 max-w-sm">
          {mealOptions.map((meals) => {
            const isSelected = selectedMeals === meals;
            return (
              <button
                key={meals}
                type="button"
                onClick={() => setValue('mealsPerDay', meals, { shouldValidate: true })}
                className={`py-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50/50 ring-2 ring-primary-500/20 font-semibold text-primary-700'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-600'
                }`}
              >
                <div className="text-lg md:text-xl font-bold">{meals}</div>
                <div className="text-[10px] text-slate-400 font-normal">Meals</div>
              </button>
            );
          })}
        </div>
        {errors.mealsPerDay && (
          <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
            <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
            {errors.mealsPerDay.message}
          </p>
        )}
      </div>
    </div>
  );
}
