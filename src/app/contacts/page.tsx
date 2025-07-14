"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import { useContactStore } from "@/store/contacts";

export default function ContactsPage() {
  const contacts = useContactStore((state) => state.contacts);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Contacts</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
            </DialogHeader>
            <ContactForm setOpen={setAddDialogOpen} />
          </DialogContent>
        </Dialog>
      </div>

      <ContactList contacts={contacts} />
    </div>
  );
}
