import type { NutriMindFormData } from '../types/formTypes';
import { buildPrompt } from '../utils/buildPrompt';

export async function generateDietPlan(
  formData: NutriMindFormData,
  customApiKey?: string
): Promise<string> {
  // 1. Resolve API Key (custom key > env variable)
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  const activeKey = customApiKey || envKey || '';

  // 2. If no key, fall back to the premium mock generation engine
  if (!activeKey || activeKey.trim() === 'your_api_key_here' || activeKey.trim() === '') {
    console.warn("NutriMind: No active Gemini API Key found. Generating high-quality mock diet plan...");
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return generateMockDietPlan(formData);
  }

  const prompt = buildPrompt(formData);
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error("Invalid structure returned from Gemini API.");
    }

    return generatedText;
  } catch (error: any) {
    console.error("Gemini API call failed:", error);
    throw new Error(error.message || "Failed to communicate with Gemini AI. Check internet connection.");
  }
}

// Custom-tailored Mock diet plan generator based on user stats
function generateMockDietPlan(data: NutriMindFormData): string {
  // Approximate safe recommendations
  const isLose = data.goal === 'Lose weight';
  const isGain = data.goal === 'Gain weight' || data.goal === 'Build muscle';

  const activityMultiplier =
    data.activityLevel === 'Sedentary'
      ? 1.2
      : data.activityLevel === 'Lightly active'
      ? 1.375
      : data.activityLevel === 'Moderately active'
      ? 1.55
      : 1.725;

  const bmr =
    data.sex === 'Male'
      ? 10 * data.weight + 6.25 * data.height - 5 * data.age + 5
      : 10 * data.weight + 6.25 * data.height - 5 * data.age - 161;

  const tdee = Math.round(bmr * activityMultiplier);
  const targetCalories = isLose
    ? Math.round(tdee - 450)
    : isGain
    ? Math.round(tdee + 400)
    : tdee;

  // Macros
  const proteinPercent = data.goal === 'Build muscle' ? 0.3 : 0.25;
  const fatPercent = 0.25;
  const carbPercent = 1 - proteinPercent - fatPercent;

  const proteinGrams = Math.round((targetCalories * proteinPercent) / 4);
  const fatGrams = Math.round((targetCalories * fatPercent) / 9);
  const carbGrams = Math.round((targetCalories * carbPercent) / 4);

  // Meal selections based on cuisine & diet category
  const isIndian = data.cuisine.includes('Indian') || data.cuisine.includes('No preference');
  const isVeg = data.dietType === 'Vegetarian' || data.dietType === 'Vegan';

  const b = isVeg
    ? isIndian
      ? 'Oats Chilla with Mint Chutney or Vegetable Poha'
      : 'Avocado Toast with grilled mushrooms & cherry tomatoes'
    : isIndian
    ? 'Egg Bhurji (3 eggs) with 2 whole wheat rotis & sprouts'
    : '3 Egg Omelette with spinach, feta cheese, and whole-wheat toast';

  const l = isVeg
    ? isIndian
      ? 'Mixed vegetable Sabzi, Dal Tadka, and 2 rotis or brown rice'
      : 'Quinoa Buddha Bowl with baked tofu, broccoli, tahini dressing'
    : isIndian
    ? 'Grilled Chicken Breast, Spinach Dal, and half cup Brown Rice'
    : 'Seared Salmon fillet with roasted sweet potatoes and asparagus';

  const sn = isVeg
    ? 'Handful of almonds & walnuts with a glass of green tea'
    : 'Boiled Egg Whites (3) with sliced cucumbers and hummus';

  const d = isVeg
    ? isIndian
      ? 'Paneer Tikka masala (Tofu if Vegan), yellow dal, and green salad'
      : 'Lentil Pasta with marinara sauce, loaded with bell peppers and zucchini'
    : isIndian
    ? 'Lean mutton curry or fish curry (less oil), sautéed vegetables'
    : 'Lean sliced sirloin steak or turkey cutlets with steam cauliflower rice';

  // Construct meal lines based on meal count preferences
  const mealsList: string[] = [];
  if (data.mealsPerDay === 2) {
    mealsList.push(`- Meal 1 (Brunch): ${b}`);
    mealsList.push(`- Meal 2 (Dinner): ${d}`);
  } else if (data.mealsPerDay === 3) {
    mealsList.push(`- Meal 1 (Breakfast): ${b}`);
    mealsList.push(`- Meal 2 (Lunch): ${l}`);
    mealsList.push(`- Meal 3 (Dinner): ${d}`);
  } else if (data.mealsPerDay === 4) {
    mealsList.push(`- Meal 1 (Breakfast): ${b}`);
    mealsList.push(`- Meal 2 (Lunch): ${l}`);
    mealsList.push(`- Meal 3 (Evening Snack): ${sn}`);
    mealsList.push(`- Meal 4 (Dinner): ${d}`);
  } else {
    mealsList.push(`- Meal 1 (Early Morning): Mixed seeds, dry fruits & infused water`);
    mealsList.push(`- Meal 2 (Breakfast): ${b}`);
    mealsList.push(`- Meal 3 (Lunch): ${l}`);
    mealsList.push(`- Meal 4 (Evening Snack): ${sn}`);
    mealsList.push(`- Meal 5 (Dinner): ${d}`);
  }

  const mealPlanStr = Array.from({ length: 7 }, (_, i) => {
    return `### Day ${i + 1}\n${mealsList.join('\n')}`;
  }).join('\n\n');

  return `## 1. Health Profile Analysis
Based on your metrics (Age ${data.age}, Weight ${data.weight} kg, Height ${data.height} cm), your estimated BMR is ${Math.round(bmr)} kcal. Incorporating your activity tier (${data.activityLevel}), your TDEE is ${tdee} kcal. Given your primary objective of "${data.goal}", a balanced approach is recommended to optimize BMR and sustain your recovery cycles.

## 2. Daily Calorie Recommendation
${targetCalories} kcal
This represents a balanced ${isLose ? 'deficit' : isGain ? 'surplus' : 'maintenance'} profile designed to target your goal of ${data.goal} safely and efficiently while maintaining your energy.

## 3. Macronutrient Breakdown
- Protein: ${proteinGrams}g (${Math.round(proteinPercent * 100)}% of total energy) - Essential for muscle recovery and metabolic rate.
- Carbohydrates: ${carbGrams}g (${Math.round(carbPercent * 100)}% of total energy) - Fuels daily operations and preserves glycogen.
- Fats: ${fatGrams}g (${Math.round(fatPercent * 100)}% of total energy) - Vital for hormonal regulation and joint health.

## 4. 7-Day Meal Plan
${mealPlanStr}

## 5. Goal-Specific Diet Tips
1. Keep hydration constant: Sip on ${data.water} glasses of water daily to maintain cellular efficiency and kidney function.
2. Prioritize Sleep: Rest 7-8 hours to maximize muscle protein synthesis and control stress hormones.
3. Eat mindfully: Consume high-volume vegetables and healthy fiber to support gut health and satiety.
4. Prep meals in advance: Keep healthy snacks like almonds or cucumber slices ready to avoid emotional choices.
5. Consistency is key: Stay committed for at least 3-4 weeks to let your metabolism adapt to the customized macro profile.

## 6. Foods to Avoid
- Refined sugars and carbonated cold drinks.
- Deep-fried street foods and saturated cooking oils (switch to cold-pressed or olive oil).
- Heavy dairy if sensitive, or gluten-heavy bakery goods.
- Processed meats containing high sodium and nitrates.
- Eating within 2 hours of sleep to prevent indigestion and sleep disruption.
- High-glycemic carbs like white bread or sweet bakery buns.`;
}
