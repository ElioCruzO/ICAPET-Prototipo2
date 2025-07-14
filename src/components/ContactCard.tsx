import Link from 'next/link';
import { Mail, Phone, MapPin, User } from 'lucide-react';
import type { Contact } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ContactCardProps {
  contact: Contact;
}

export default function ContactCard({ contact }: ContactCardProps) {
  const initials = contact.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <Link href={`/contacts/${contact.id}`} className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
      <Card className="h-full transform transition-transform duration-200 hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{contact.name}</CardTitle>
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
      </Card>
    </Link>
  );
}
