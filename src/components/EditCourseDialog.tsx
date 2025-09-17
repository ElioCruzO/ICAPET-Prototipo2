"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import CourseForm from '@/components/Courseform';
import type { Curso } from "@/lib/types";

interface EditCourseDialogProps {
  contactId: string;
  curso: Curso;       // el curso que vas a editar
  onSaved?: () => void; // refrescar lista después de guardar
}

export default function EditCourseDialog({ contactId, curso, onSaved }: EditCourseDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Edit className="mr-2 h-4 w-4" /> Editar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Curso</DialogTitle>
        </DialogHeader>
        
        <CourseForm contactId={contactId} curso={curso} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}
