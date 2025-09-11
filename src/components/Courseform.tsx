"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { addCourse } from "@/lib/actions";
import { Loader2 } from "lucide-react";

interface CourseFormProps {
  contactId: string;
  onSaved?: () => void; // opción para refrescar la lista
}

export default function CourseForm({ contactId, onSaved }: CourseFormProps) {
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
          await addCourse(contactId,{
            dta:Number(dta),
            nombre,
            estado,
            fecha,
          });

          toast({
            title: "Curso Registrado",
            description: "Tu nuevo curso ha sido guardado.",
          });

          // limpiar inputs
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
        placeholder="Dta del curso"
        value={dta}
        onChange={(e) => setDta(e.target.value)}
        disabled={isPending}
      />
      <Input
        placeholder="Nombre del Curso"
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
        <Button
          type="submit"
          disabled={!dta.trim() || !nombre.trim() || !estado.trim() || !fecha || isPending}
        >
          {isPending && <Loader2 className="animate-spin mr-2" />}
          Guardar Curso
        </Button>
      </div>
    </form>
  );
}
