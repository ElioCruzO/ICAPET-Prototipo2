"use client";

import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import type { Contact, Interaction } from "@/lib/types";

interface ContactState {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, "id" | "interactions">) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  addInteraction: (contactId: string, interaction: Omit<Interaction, "id" | "date">) => void;
  getContactById: (id: string) => Contact | undefined;
}

const initialContacts: Contact[] = [
  {
    id: "1",
    name: "Alice Johnson",
    phone: "123-456-7890",
    email: "alice.j@example.com",
    location: "New York, USA",
    cargo: "Project Manager",
    interactions: [
      { id: "i1", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), notes: "Initial meeting, discussed project scope." },
      { id: "i2", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), notes: "Follow-up call, agreed on terms." },
    ],
  },
  {
    id: "2",
    name: "Bob Williams",
    phone: "098-765-4321",
    email: "bob.w@example.com",
    location: "London, UK",
    cargo: "Lead Developer",
    interactions: [{ id: "i3", date: new Date().toISOString(), notes: "Sent invoice for Q2." }],
  },
];

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: initialContacts,
  addContact: (contact) =>
    set((state) => ({
      contacts: [...state.contacts, { ...contact, id: uuidv4(), interactions: [] }],
    })),
  updateContact: (id, updatedContact) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id ? { ...contact, ...updatedContact } : contact
      ),
    })),
  deleteContact: (id) =>
    set((state) => ({
      contacts: state.contacts.filter((contact) => contact.id !== id),
    })),
  addInteraction: (contactId, interaction) =>
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === contactId
          ? {
              ...contact,
              interactions: [
                ...contact.interactions,
                { ...interaction, id: uuidv4(), date: new Date().toISOString() },
              ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
            }
          : contact
      ),
    })),
  getContactById: (id) => get().contacts.find((contact) => contact.id === id),
}));
