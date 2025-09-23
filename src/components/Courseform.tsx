"use client";

import { useState, useTransition, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { addCourse, updateCourse } from "@/lib/actions"; // asegúrate de tener updateCourse
import { Loader2 } from "lucide-react";
import type { Curso } from "@/lib/types";

interface CourseFormProps {
  contactId: string;
  curso?: Curso; // si existe, estamos editando

  onSaved?: () => void; // refrescar lista después de guardar
}

export default function CourseForm({ contactId, curso, onSaved }: CourseFormProps) {
  const [dta, setDta] = useState(curso?.dta?.toString() || "");
  const [nombre, setNombre] = useState(curso?.nombre || "");
  const [estado, setEstado] = useState(curso?.estado || "");
  const [fecha, setFecha] = useState(curso?.fecha || "");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  // si cambia el curso a editar, actualizar los campos
  useEffect(() => {
    if (curso) {
      setDta(curso.dta?.toString() || "");
      setNombre(curso.nombre || "");
      setEstado(curso.estado || "");
      setFecha(curso.fecha || "");
    }
  }, [curso]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (nombre.trim() && estado.trim() && fecha) {
      startTransition(async () => {
        try {
          if (curso) {
            // actualizar curso existente
            await updateCourse(contactId, {
              dta: Number(dta),
              nombre,
              estado,
              fecha,
            });
            toast({
              title: "Curso Actualizado",
              description: "Los datos del curso han sido modificados.",
            });
          } else {
            // crear nuevo curso
            await addCourse(contactId, {
              dta: Number(dta),
              nombre,
              estado,
              fecha,
            });
            toast({
              title: "Curso Registrado",
              description: "Tu nuevo curso ha sido guardado.",
            });
          }

          // limpiar inputs solo si era nuevo
          if (!curso) {
            setDta("");
            setNombre("");
            setEstado("");
            setFecha("");
          }

          if (onSaved) onSaved(); // actualizar lista en el padre
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo guardar el curso.",
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Grid de inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          placeholder="Dta del curso"
          value={dta}
          onChange={(e) => setDta(e.target.value)}
          disabled={isPending || Boolean(curso)} // bloquear dta si es edición
        />
        <Input
          placeholder="Nombre del Curso"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={isPending}
        />
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          disabled={isPending}
          className="w-full rounded-md border border-gray-200 bg-blue-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Selecciona estado...</option>
          <option value="activo">Activo</option>
          <option value="pendiente">Pendiente</option>
          <option value="terminado">Terminado</option>
        </select>
        <Input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          disabled={isPending}
        />
      </div>

      {/* Botón alineado a la derecha */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!dta.trim() || !nombre.trim() || !estado.trim() || !fecha || isPending}
        >
          {isPending && <Loader2 className="animate-spin mr-2" />}
          {curso ? "Actualizar Curso" : "Guardar Curso"}
        </Button>
      </div>
    </form>
  );
}
