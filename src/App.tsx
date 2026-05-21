import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { type NutriMindFormData, defaultFormValues } from './types/formTypes';
import { useMultiStepForm } from './hooks/useMultiStepForm';
import FormShell from './components/FormShell';
import Step1Personal from './components/steps/Step1Personal';
import Step2Goals from './components/steps/Step2Goals';
import Step3Lifestyle from './components/steps/Step3Lifestyle';
import Step4Diet from './components/steps/Step4Diet';
import Step5Review from './components/steps/Step5Review';
import LoadingScreen from './components/LoadingScreen';
import DietResult from './components/DietResult';
import { generateDietPlan } from './services/geminiService';
import { Sparkles, Eye, EyeOff, X, KeyRound } from 'lucide-react';
import { useState } from 'react';

// Yup Validation Schema for Multi-step Form
const validationSchema = yup.object().shape({
  age: yup
    .number()
    .typeError('Age must be a number')
    .required('Age is required')
    .min(10, 'Age must be at least 10')
    .max(80, 'Age cannot exceed 80'),
  sex: yup
    .string()
    .required('Biological sex is required')
    .oneOf(['Male', 'Female', 'Other']),
  height: yup
    .number()
    .typeError('Height must be a number')
    .required('Height is required')
    .min(100, 'Height must be at least 100 cm')
    .max(250, 'Height cannot exceed 250 cm'),
  weight: yup
    .number()
    .typeError('Weight must be a number')
    .required('Weight is required')
    .min(20, 'Weight must be at least 20 kg')
    .max(300, 'Weight cannot exceed 300 kg'),
  goal: yup.string().required('Select a primary goal'),
  activityLevel: yup.string().required('Select an activity level'),
  sleep: yup
    .number()
    .typeError('Sleep must be a number')
    .required('Sleep hours are required')
    .min(4, 'Minimum sleep is 4 hours')
    .max(12, 'Maximum sleep is 12 hours'),
  water: yup
    .number()
    .typeError('Water intake must be a number')
    .required('Water glasses are required')
    .min(1, 'Minimum intake is 1 glass')
    .max(20, 'Maximum intake is 20 glasses'),
  medicalConditions: yup.string().optional().default(''),
  dietType: yup.string().required('Select your diet type'),
  allergies: yup.array().of(yup.string()).optional().default([]),
  cuisine: yup.array().of(yup.string()).required('Select at least one preferred cuisine').min(1, 'Select at least one cuisine preference'),
  mealsPerDay: yup.number().required('Select your meal frequency').oneOf([2, 3, 4, 5]),
});

const STEP_NAMES = [
  'Personal Info',
  'Your Goal',
  'Lifestyle',
  'Preferences',
  'Review Plan',
];

export default function App() {
  // 1. Navigation Custom Hook
  const {
    currentStepIndex,
    next,
    back,
    goTo,
    isFirstStep,
    isLastStep,
    progressPercent,
  } = useMultiStepForm(STEP_NAMES.length);

  // 2. State definitions
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Custom API key stored in React/Session storage for secure client execution
  const [customApiKey, setCustomApiKey] = useState(() => {
    return sessionStorage.getItem('VITE_GEMINI_API_KEY') || '';
  });

  // 3. React Hook Form Setup
  const {
    register,
    trigger,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<NutriMindFormData>({
    resolver: yupResolver(validationSchema) as any,
    defaultValues: defaultFormValues,
    mode: 'onChange',
  });

  // Watch fields in case parent needs to render stats
  const formData = watch();

  // 4. Validate current step inputs before changing page
  const handleNextStep = async () => {
    let fieldsToValidate: (keyof NutriMindFormData)[] = [];

    if (currentStepIndex === 0) {
      fieldsToValidate = ['age', 'sex', 'height', 'weight'];
    } else if (currentStepIndex === 1) {
      fieldsToValidate = ['goal'];
    } else if (currentStepIndex === 2) {
      fieldsToValidate = ['activityLevel', 'sleep', 'water', 'medicalConditions'];
    } else if (currentStepIndex === 3) {
      fieldsToValidate = ['dietType', 'allergies', 'cuisine', 'mealsPerDay'];
    }

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      next();
    }
  };

  // 5. Final submissions to AI planner
  const onSubmitPlan = async () => {
    setIsGenerating(true);
    try {
      const activeValues = getValues();
      const planText = await generateDietPlan(activeValues, customApiKey);
      setGeneratedPlan(planText);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to contact Gemini API. Please double-check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    sessionStorage.setItem('VITE_GEMINI_API_KEY', key);
    setApiKeyModalOpen(false);
  };

  const handleReset = () => {
    setGeneratedPlan(null);
    goTo(0);
  };

  // 6. Router-like step components loader
  const renderStepContent = () => {
    switch (currentStepIndex) {
      case 0:
        return (
          <Step1Personal
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        );
      case 1:
        return <Step2Goals setValue={setValue} watch={watch} errors={errors} />;
      case 2:
        return (
          <Step3Lifestyle
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
          />
        );
      case 3:
        return <Step4Diet setValue={setValue} watch={watch} errors={errors} />;
      case 4:
        return (
          <Step5Review
            formData={formData}
            onSubmit={onSubmitPlan}
            isGenerating={isGenerating}
          />
        );
      default:
        return null;
    }
  };

  // Show live loading overlay when generating content
  if (isGenerating) {
    return <LoadingScreen />;
  }

  // Show detailed dietician dashboard if plan is compiled
  if (generatedPlan) {
    return (
      <DietResult
        planText={generatedPlan}
        formData={formData}
        onReset={handleReset}
      />
    );
  }

  // Standard multi-step input form render
  return (
    <div className="min-h-screen flex flex-col justify-center py-4 bg-slate-50/50">
      <FormShell
        currentStepIndex={currentStepIndex}
        progressPercent={progressPercent}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        onNext={handleNextStep}
        onBack={back}
        stepNames={STEP_NAMES}
        onOpenSettings={() => setApiKeyModalOpen(true)}
      >
        {renderStepContent()}
      </FormShell>

      {/* Premium API Key Modal Overlay */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 border border-slate-100 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setApiKeyModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-50">
              <span className="p-2 rounded-xl bg-emerald-50 text-emerald-500">
                <KeyRound className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-800 text-base leading-none">
                  Google Gemini Credentials
                </h3>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase mt-1">
                  API Key Settings
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-slate-600 text-xs leading-relaxed">
                Provide your custom **Google Gemini API Key** to fetch live diet plans. The key is saved locally in your temporary browser session.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Gemini API Key
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all placeholder:text-slate-300 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* API Info links */}
              <div className="bg-emerald-50/40 border border-emerald-100 p-3.5 rounded-xl text-xs text-emerald-800 space-y-1.5">
                <div className="flex gap-1 items-center font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Getting a Free API Key</span>
                </div>
                <p className="leading-relaxed">
                  1. Visit the <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-bold hover:text-emerald-700">Google AI Studio</a>.<br />
                  2. Create an API key under your Google account.<br />
                  3. Paste the key above and save!
                </p>
              </div>

              {/* Fallback Banner */}
              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl text-xs text-slate-500 leading-relaxed">
                💡 **No key? No problem!** If left empty, NutriMind automatically operates in **Mock Mode** using our high-fidelity dietician template to display all features instantly!
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApiKeyModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveApiKey(customApiKey)}
                  className="flex-1 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-500/10 cursor-pointer"
                >
                  Save API Key
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
