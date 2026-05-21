import { useState } from 'react';

export function useMultiStepForm(stepsCount: number) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  function next() {
    setCurrentStepIndex((i) => {
      if (i >= stepsCount - 1) return i;
      return i + 1;
    });
  }

  function back() {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  }

  function goTo(index: number) {
    if (index >= 0 && index < stepsCount) {
      setCurrentStepIndex(index);
    }
  }

  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === stepsCount - 1;
  const progressPercent = Math.round(((currentStepIndex) / (stepsCount - 1)) * 100);

  return {
    currentStepIndex,
    next,
    back,
    goTo,
    isFirstStep,
    isLastStep,
    progressPercent,
  };
}
