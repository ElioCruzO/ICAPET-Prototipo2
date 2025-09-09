"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { addCourse } from "@/lib/actions";
import { Loader2 } from "lucide-react";

interface CourseFormProps {
  contactoId: string;
  onSaved?: () => void; // opción para refrescar la lista
}

export default function CourseForm({ contactoId, onSaved }: CourseFormProps) {
    const [dta, setDta] = useState("");
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState("");
  const [fecha, setFecha] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nombre.trim() && estado.trim() && fecha) {
      startTransition(async () => {
        try {
          await addCourse( contactoId, { dta, nombre, estado, fecha });
          toast({
            title: "Curso Registrado",
            description: "Tu nuevo curso ha sido guardado.",
          });
          setDta("");
          setNombre("");
          setEstado("");
          setFecha("");
          if (onSaved) onSaved(); // refrescar lista si se pasa la función
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo registrar el curso.",
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="Nombre del curso"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        disabled={isPending}
      />
      <Input
        placeholder="Estado del curso"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
        disabled={isPending}
      />
      <Input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        disabled={isPending}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!nombre.trim() || !estado.trim() || !fecha || isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          Guardar Curso
        </Button>
      </div>
    </form>
  );
}
