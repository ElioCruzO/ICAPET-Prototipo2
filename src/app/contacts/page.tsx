import { Suspense } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ContactList from "@/components/ContactList";
import ContactForm from "@/components/ContactForm";
import { Input } from "@/components/ui/input";
import { getContacts } from "@/lib/data";
import { Skeleton } from "@/components/ui/skeleton";
import SearchBar from "@/components/SearchBar";
import SectorFilter from "@/components/SectorFilter";

async function Contacts({ query }: { query: string }) {
  const contacts = await getContacts(query);
  return <ContactList contacts={contacts} />;
}

function ContactsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
         <div key={i} className="p-4 border rounded-lg space-y-3">
           <div className="flex items-center gap-4">
             <Skeleton className="h-12 w-12 rounded-full" />
             <div className="space-y-2">
               <Skeleton className="h-4 w-32" />
               <Skeleton className="h-4 w-24" />
             </div>
           </div>
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-full" />
           <Skeleton className="h-4 w-full" />
         </div>
      ))}
    </div>
  );
}

export default function ContactsPage({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const query = searchParams?.query || "";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-foreground">Contactos</h1>
        <div className="flex w-full sm:w-auto gap-2">
          <SectorFilter></SectorFilter>
          <SearchBar placeholder="Buscar contactos..." />

          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Añadir Contacto
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Añadir Nuevo Contacto</DialogTitle>
              </DialogHeader>
              <ContactForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Suspense key={query} fallback={<ContactsSkeleton />}>
        <Contacts query={query} />
      </Suspense>
    </div>
  );
}
