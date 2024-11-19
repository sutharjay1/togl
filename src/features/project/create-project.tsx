import CreateProjectForm from "@/components/form/create-project";
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

const CreateProject = ({
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
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        ) : (
          <Button variant="shine" className="h-9 py-1">
            <Plus className="mr-0 h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">New Project</span>
          </Button>
        )}
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle className="text-left">Create new project</ModalTitle>
          <ModalDescription className="text-left">
            Create a new project to get started
          </ModalDescription>
        </ModalHeader>

        <CreateProjectForm setIsUpdated={setIsUpdated} />
      </ModalContent>
    </Modal>
  );
};

export default CreateProject;
