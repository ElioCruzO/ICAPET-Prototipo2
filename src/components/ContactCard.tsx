import Link from 'next/link';
import { Mail, Phone, MapPin, Building } from 'lucide-react';
import type { Contact, Sector } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ContactCardProps {
  contact: Contact;
}

// Mapeo de sectores a colores (usando ID o nombre)
const sectorColors: Record<string, string> = {
  // Puedes mapear por ID o por nombre, dependiendo de lo que sea más estable
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
  // Primero intenta por ID, luego por nombre, luego default
  return sectorColors[sectorId] || 
         (sectorName ? sectorColors[sectorName.toLowerCase().replace(/\s+/g, '-')] : undefined) || 
         'bg-gray-500';
};

// Función para obtener el nombre del sector
const getSectorName = (contact: Contact): string => {
  return contact.sector?.nombre || 'Sector no especificado';
};

// Función para obtener el ID del sector para colores
const getSectorIdForColor = (contact: Contact): string => {
  // Si tienes IDs consistentes, usa el ID. Si no, usa el nombre normalizado
  return contact.sector?.id || contact.sector?.nombre.toLowerCase().replace(/\s+/g, '-') || 'otros';
};

// Función para obtener la cantidad de interacciones (maneja el caso undefined)
const getInteractionsCount = (contact: Contact): number => {
  return contact.interactions?.length || 0;
};

// Función para obtener la última interacción (maneja el caso undefined)
const getLastInteractionDate = (contact: Contact): string | null => {
  if (!contact.interactions || contact.interactions.length === 0) {
    return null;
  }
  
  // Ordenar por fecha (más reciente primero) y obtener la primera
  const sortedInteractions = [...contact.interactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return sortedInteractions[0].date;
};

// Función para formatear la fecha
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function ContactCard({ contact }: ContactCardProps) {
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  const sectorName = getSectorName(contact);
  const sectorIdForColor = getSectorIdForColor(contact);
  const sectorColor = getSectorColor(sectorIdForColor, contact.sector?.nombre);
  const interactionsCount = getInteractionsCount(contact);
  const lastInteractionDate = getLastInteractionDate(contact);

  return (
    <Link href={`/contacts/${contact.id}`} className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
      <Card className="h-full transform transition-transform duration-200 hover:-translate-y-1 flex flex-col">
        <div className="flex-grow">
          <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
            <Avatar>
              <AvatarFallback className={sectorColor}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">{contact.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{contact.cargo}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{contact.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{contact.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{contact.location}</span>
            </div>
          </CardContent>
        </div>
        {/* Barra de color para el sector */}
        <div className="mt-2 px-4 pb-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Sector:</span>
            <div className={`text-xs font-semibold px-2 py-1 rounded-full ${sectorColor} text-white`}>
              {sectorName}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}