import CreateTokenForm from "@/features/flags/components/create-flag-form";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { Plus } from "lucide-react";
import React from "react";

const CreateFlag = ({
  show = true,
  setIsUpdated,
}: {
  show?: boolean;
  setIsUpdated: (value: boolean) => void;
}) => {
  return (
    <Modal>
      <ModalTrigger asChild>
        {show ? (
          <Button variant="shine" className="h-9 py-1">
            <Plus className="mr-2 h-4 w-4" /> New Flag
          </Button>
        ) : (
          <Button variant="shine" className="h-9 py-1">
            <Plus className="mr-0 h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">New Flag</span>
          </Button>
        )}
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle className="text-left">Create new flag</ModalTitle>
          <ModalDescription className="text-left">
            Create a new flag to get started
          </ModalDescription>
        </ModalHeader>

        <CreateTokenForm setIsUpdated={setIsUpdated} />
      </ModalContent>
    </Modal>
  );
};

export default CreateFlag;
