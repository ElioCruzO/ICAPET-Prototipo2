"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useContactStore } from "@/store/contacts";
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

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { getContactById } = useContactStore();
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const contact = useMemo(() => getContactById(id), [id, getContactById]);

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-xl text-muted-foreground">Contacto no encontrado.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/contacts">Volver a contactos</Link>
        </Button>
      </div>
    );
  }

  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("");

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
                <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Edit className="mr-2 h-4 w-4" /> Editar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Editar Contacto</DialogTitle>
                    </DialogHeader>
                    <ContactForm
                      contact={contact}
                      setOpen={setEditDialogOpen}
                    />
                  </DialogContent>
                </Dialog>

                <DeleteContactDialog
                  contactId={contact.id}
                  open={isDeleteDialogOpen}
                  setOpen={setDeleteDialogOpen}
                  onSuccess={() => router.push('/contacts')}
                >
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
    </div>
  );
}
