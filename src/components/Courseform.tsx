"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Curso } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addCourse, updateCourse } from "@/lib/actions";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface CourseFormProps {
  course?: Curso;
  setOpen?: (open: boolean) => void;
}

// esquema de validación usando los nombres reales de Curso
const courseSchema = z.object({
  dta: z.string().min(1, "El DTA es obligatorio."),
  nombre: z.string().min(2, "El nombre del curso debe tener al menos 2 caracteres."),
  estado: z.string().min(1, "Debe seleccionar un estado."),
  fecha: z.string().min(1, "La fecha de registro es obligatoria."),
});

const estados = ["Activo", "Terminado", "Inconcluso"];

export default function CourseForm({ course, setOpen }: CourseFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof courseSchema>>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      dta: course?.dta || "",
      nombre: course?.nombre || "",
      estado: course?.estado || "",
      fecha: course?.fecha || "",
    },
  });

  async function onSubmit(values: z.infer<typeof courseSchema>) {
    setIsSubmitting(true);
    try {
      if (course) {
        await updateCourse(course.dta, values);
        toast({
          title: "Curso Actualizado",
          description: `${values.nombre} ha sido actualizado exitosamente.`,
        });
      } else {
        await addCourse(values);
        toast({
          title: "Curso Añadido",
          description: `${values.nombre} ha sido añadido exitosamente.`,
        });
      }
      setOpen?.(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el curso. Inténtelo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        {/* DTA */}
        <FormField
          control={form.control}
          name="dta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DTA</FormLabel>
              <FormControl>
                <Input placeholder="001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Nombre del Curso */}
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Curso</FormLabel>
              <FormControl>
                <Input placeholder="Introducción a React" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Estado */}
        <FormField
          control={form.control}
          name="estado"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full rounded-md border border-gray-300 p-2"
                >
                  <option value="">Seleccione un estado</option>
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fecha de Registro */}
        <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Registro</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botones */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin mr-2" />}
            {course ? "Guardar Cambios" : "Añadir Curso"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
