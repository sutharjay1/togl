import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ModalType = "RENAME" | "WORKSPACE" | "PROJECT" | "NONE";

const defaultValues = {
  id: "",
  title: "",
};

interface ModalState {
  isOpen: boolean;
  modalType: ModalType | null;
  initialValues: {
    id?: string;
    title?: string;
  };
  onOpen: (type: ModalType, values?: { id?: string; title?: string }) => void;
  onClose: () => void;
}

export const useModal = create<ModalState>()(
  persist(
    (set) => ({
      isOpen: false,
      modalType: null,
      initialValues: defaultValues,
      onOpen: (type: ModalType, values?: { id?: string; title?: string }) => {
        const initialValues = values || defaultValues;
        set({ isOpen: true, modalType: type, initialValues });
      },
      onClose: () =>
        set({ isOpen: false, modalType: "NONE", initialValues: defaultValues }),
    }),
    { name: "rename-modal", storage: createJSONStorage(() => localStorage) },
  ),
);
