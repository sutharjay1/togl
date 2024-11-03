import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WorkSpaceState {
  workspaceId: string;
  setSetWorkspaceId: (workspaceId: string) => void;
}

export const useWorkspace = create<WorkSpaceState>()(
  persist(
    (set) => ({
      workspaceId: "",
      setSetWorkspaceId: (workspaceId: string) => {
        set({ workspaceId });
      },
    }),
    { name: "workspace", storage: createJSONStorage(() => localStorage) },
  ),
);
