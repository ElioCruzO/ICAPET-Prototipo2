"use client";

import { useContactStore } from "@/store/contacts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface DeleteContactDialogProps {
  contactId: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess?: () => void;
  children: React.ReactNode;
}

export default function DeleteContactDialog({
  contactId,
  open,
  setOpen,
  onSuccess,
  children,
}: DeleteContactDialogProps) {
  const { deleteContact, getContactById } = useContactStore();
  const { toast } = useToast();

  const handleDelete = () => {
    const contact = getContactById(contactId);
    if (contact) {
      deleteContact(contactId);
      toast({
        title: "Contact Deleted",
        description: `"${contact.name}" has been permanently deleted.`,
        variant: 'destructive',
      });
      onSuccess?.();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            contact and all their interaction history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
