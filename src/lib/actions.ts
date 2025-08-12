'use server';

import { revalidatePath } from 'next/cache';
import { db } from './db';
import { z } from 'zod';
import { Contact, Interaction } from './types';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  location: z.string().min(2),
  sector: z.string().min(4),
  cargo: z.string().min(2),
});

const interactionSchema = z.object({
  notes: z.string().min(1),
});

export async function addContact(data: Omit<Contact, 'id' | 'interactions'>) {
  const validatedData = contactSchema.parse(data);
  const [result] = await db.execute(
    'INSERT INTO contactos (name, phone, email, location, sector, cargo) VALUES (?, ?, ?, ?, ?, ?)',
    [validatedData.name, validatedData.phone, validatedData.email, validatedData.location, validatedData.sector, validatedData.cargo]
  );
  revalidatePath('/contacts');
  return result;
}

export async function updateContact(id: string, data: Partial<Omit<Contact, 'id' | 'interactions'>>) {
  const validatedData = contactSchema.partial().parse(data);
  
  const fields = Object.keys(validatedData) as (keyof typeof validatedData)[];
  const values = fields.map(field => validatedData[field]);
  
  if (fields.length === 0) return;

  const setClause = fields.map(field => `${field} = ?`).join(', ');

  const [result] = await db.execute(
    `UPDATE contactos SET ${setClause} WHERE id = ?`,
    [...values, id]
  );
  
  revalidatePath('/contacts');
  revalidatePath(`/contacts/${id}`);
  return result;
}

export async function deleteContact(id: string) {
  const [result] = await db.execute('DELETE FROM contactos WHERE id = ?', [id]);
  revalidatePath('/contacts');
  revalidatePath(`/contacts/${id}`);
  return result;
}

export async function addInteraction(contactId: string, data: Omit<Interaction, 'id' | 'date'>) {
  const validatedData = interactionSchema.parse(data);
  const [result] = await db.execute(
    'INSERT INTO interacciones (contacto_id, date, notes) VALUES (?, CURDATE(), ?)',
    [contactId, validatedData.notes]
  );
  revalidatePath(`/contacts/${contactId}`);
  return result;
}
