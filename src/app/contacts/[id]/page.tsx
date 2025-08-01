import { getContactById } from "@/lib/data";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Edit,
  Trash2,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import ContactForm from "@/components/ContactForm";
import DeleteContactDialog from "@/components/DeleteContactDialog";
import InteractionList from "@/components/InteractionList";
import InteractionForm from "@/components/InteractionForm";
import InteractionSummary from "@/components/InteractionSummary";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function ContactDetails({ id }: { id: string }) {
  const contact = await getContactById(id);

  if (!contact) {
    notFound();
  }

  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card>
          <CardHeader className="text-center">
            <Avatar className="mx-auto h-24 w-24 text-3xl mb-4">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{contact.name}</CardTitle>
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
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Historial de Interacciones</CardTitle>
              {contact.interactions.length > 0 && <InteractionSummary contact={contact} />}
            </div>
          </CardHeader>
          <CardContent>
            <InteractionForm contactId={contact.id} />
            <InteractionList interactions={contact.interactions} />
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
          </CardHeader>
          <CardContent className="space-y-4">
            <Separator />
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
              <Skeleton className="h-10 w-32 ml-auto" />
            </div>
            <div className="mt-4 space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
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
  );
}
