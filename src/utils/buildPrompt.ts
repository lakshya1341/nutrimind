import type { NutriMindFormData } from '../types/formTypes';

export function buildPrompt(data: NutriMindFormData): string {
  const allergiesStr =
    data.allergies && data.allergies.length > 0 && !data.allergies.includes('None')
      ? data.allergies.join(', ')
      : 'None';

  const cuisineStr =
    data.cuisine && data.cuisine.length > 0 && !data.cuisine.includes('No preference')
      ? data.cuisine.join(', ')
      : 'No preference';

  const medicalStr = data.medicalConditions && data.medicalConditions.trim() !== ''
    ? data.medicalConditions
    : 'None';

  return `You are a professional nutritionist, clinical dietician, and personalized fitness consultant.

Create a highly detailed, realistic, and practical 7-day diet plan for a individual with these exact criteria:
- Age: ${data.age} years old
- Sex: ${data.sex}
- Height: ${data.height} cm
- Weight: ${data.weight} kg
- Goal: ${data.goal}
- Activity Level: ${data.activityLevel}
- Sleep: ${data.sleep} hours per night
- Daily Water intake: ${data.water} glasses of water
- Medical conditions / concerns: ${medicalStr}
- Diet type: ${data.dietType}
- Food allergies: ${allergiesStr}
- Preferred cuisine: ${cuisineStr}
- Number of meals per day: ${data.mealsPerDay}

I require you to respond with a clean, well-formatted plain text markdown. You MUST use the exact level 2 markdown headings listed below for each of the six parts. Do not add any introductory banter, greeting, or introductory text before the first heading. Start directly with the first section.

Here are the six headings you must use and what they must contain:

## 1. Health Profile Analysis
Provide a professional, 2-3 sentence clinical analysis of their physical stats (BMI, baseline energy needs, active energy multiplier, and goal alignment).

## 2. Daily Calorie Recommendation
Provide the daily recommended calories in kcal (number only or a short explanation, e.g., "1800 kcal"). Explain the deficit/surplus applied.

## 3. Macronutrient Breakdown
Provide the specific recommended grams per day of Protein, Carbs, and Fats. E.g.:
- Protein: 120g (30% of total energy)
- Carbohydrates: 200g (45% of total energy)
- Fats: 60g (25% of total energy)

## 4. 7-Day Meal Plan
Provide a meal-by-meal schedule for 7 days (Day 1 through Day 7). For each day, outline the ${data.mealsPerDay} meals.
Use H3 headings for days (e.g. "### Day 1", "### Day 2").
For meals, use simple list item formatting (e.g. "- Meal 1 (Breakfast): ...", "- Meal 2 (Lunch): ...").
Ensure meal recommendations respect the diet type (${data.dietType}), preferred cuisines (${cuisineStr}), and STRICTLY avoid any ingredients mentioned in the allergies list (${allergiesStr}).
If Indian cuisine is preferred, keep names simple and familiar (e.g., Dal Khichdi, Oats Chilla, Paneer Bhurji, Roti).

## 5. Goal-Specific Diet Tips
Provide a numbered list of exactly 5 practical, evidence-based recommendations, tailored to their goal ("${data.goal}") and daily active metrics.

## 6. Foods to Avoid
Provide a bulleted list of 6-8 specific ingredients, processed items, or cooking practices they should avoid to stay safe and achieve their target.

Remember: Be realistic, use exact metrics, keep meals delicious, and double check that ALL food preferences and allergies are fully respected.`;
}
