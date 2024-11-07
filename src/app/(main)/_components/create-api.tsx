import CreateAPIKeyForm from "@/components/form/create-api";
import { Button } from "@/components/ui/button";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const CreateAPIKey = ({
  show = true,
  className,
}: {
  show?: boolean;
  className?: string;
}) => {
  return (
    <Modal>
      <ModalTrigger asChild>
        {show ? (
          <Button variant="shine" className={cn("h-9 py-1", className)}>
            <Plus className="mr-2 h-4 w-4" /> Create API Key
          </Button>
        ) : (
          <Button variant="shine" className={cn("h-9 py-1", className)}>
            <Plus className="mr-0 h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Create API Key</span>
          </Button>
        )}
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle className="text-left">Create new API key</ModalTitle>
          <ModalDescription className="text-left">
            Create a new API key to get started
          </ModalDescription>
        </ModalHeader>

        <CreateAPIKeyForm />
      </ModalContent>
    </Modal>
  );
};

export default CreateAPIKey;
