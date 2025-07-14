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
        title: "Contacto Eliminado",
        description: `"${contact.name}" ha sido eliminado permanentemente.`,
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
          <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el
            contacto y todo su historial de interacciones.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
