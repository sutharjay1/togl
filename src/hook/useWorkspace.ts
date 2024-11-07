import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WorkSpaceState {
  workspaceId: string;
  setWorkspaceId: (workspaceId: string) => void;
}

export const useWorkspace = create<WorkSpaceState>()(
  persist(
    (set) => ({
      workspaceId: "",
      setWorkspaceId: (workspaceId: string) => {
        set({ workspaceId });
      },
    }),
    { name: "workspace", storage: createJSONStorage(() => sessionStorage) },
  ),
);
