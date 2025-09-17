
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import CourseForm from '@/components/Courseform';
import type { Curso } from "@/lib/types";

interface EditCourseDialogProps {
  contactId: string;
  curso: Curso;
  onSaved?: () => void; // refrescar lista en el padre
}

export default function EditCourseDialog({ contactId, curso, onSaved }: EditCourseDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Edit className="mr-2 h-4 w-4" /> Editar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Curso</DialogTitle>
        </DialogHeader>

        <CourseForm
          contactId={contactId}
          curso={curso}
          onSaved={() => {
            if (onSaved) onSaved(); // refresca lista padre
            setOpen(false); // 🔥 cierra la ventana
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
