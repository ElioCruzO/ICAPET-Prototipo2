import { getContactById } from "@/lib/data";
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
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import ContactForm from "@/components/ContactForm";
import DeleteContactDialog from "@/components/DeleteContactDialog";
import InteractionList from "@/components/InteractionList";
import InteractionForm from "@/components/InteractionForm";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Mapeo de sectores a colores
const sectorColors: Record<string, string> = {
  'autoridades-municipales': 'bg-blue-500',
  'educacion-media-superior': 'bg-green-500',
  'reclusorios': 'bg-red-500',
  'gobierno-estado': 'bg-purple-500',
  'gobierno-federal': 'bg-indigo-500',
  'oficinas-centrales': 'bg-yellow-500',
  'gasolineras': 'bg-orange-500',
  'organizaciones-productivas': 'bg-teal-500',
  'empresas': 'bg-cyan-500',
  'organizaciones-empresariales': 'bg-pink-500',
  'otros': 'bg-gray-500'
};

// Función para obtener el color según el sector
const getSectorColor = (sectorId: string, sectorName?: string): string => {
  return sectorColors[sectorId] || 
         (sectorName ? sectorColors[sectorName.toLowerCase().replace(/\s+/g, '-')] : 'bg-gray-500') || 
         'bg-gray-500';
};

// Función para obtener el nombre del sector
const getSectorName = (contact: any): string => {
  return contact.sector?.nombre || 'Sector no especificado';
};

// Función para obtener el ID del sector para colores
const getSectorIdForColor = (contact: any): string => {
  return contact.sector?.id || contact.sector?.nombre?.toLowerCase().replace(/\s+/g, '-') || 'otros';
};

async function ContactDetails({ id }: { id: string }) {
  const contact = await getContactById(id);

  if (!contact) {
    notFound();
  }

  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const sectorName = getSectorName(contact);
  const sectorIdForColor = getSectorIdForColor(contact);
  const sectorColor = getSectorColor(sectorIdForColor, contact.sector?.nombre);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Columna izquierda - Información del contacto */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader className="text-center">
            <Avatar className="mx-auto h-24 w-24 text-3xl mb-4">
              <AvatarFallback className={sectorColor}>{initials}</AvatarFallback>
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
                  <ContactForm contact={contact} />
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
                id="tab-cursos" 
                name="vertical-tabs" 
                className="hidden"
              />

              {/* Pestañas/Headers */}
              <div className="flex flex-col">
                <label 
                  htmlFor="tab-interacciones" 
                  className="cursor-pointer border border-b-0 rounded-t-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center font-medium"
                >
                  <span>Historial de Interacciones</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                </label>
                
                <label 
                  htmlFor="tab-cursos" 
                  className="cursor-pointer border border-t-0 rounded-b-lg px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex justify-between items-center font-medium"
                >
                  <span>Cursos Registrados</span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-300" />
                </label>
              </div>

              {/* Contenedor de contenido con altura fija */}
              <div className="relative min-h-[500px] border-l border-r border-b rounded-b-lg overflow-hidden">
                
                {/* Contenido de Interacciones */}
                <div 
                  className="absolute inset-0 p-6 bg-white transition-transform duration-500 ease-in-out transform translate-x-0 opacity-100"
                  style={{
                    transform: 'translateX(0)',
                    opacity: 1
                  }}
                  id="content-interacciones"
                >
                  <div className="space-y-4">
                    <InteractionForm contactId={contact.id} />
                    <InteractionList interactions={contact.interactions || []} />
                  </div>
                </div>

                {/* Contenido de Cursos */}
                <div 
                  className="absolute inset-0 p-6 bg-white transition-transform duration-500 ease-in-out transform translate-x-full opacity-0"
                  style={{
                    transform: 'translateX(100%)',
                    opacity: 0
                  }}
                  id="content-cursos"
                >
                  <div className="space-y-4 h-full overflow-y-auto">
                    <form className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">DTA</label>
                        <input
                          type="text"
                          name="dta"
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Ingresa DTA"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Nombre del Curso</label>
                        <input
                          type="text"
                          name="nombre"
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Nombre del curso"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Estado</label>
                        <select
                          name="estado"
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="activo">Activo</option>
                          <option value="terminado">Terminado</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Fecha de Registro</label>
                        <input
                          type="date"
                          name="fecha"
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Folio</label>
                        <input
                          type="text"
                          name="folio"
                          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="Folio"
                        />
                      </div>

                      <Button type="submit" className="w-full hover:bg-blue-600 transition-colors duration-200">
                        Guardar Curso
                      </Button>
                    </form>
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

export default async function ContactDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <>
      {/* Estilos CSS globales para el acordeón */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Cuando se selecciona Interacciones */
          #tab-interacciones:checked ~ .flex label[for="tab-interacciones"] .h-4 {
            transform: rotate(180deg);
          }
          
          #tab-interacciones:checked ~ .flex label[for="tab-interacciones"] {
            background-color: rgb(239 246 255);
            border-bottom-color: white;
          }
          
          #tab-interacciones:checked ~ .relative #content-interacciones {
            transform: translateX(0) !important;
            opacity: 1 !important;
          }
          
          #tab-interacciones:checked ~ .relative #content-cursos {
            transform: translateX(100%) !important;
            opacity: 0 !important;
          }

          /* Cuando se selecciona Cursos */
          #tab-cursos:checked ~ .flex label[for="tab-cursos"] .h-4 {
            transform: rotate(180deg);
          }
          
          #tab-cursos:checked ~ .flex label[for="tab-cursos"] {
            background-color: rgb(239 246 255);
            border-top-color: white;
          }
          
          #tab-cursos:checked ~ .relative #content-interacciones {
            transform: translateX(-100%) !important;
            opacity: 0 !important;
          }
          
          #tab-cursos:checked ~ .relative #content-cursos {
            transform: translateX(0) !important;
            opacity: 1 !important;
          }
        `
      }} />
      
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