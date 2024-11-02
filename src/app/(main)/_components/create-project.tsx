import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { Plus } from "lucide-react";

const CreateProject = ({ show = true }: { show?: boolean }) => {
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

        <div className="grid gap-4 py-4">
          <Label htmlFor="project-name">Project name</Label>
          <Input placeholder="Project name" />
        </div>

        <ModalFooter>
          <Button variant="outline" className="hidden sm:flex">
            Cancel
          </Button>
          <Button variant="shine" className="py-1">
            Create Project
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateProject;
