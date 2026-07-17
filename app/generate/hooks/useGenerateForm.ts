import { useState } from "react";
import { FormData, Step, StackCategory } from "../types";

export function useGenerateForm() {
  const [step, setStep] = useState<Step>(1);
  const [subStep, setSubStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormData>({
    appIdea: "", appName: "", stackMode: "manual",
    stacks: { frontend: "", backend: "", database: "", deployment: "" },
    targetUser: "", platform: "", coreFeatures: [], monetization: "",
    appScale: "", integrations: [], designPreference: "",
  });

  const setStack = (category: StackCategory, label: string) =>
    setForm((f) => ({ ...f, stacks: { ...f.stacks, [category]: label } }));

  const toggleFeature = (feat: string) =>
    setForm((f) => ({ ...f, coreFeatures: f.coreFeatures.includes(feat) ? f.coreFeatures.filter((x) => x !== feat) : [...f.coreFeatures, feat] }));
    
  const toggleIntegration = (int: string) =>
    setForm((f) => ({ ...f, integrations: f.integrations.includes(int) ? f.integrations.filter((x) => x !== int) : [...f.integrations, int] }));

  const setAppName = (val: string) => setForm(f => ({ ...f, appName: val }));
  const setAppIdea = (val: string) => setForm(f => ({ ...f, appIdea: val }));
  const setStackMode = (mode: "manual" | "ai") => setForm(f => ({ ...f, stackMode: mode }));

  return {
    step, setStep,
    subStep, setSubStep,
    loading, setLoading,
    form, setForm,
    setStack, toggleFeature, toggleIntegration,
    setAppName, setAppIdea, setStackMode
  };
}
