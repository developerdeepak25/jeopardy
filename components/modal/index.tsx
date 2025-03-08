import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  title: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({
  title,
  description,
  isOpen,
  onClose,
  children,
}: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            {/* //* though rendering conditionally but title is required */}
            {title && <DialogTitle>{title}</DialogTitle>}
            {/* <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose> */}
          </div>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
