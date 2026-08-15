import { useWizardStore } from "@/stores/useWizardStore";

export function useGenerateForm() {
  const {
    step,
    setStep,
    subStep,
    setSubStep,
    loading,
    setLoading,
    questionsLoading,
    form,
    setStack,
    setAppName,
    setAppIdea,
    setStackMode,
    setDesignData,
    fetchDynamicQuestions,
    setDynamicAnswer,
    resetWizard,
  } = useWizardStore();

  return {
    step,
    setStep,
    subStep,
    setSubStep,
    loading,
    setLoading,
    questionsLoading,
    form,
    setStack,
    setAppName,
    setAppIdea,
    setStackMode,
    setDesignData,
    fetchDynamicQuestions,
    setDynamicAnswer,
    resetWizard,
  };
}
