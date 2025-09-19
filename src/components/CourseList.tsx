"use client";

import { useState } from "react";
import type { Curso } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit,
  Trash2,
  Building,
} from 'lucide-react';
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import DeleteCourseDialog from '@/components/DeleteCourseDialog';
import EditCourseDialog from '@/components/EditCourseDialog';

interface CourseListProps {
  cursos: Curso[];
  contactId: string;
}

export default function CourseList({ cursos, contactId }: CourseListProps) {
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

  function getEstadoColor(estado?: string) {
    switch (estado?.toLowerCase()) {
      case "activo":
        return "text-green-600 font-semibold";
      case "pendiente":
        return "text-orange-500 font-semibold";
      case "terminado":
        return "text-red-600 font-semibold";
      default:
        return "text-muted-foreground";
    }
  }

  return (
    <div>
      <ScrollArea className="h-[300px] mt-4 pr-4">
        <div className="flex flex-col gap-3 pb-12">
          {cursos.map((curso) => (
            <div
              key={curso.dta}
              className="rounded-xl border bg-card p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary flex-shrink-0 mt-0.5">
                    <Calendar className="h-4 w-4 text-secondary-foreground" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-foreground truncate">
                      {curso.nombre}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className={`text-sm ${getEstadoColor(curso.estado)}`}>
                        Estado: {curso.estado ?? "⛔ (sin valor)"}
                      </p>
                      <span className="text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">
                        {format(
                          typeof curso.fecha === "string"
                            ? parseISO(curso.fecha)
                            : new Date(curso.fecha),
                          "d 'de' MMMM, yyyy",
                          { locale: es }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <EditCourseDialog contactId={String(contactId)} curso={curso} />
                  <DeleteCourseDialog dta={Number(curso.dta)} contactId={String(contactId)}>
                    <Button variant="destructive" size="sm" className="h-8 w-8 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DeleteCourseDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}