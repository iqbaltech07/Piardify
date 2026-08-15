import { create } from "zustand";

interface UiStore {
  isMcpModalOpen: boolean;
  activeMcpProjectId: string | null;
  activeMcpAppName: string;
  isEditProjectModalOpen: boolean;
  showUpgradeModal: boolean;

  openMcpModal: (projectId: string, appName?: string) => void;
  closeMcpModal: () => void;
  setIsEditProjectModalOpen: (open: boolean) => void;
  setShowUpgradeModal: (show: boolean) => void;
}

export const useUiStore = create<UiStore>((set) => ({
  isMcpModalOpen: false,
  activeMcpProjectId: null,
  activeMcpAppName: "",
  isEditProjectModalOpen: false,
  showUpgradeModal: false,

  openMcpModal: (projectId, appName = "") =>
    set({
      isMcpModalOpen: true,
      activeMcpProjectId: projectId,
      activeMcpAppName: appName,
    }),

  closeMcpModal: () =>
    set({
      isMcpModalOpen: false,
      activeMcpProjectId: null,
      activeMcpAppName: "",
    }),

  setIsEditProjectModalOpen: (isEditProjectModalOpen) =>
    set({ isEditProjectModalOpen }),

  setShowUpgradeModal: (showUpgradeModal) =>
    set({ showUpgradeModal }),
}));
