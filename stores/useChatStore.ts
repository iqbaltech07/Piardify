import { create } from "zustand";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatStore {
  chatMessages: ChatMessage[];
  isAiEditing: boolean;
  selectedModel: string;
  aiPrompt: string;

  addMessage: (msg: ChatMessage) => void;
  setIsAiEditing: (isEditing: boolean) => void;
  setSelectedModel: (model: string) => void;
  setAiPrompt: (prompt: string) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatMessages: [],
  isAiEditing: false,
  selectedModel: "gemini-3.7-flash",
  aiPrompt: "",

  addMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
  setIsAiEditing: (isAiEditing) => set({ isAiEditing }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  setAiPrompt: (aiPrompt) => set({ aiPrompt }),
  clearChat: () => set({ chatMessages: [], isAiEditing: false, aiPrompt: "" }),
}));
