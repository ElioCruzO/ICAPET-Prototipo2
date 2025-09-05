<<<<<<< HEAD
import { getContactById } from "@/lib/data";
import { getCoursesContact, deleteContact } from "@/lib/actions";
=======
import { getContactById } from '@/lib/data';
>>>>>>> 210b55727ff71a6cf6d745f022cb72f2650634c2
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit,
  Trash2,
  Building,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ContactForm from '@/components/ContactForm';
import CourseForm from '@/components/Courseform';
import DeleteContactDialog from '@/components/DeleteContactDialog';
import InteractionList from '@/components/InteractionList';
import InteractionForm from '@/components/InteractionForm';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

// Mapeo de sectores a colores
const sectorColors: Record<string, string> = {
  'autoridades-municipales': 'bg-blue-500',
  'educacion-media-superior': 'bg-green-500',
  reclusorios: 'bg-red-500',
  'gobierno-estado': 'bg-purple-500',
  'gobierno-federal': 'bg-indigo-500',
  'oficinas-centrales': 'bg-yellow-500',
  gasolineras: 'bg-orange-500',
  'organizaciones-productivas': 'bg-teal-500',
  empresas: 'bg-cyan-500',
  'organizaciones-empresariales': 'bg-pink-500',
  otros: 'bg-gray-500',
};

// Función para obtener el color según el sector
const getSectorColor = (sector?: any): string => {
  return (
    sectorColors[sector.nombre] ||
    (sector.nombre
      ? sectorColors[sector.nombre.toLowerCase().replace(/\s+/g, '-')]
      : 'bg-gray-500') ||
    'bg-gray-500'
  );
};

// Función para obtener el nombre del sector
const getSectorName = (contact: any): string => {
  return contact.sector?.nombre || 'Sector no especificado';
};

// Función para obtener el ID del sector para colores
const getSectorIdForColor = (contact: any): string => {
  return (
    contact.sector?.id ||
    contact.sector?.nombre?.toLowerCase().replace(/\s+/g, '-') ||
    'otros'
  );
};

