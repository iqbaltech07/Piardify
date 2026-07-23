import { useState } from "react";
import { FormData, Step, StackCategory } from "../types";

export function useGenerateForm() {
  const [step, setStep] = useState<Step>(1);
  const [subStep, setSubStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  const [form, setForm] = useState<FormData>({
    appIdea: "", appName: "", stackMode: "manual",
    stacks: { frontend: "", backend: "", database: "", deployment: "" },
    dynamicQuestions: [], dynamicAnswers: {}
  });

  const setStack = (category: StackCategory, label: string) =>
    setForm((f) => ({ ...f, stacks: { ...f.stacks, [category]: label } }));

  const setAppName = (val: string) => setForm(f => ({ ...f, appName: val }));
  const setAppIdea = (val: string) => setForm(f => ({ ...f, appIdea: val }));
  const setStackMode = (mode: "manual" | "ai") => setForm(f => ({ ...f, stackMode: mode }));

  const fetchDynamicQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const res = await fetch("/api/generate/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appName: form.appName,
          appIdea: form.appIdea,
          stacks: form.stacks
        })
      });
      const data = await res.json();
      if (data.questions) {
        setForm(f => ({ ...f, dynamicQuestions: data.questions, dynamicAnswers: {} }));
      }
    } catch (e) {
      console.error("Failed to fetch questions:", e);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const setDynamicAnswer = (key: string, value: string | string[], type: "single" | "multiple") => {
    setForm(f => {
      if (type === "single") {
        return { ...f, dynamicAnswers: { ...f.dynamicAnswers, [key]: value } };
      }
      
      const currentVal = (f.dynamicAnswers[key] || []) as string[];
      let newVal = [];
      if (currentVal.includes(value as string)) {
        newVal = currentVal.filter(v => v !== value);
      } else {
        newVal = [...currentVal, value as string];
      }
      return { ...f, dynamicAnswers: { ...f.dynamicAnswers, [key]: newVal } };
    });
  };

  return {
    step, setStep,
    subStep, setSubStep,
    loading, setLoading,
    questionsLoading,
    form, setForm,
    setStack,
    setAppName, setAppIdea, setStackMode,
    fetchDynamicQuestions, setDynamicAnswer
  };
}
