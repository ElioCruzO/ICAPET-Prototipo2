'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { Contact } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addContact, updateContact, getSectores } from '@/lib/actions';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface ContactFormProps {
  contact?: Contact;
  setOpen?: (open: boolean) => void;
}

const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  email: z.string().email('Dirección de correo electrónico inválida.'),
  phone: z.string().min(10, 'El número de teléfono es demasiado corto.'),
  location: z.string().min(2, 'La ubicación es obligatoria.'),
  sector: z.number(),
  cargo: z.string().min(2, 'El cargo es obligatorio.'),
  folio: z.string().min(1, 'El folio es obligatorio.'),
  fecha_vinculacion: z
    .string()
    .min(1, 'La fecha de vinculación es obligatoria.'),
});

export default function ContactForm({ contact, setOpen }: ContactFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sectores, setSectores] = useState<{ id: number; nombre: string }[]>([]);
  const [isLoadingSectores, setIsLoadingSectores] = useState(true);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: contact?.name || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      location: contact?.location || '',
      // ✅ Establece el sector correctamente
      sector: contact?.sector || parseInt(contact?.sectorId?.toString() || '0') || 0,
      cargo: contact?.cargo || '',
      folio: contact?.folio || '',
      fecha_vinculacion: contact?.fechaVinculacion || '',
    },
  });

  // ✅ Cargar sectores al montar el componente
  useEffect(() => {
    const fetchSectores = async () => {
      try {
        setIsLoadingSectores(true);
        const response = await getSectores();
        
        // ✅ Serializar los datos para evitar el error de prototipos
        const sectoresPlanos = response.map((sector: any) => ({
          id: Number(sector.id),
          nombre: String(sector.nombre)
        }));
        
        setSectores(sectoresPlanos);
        console.log('Sectores cargados:', sectoresPlanos);
      } catch (error) {
        console.error('Error cargando sectores:', error);
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los sectores.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingSectores(false);
      }
    };

    fetchSectores();
  }, [toast]);

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    setIsSubmitting(true);
    try {
      console.log('Valores a enviar:', values);
      
      if (contact) {
        await updateContact(contact.id, values);
        toast({
          title: 'Contacto Actualizado',
          description: `${values.name} ha sido actualizado exitosamente.`,
        });
      } else {
        await addContact(values);
        toast({
          title: 'Contacto Añadido',
          description: `${values.name} ha sido añadido exitosamente.`,
        });
      }

      setOpen?.(false);
    } catch (error) {
      console.error('Error al guardar contacto:', error);
      toast({
        title: 'Error',
        description: 'No se pudo guardar el contacto. Inténtelo de nuevo.',
        variant: 'destructive',
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

        {/* ✅ Sector con select nativo */}
        <FormField
          control={form.control}
          name="sector"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sector</FormLabel>
              <FormControl>
                <select
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value ? parseInt(e.target.value) : 0;
                    console.log('Sector seleccionado:', value);
                    field.onChange(value);
                  }}
                  disabled={isLoadingSectores || isSubmitting}
                  className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full bg-transparent"
                >
                  <option value="">
                    {isLoadingSectores ? 'Cargando sectores...' : 'Selecciona un sector...'}
                  </option>
                  {sectores.map((sector) => (
                    <option key={sector.id} value={sector.id}>
                      {sector.nombre}
                    </option>
                  ))}
                </select>
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

        {/* Folio */}
        <FormField
          control={form.control}
          name="folio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folio</FormLabel>
              <FormControl>
                <Input placeholder="F12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fecha de Vinculación */}
        <FormField
          control={form.control}
          name="fecha_vinculacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fecha de Vinculación</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Botones */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit" disabled={isSubmitting || isLoadingSectores}>
            {isSubmitting && <Loader2 className="animate-spin mr-2" />}
            {contact ? 'Guardar Cambios' : 'Añadir Contacto'}
          </Button>
        </div>
      </form>
    </Form>
  );
}