"use client";

import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { addInteraction } from "@/lib/actions";
import { Loader2 } from "lucide-react";

interface InteractionFormProps {
  contactId: string;
}

export default function InteractionForm({ contactId }: InteractionFormProps) {
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notes.trim()) {
      startTransition(async () => {
        try {
          await addInteraction(contactId, { notes });
          toast({
            title: "Interacción Registrada",
            description: "Tu nueva interacción ha sido guardada.",
          });
          setNotes("");
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo registrar la interacción.",
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Registrar una nueva interacción..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[60px]"
        disabled={isPending}
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!notes.trim() || isPending}>
          {isPending && <Loader2 className="animate-spin" />}
          Guardar Interacción
        </Button>
      </div>
    </form>
  );
}