// Componente para mostrar la tabla de cursos
async funtion CoursesTable ({ contactId }: { contactId: string }) {
  const
}
async function ContactDetails({ id }: { id: string }) {
  const contact = await getContactById(id);

  if (!contact) {
    notFound();
  }

  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const sectorName = getSectorName(contact);
  // const sectorIdForColor = getSectorIdForColor(contact);
  const sectorColor = getSectorColor(contact.sector);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna izquierda - Información del contacto */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader className="text-center">
            <Avatar className="mx-auto h-24 w-24 text-3xl mb-4">
              <AvatarFallback className={sectorColor}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{contact.name}</CardTitle>
            <div className="flex justify-center mt-2">
              <Badge className={`${sectorColor} text-white`}>
                {sectorName}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <div className="flex items-center gap-3">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <span className="text-foreground">{contact.cargo}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-foreground">{contact.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span className="text-foreground">{contact.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <span className="text-foreground">{contact.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-muted-foreground" />
              <span className="text-foreground">{sectorName}</span>
            </div>
            <Separator />
            <div className="flex gap-2 pt-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Edit className="mr-2 h-4 w-4" /> Editar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Editar Contacto</DialogTitle>
                  </DialogHeader>
                  <ContactForm contact={contact}  />
                </DialogContent>
              </Dialog>
              <DeleteContactDialog contactId={contact.id}>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </Button>
              </DeleteContactDialog>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Columna derecha - Acordeón vertical */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Detalles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {/* Radio inputs ocultos para controlar el estado */}
              <input
                type="radio"
                id="tab-interacciones"
                name="vertical-tabs"
                defaultChecked
                className="hidden"
              />
              <input
                type="radio"
                id="tab-listaC"
                name="vertical-tabs"
                className="hidden"
              />

              {/* Pestañas/Headers */}
              <div className="flex flex-row gap-2">
                <label
                  htmlFor="tab-interacciones"
                  className="cursor-pointer border rounded-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 font-medium"
                >
                  Historial de Interacciones
                </label>

                <label
                  htmlFor="tab-listaC"
                  className="cursor-pointer border rounded-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 font-medium"
                >
                  Cursos
                </label>
              </div>

              {/* Contenedor de contenido con altura fija */}
              <div className="relative min-h-[500px] border-l border-r border-b rounded-b-lg overflow-hidden">
                {/* Contenido de Interacciones */}
                <div
                  className="absolute inset-0 p-6 bg-white transition-transform duration-500 ease-in-out transform translate-x-0 opacity-100 overflow-y-auto"
                  style={{
                    transform: 'translateX(0)',
                    opacity: 1,
                  }}
                  id="content-interacciones"
                >
                  <div className="space-y-4">
                    <InteractionForm contactId={contact.id} />
                    <InteractionList
                      interactions={contact.interactions || []}
                    />
                  </div>
                </div>

                {/* Contenido de Cursos */}
                <div
                  className="absolute inset-0 p-6 bg-white transition-transform duration-500 ease-in-out transform translate-x-full opacity-0 overflow-y-auto"
                  style={{
                    transform: 'translateX(100%)',
                    opacity: 0,
                  }}
                  id="content-cursos"
                >
                  <div className="space-y-4">
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          DTA
                        </label>
                        <input
                          type="text"
                          name="dta"
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Ingresa DTA"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Nombre del Curso
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Nombre del curso"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Estado
                        </label>
                        <select
                          name="estado"
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="activo">Activo</option>
                          <option value="terminado">Terminado</option>
                          <option value="inconcluso">Inconcluso</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Fecha de Registro
                        </label>
                        <input
                          type="date"
                          name="fecha"
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full hover:bg-blue-600 transition-colors duration-200"
                      >
                        Guardar Curso
                      </Button>
                    </form>
                  </div>
                </div>

                {/* Contenido de Lista de Cursos */}
                <div
                  className="absolute inset-0 bg-white transition-transform duration-500 ease-in-out transform translate-x-full opacity-0 flex flex-col"
                  style={{
                    transform: 'translateX(100%)',
                    opacity: 0,
                  }}
                  id="content-listaC"
                >
                  {/* Header fijo */}
                  <div className="p-6 pb-4 border-b bg-white flex-shrink-0">
                    <div className="flex justify-between ittems-center">
                      <h3 className="text-lg font-semibold">
                        Lista de Cursos Registrados
                      </h3>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600">
                            Agregar curso
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle> Agregar Curso</DialogTitle>
                          </DialogHeader>
                          <CourseForm course={null} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  {/* Contenido scrolleable */}
                  <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto px-6 pb-6">
                      <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300 rounded-lg">
                          <thead className="bg-gray-100 sticky top-0 z-10">
                            <tr>
<<<<<<< HEAD
                              <th className="px-4 py-3 text-left border-b font-medium">DTA</th>
                              <th className="px-4 py-3 text-left border-b font-medium">Nombre del Curso</th>
                              <th className="px-4 py-3 text-left border-b font-medium">Estado</th>
                              <th className="px-4 py-3 text-left border-b font-medium">Fecha de Registro</th>
                              <th className="px-4 py-3 text-left border-b font-medium">Editar</th>
                              <th className="px-4 py-3 text-left border-b font-medium">Eliminar</th>
=======
                              <th className="px-4 py-3 text-left border-b font-medium">
                                DTA
                              </th>
                              <th className="px-4 py-3 text-left border-b font-medium">
                                Nombre del Curso
                              </th>
                              <th className="px-4 py-3 text-left border-b font-medium">
                                Estado
                              </th>
                              <th className="px-4 py-3 text-left border-b font-medium">
                                Fecha de Registro
                              </th>
                              <th className="px-4 py-3 text-left border-b font-medium">
                                Ediar
                              </th>
                              <th className="px-4 py-3 text-left border-b font-medium">
                                Eliminar
                              </th>
>>>>>>> 210b55727ff71a6cf6d745f022cb72f2650634c2
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="px-4 py-2 border">001</td>
                              <td className="px-4 py-2 border">
                                Introducción a React
                              </td>
                              <td className="px-4 py-2 border">Activo</td>
                              <td className="px-4 py-2 border">2025-08-29</td>
                              <td className="px-4 py-2 border text-center">
                                <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600">
                                  Editar
                                </button>
                              </td>
                              <td className="px-4 py-2 border text-center">
                                <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 border">002</td>
                              <td className="px-4 py-2 border">
                                Bases de Datos
                              </td>
                              <td className="px-4 py-2 border">Finalizado</td>
                              <td className="px-4 py-2 border">2025-07-20</td>
                              <td className="px-4 py-2 border text-center">
                                <button className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600">
                                  Editar
                                </button>
                              </td>
                              <td className="px-4 py-2 border text-center">
                                <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
                                  Eliminar
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ContactDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader className="text-center">
            <Skeleton className="mx-auto h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-8 w-40 mx-auto" />
            <Skeleton className="h-6 w-32 mx-auto mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Separator />
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-60" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function ContactDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  return (
    <>
      {/* Estilos CSS globales para el acordeón */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
    /* Estructura general - los labels ahora están en flex-row */
    #tab-interacciones:checked ~ .flex-row label[for="tab-interacciones"],
    #tab-cursos:checked ~ .flex-row label[for="tab-cursos"],
    #tab-listaC:checked ~ .flex-row label[for="tab-listaC"] {
      background-color: rgb(239 246 255);
      border-color: rgb(59 130 246);
    }

    /* Cuando se selecciona Interacciones */
    #tab-interacciones:checked ~ .relative #content-interacciones {
      transform: translateX(0) !important;
      opacity: 1 !important;
    }
    #tab-interacciones:checked ~ .relative #content-cursos,
    #tab-interacciones:checked ~ .relative #content-listaC {
      transform: translateX(100%) !important;
      opacity: 0 !important;
    }

    /* Cuando se selecciona Lista de Cursos */
    #tab-listaC:checked ~ .relative #content-listaC {
      transform: translateX(0) !important;
      opacity: 1 !important;
    }
    #tab-listaC:checked ~ .relative #content-interacciones,
    #tab-listaC:checked ~ .relative #content-cursos {
      transform: translateX(-100%) !important;
      opacity: 0 !important;
    }

    /* Estados iniciales */
    #content-interacciones {
      transform: translateX(0);
      opacity: 1;
    }
    #content-cursos, #content-listaC {
      transform: translateX(100%);
      opacity: 0;
    }
    
    /* Personalizar scrollbar */
    #content-listaC .overflow-y-auto::-webkit-scrollbar {
      width: 8px;
    }
    
    #content-listaC .overflow-y-auto::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 6px;
    }
    
    #content-listaC .overflow-y-auto::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 6px;
    }
    
    #content-listaC .overflow-y-auto::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    
    /* Para Firefox */
    #content-listaC .overflow-y-auto {
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f1f5f9;
    }
  `,
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/contacts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Contactos
            </Link>
          </Button>
        </div>
        <Suspense fallback={<ContactDetailsSkeleton />}>
          <ContactDetails id={id} />
        </Suspense>
      </div>
    </>
  );
}
