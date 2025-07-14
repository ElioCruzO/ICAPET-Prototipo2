import type { Interaction } from "@/lib/types";
import { format, parseISO } from 'date-fns';
import { MessageSquare, Calendar } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

interface InteractionListProps {
  interactions: Interaction[];
}

export default function InteractionList({ interactions }: InteractionListProps) {
  if (interactions.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg mt-4">
        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-foreground">No Interactions</h3>
        <p className="mt-1 text-sm text-muted-foreground">Record your first interaction above.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-96 mt-4 pr-4">
      <div className="space-y-6">
        {interactions.map((interaction) => (
          <div key={interaction.id} className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                <Calendar className="h-4 w-4 text-secondary-foreground" />
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {format(parseISO(interaction.date), 'MMMM d, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {interaction.notes}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
