"use client";

import { useState } from "react";
import type { Curso } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";


interface CourseListProps {
  cursos: Curso[];
  onDelete: (id: number) => void;
}

export default function CourseList({ cursos, onDelete }: CourseListProps) {
  if (cursos.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg mt-4">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-foreground">Sin Cursos</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Registra tu primer curso arriba.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-96 mt-4 pr-4">
      <div className="space-y-6">
        {cursos.map((curso) => (
          <div key={curso.dta} className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                <Calendar className="h-4 w-4 text-secondary-foreground" />
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{curso.nombre}</p>
              <p className="text-sm text-muted-foreground mt-1">Estado: {curso.estado ?? "⛔ (sin valor)"}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {format(
                  typeof curso.fecha === "string"
                    ? parseISO(curso.fecha)
                    : new Date(curso.fecha),
                  "d 'de' MMMM, yyyy",
                  { locale: es }
                )}
              </p>
            </div>
            <button
              onClick={() => onDelete(curso.dta)}
              className="ml-4 bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
