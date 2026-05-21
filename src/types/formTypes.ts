export type SexType = 'Male' | 'Female' | 'Other';

export type GoalType = 
  | 'Lose weight' 
  | 'Gain weight' 
  | 'Build muscle' 
  | 'Maintain current weight' 
  | 'Eat healthier / improve energy';

export type ActivityLevelType = 
  | 'Sedentary' 
  | 'Lightly active' 
  | 'Moderately active' 
  | 'Very active';

export type DietType = 
  | 'Vegetarian' 
  | 'Non-Vegetarian' 
  | 'Vegan' 
  | 'Eggetarian';

export type AllergyType = 
  | 'Nuts' 
  | 'Dairy' 
  | 'Gluten' 
  | 'Seafood' 
  | 'Soy' 
  | 'None';

export type CuisineType = 
  | 'Indian' 
  | 'Mediterranean' 
  | 'Continental' 
  | 'No preference';

export type MealsPerDayType = 2 | 3 | 4 | 5;

export interface PersonalDetails {
  age: number;
  sex: SexType;
  height: number;
  weight: number;
}

export interface GoalDetails {
  goal: GoalType;
}

export interface LifestyleDetails {
  activityLevel: ActivityLevelType;
  sleep: number;
  water: number;
  medicalConditions: string;
}

export interface DietPreferences {
  dietType: DietType;
  allergies: AllergyType[];
  cuisine: CuisineType[];
  mealsPerDay: MealsPerDayType;
}

// Full combined form data structure
export interface NutriMindFormData extends PersonalDetails, GoalDetails, LifestyleDetails, DietPreferences {}

// Default empty form values helper
export const defaultFormValues: NutriMindFormData = {
  age: 25,
  sex: 'Male',
  height: 170,
  weight: 65,
  goal: 'Maintain current weight',
  activityLevel: 'Moderately active',
  sleep: 8,
  water: 8,
  medicalConditions: '',
  dietType: 'Vegetarian',
  allergies: [],
  cuisine: ['No preference'],
  mealsPerDay: 3,
};
