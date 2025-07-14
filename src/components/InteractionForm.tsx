"use client";

import { useState } from "react";
import { useContactStore } from "@/store/contacts";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface InteractionFormProps {
  contactId: string;
}

export default function InteractionForm({ contactId }: InteractionFormProps) {
  const [notes, setNotes] = useState("");
  const { addInteraction } = useContactStore();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notes.trim()) {
      addInteraction(contactId, { notes });
      toast({
        title: "Interaction Recorded",
        description: "Your new interaction has been saved.",
      });
      setNotes("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Record a new interaction..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="min-h-[60px]"
      />
      <div className="flex justify-end">
        <Button type="submit" disabled={!notes.trim()}>
          Save Interaction
        </Button>
      </div>
    </form>
  );
}
