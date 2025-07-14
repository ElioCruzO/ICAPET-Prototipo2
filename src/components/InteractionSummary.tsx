"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, AlertTriangle } from "lucide-react";
import type { Contact } from "@/lib/types";
import { summarizeInteractions } from "@/ai/flows/summarize-interactions";
import { ScrollArea } from "./ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

interface InteractionSummaryProps {
  contact: Contact;
}

export default function InteractionSummary({ contact }: InteractionSummaryProps) {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    setIsLoading(true);
    setError(null);
    setSummary("");
    try {
      const interactionHistory = contact.interactions
        .map(
          (i) =>
            `Fecha: ${new Date(i.date).toLocaleDateString('es-ES')}\nNotas: ${i.notes}`
        )
        .join("\n\n---\n\n");
      
      if (!interactionHistory) {
        setSummary("No hay interacciones para resumir.");
        return;
      }
      
      const result = await summarizeInteractions({
        interactions: interactionHistory,
      });

      setSummary(result.summary);
    } catch (e) {
      setError("No se pudo generar el resumen. Por favor, inténtalo de nuevo.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" onClick={handleSummarize}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Resumir
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-lg w-[90vw]">
        <SheetHeader>
          <SheetTitle>Resumen de Interacciones para {contact.name}</SheetTitle>
          <SheetDescription>
            Un resumen de tus interacciones generado por IA.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)] pr-6">
        <div className="py-4 whitespace-pre-wrap font-sans text-sm text-foreground">
          {isLoading && (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {summary && <p>{summary}</p>}
        </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
