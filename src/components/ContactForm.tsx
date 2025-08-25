"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Contact } from "@/lib/types";
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
import { addContact, updateContact } from "@/lib/actions";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import SectorList from "./SectorList";

interface ContactFormProps {
  contact?: Contact;
  setOpen?: (open: boolean) => void;
}

const contactSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres."),
  email: z.string().email("Dirección de correo electrónico inválida."),
  phone: z.string().min(10, "El número de teléfono es demasiado corto."),
  location: z.string().min(2, "La ubicación es obligatoria."),
  sector: z.string().min(1, "Debe seleccionar un sector."),
  cargo: z.string().min(2, "El cargo es obligatorio."),
});

export default function ContactForm({ contact, setOpen }: ContactFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact?.name || "",
      email: contact?.email || "",
      phone: contact?.phone || "",
      location: contact?.location || "",
      sector: contact?.sector || "",
      cargo: contact?.cargo || "",
    },
  });

  // Sincroniza el sector si estamos editando un contacto
  useEffect(() => {
    if (contact?.sector) {
      form.setValue("sector", contact.sector);
    }
  }, [contact, form]);

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setIsSubmitting(true);
    try {
      if (contact) {
        await updateContact(contact.id, values);
        toast({
          title: "Contacto Actualizado",
          description: `${values.name} ha sido actualizado exitosamente.`,
        });
      } else {
        await addContact(values);
        toast({
          title: "Contacto Añadido",
          description: `${values.name} ha sido añadido exitosamente.`,
        });
      }

      // Cierra el modal/pestaña después de guardar
      setOpen?.(false);

    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el contacto. Inténtelo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        {/* Nombre */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Teléfono */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input placeholder="123-456-7890" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ubicación */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Ciudad, País" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sector usando SectorList */}
        <FormField
          control={form.control}
          name="sector"
          render={() => (
            <FormItem>
              <FormLabel>Sector</FormLabel>
              <FormControl>
                <SectorList
                  onSelect={(sector) => form.setValue("sector", sector)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Cargo */}
        <FormField
          control={form.control}
          name="cargo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cargo</FormLabel>
              <FormControl>
                <Input placeholder="Community Manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botones */}
        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen?.(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="animate-spin mr-2" />}
            {contact ? "Guardar Cambios" : "Añadir Contacto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
