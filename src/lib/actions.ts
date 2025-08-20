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
  sectorId: z.string().regex(/^\d+$/), // debe ser un id numérico
  cargo: z.string().min(2),
});

const interactionSchema = z.object({
  notes: z.string().min(1),
});

export async function addContact(data: Omit<Contact, 'id' | 'interactions' | 'sector'>) {
  const validatedData = contactSchema.parse(data);

  const [result] = await db.execute(
    `INSERT INTO contactos (name, phone, email, location, sector_id, cargo) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      validatedData.name,
      validatedData.phone,
      validatedData.email,
      validatedData.location,
      validatedData.sectorId,
      validatedData.cargo,
    ]
  );

  revalidatePath('/contacts');
  return result;
}

export async function updateContact(id: string, data: Partial<Omit<Contact, 'id' | 'interactions' | 'sector'>>) {
  const validatedData = contactSchema.partial().parse(data);

  const fields = Object.keys(validatedData) as (keyof typeof validatedData)[];
  const values = fields.map(field => validatedData[field]);

  if (fields.length === 0) return;

  const setClause = fields.map(field => {
    if (field === "sectorId") return "sector_id = ?";
    return `${field} = ?`;
  }).join(', ');

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
    `INSERT INTO interacciones (contacto_id, date, notes) 
     VALUES (?, CURDATE(), ?)`,
    [contactId, validatedData.notes]
  );

  revalidatePath(`/contacts/${contactId}`);
  return result;
}
