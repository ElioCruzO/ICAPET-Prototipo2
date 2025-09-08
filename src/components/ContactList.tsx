import type { Contact } from "@/lib/types";
import ContactCard from "./ContactCard";
import { FileQuestion } from "lucide-react";

interface ContactListProps {
  contacts: Contact[];
}

export default function ContactList({ contacts }: ContactListProps) {
  if (contacts.length === 0) {
    return (
      <div className="text-center py-20 border-2 border-dashed rounded-lg">
        <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-foreground">Aún no hay contactos</h3>
        <p className="mt-1 text-sm text-muted-foreground">Empieza añadiendo un nuevo contacto.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {contacts.map((contact) => (
        <ContactCard key={contact.id} contact={contact} />
      ))}
    </div>
  );
}
