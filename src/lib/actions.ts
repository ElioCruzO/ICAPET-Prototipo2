'use server';

import { revalidatePath } from 'next/cache';
import { db } from './db';
import { z } from 'zod';
import { Contact, Interaction } from './types';

// Esquemas de validación
const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  location: z.string().min(2),
  sector: z.string().min(2),
  cargo: z.string().min(2),
});

const interactionSchema = z.object({
  notes: z.string().min(1),
});

// Agregar contacto
export async function addContact(
  data: Omit<Contact, 'id' | 'interactions' | 'sectorId'>
) {
  try {
    const validatedData = contactSchema.parse(data);
    const sectorName = validatedData.sector.trim();

    // Buscar o crear sector
    const [sectorRows]: any = await db.query(
      'SELECT id FROM sectores WHERE LOWER(nombre) = LOWER(?)',
      [sectorName]
    );

    let sectorId: number;
    if (sectorRows.length > 0) {
      sectorId = sectorRows[0].id;
    } else {
      const [result]: any = await db.execute(
        'INSERT INTO sectores (nombre) VALUES (?)',
        [sectorName]
      );
      sectorId = result.insertId;
    }

    // Insertar contacto
    const [result]: any = await db.execute(
      `INSERT INTO contactos (name, phone, email, location, sector_id, cargo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        validatedData.name,
        validatedData.phone,
        validatedData.email,
        validatedData.location,
        sectorId,
        validatedData.cargo,
      ]
    );

    revalidatePath('/contacts');
    return { success: true, insertId: result.insertId };
  } catch (error: any) {
    console.error('Error agregando contacto:', error);
    return {
      success: false,
      error:
        error.sqlMessage ||
        error.message ||
        'No se pudo agregar el contacto.',
    };
  }
}

// Actualizar contacto
export async function updateContact(
  id: number,
  data: Partial<Omit<Contact, 'id' | 'interactions' | 'sectorId'>>
) {
  try {
    const validatedData = contactSchema.partial().parse(data);

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    // Si viene sector, buscar o crear
    if (validatedData.sector) {
      const sectorName = validatedData.sector.trim();
      const [sectorRows]: any = await db.query(
        'SELECT id FROM sectores WHERE LOWER(nombre) = LOWER(?)',
        [sectorName]
      );

      let sectorId: number;
      if (sectorRows.length > 0) {
        sectorId = sectorRows[0].id;
      } else {
        const [result]: any = await db.execute(
          'INSERT INTO sectores (nombre) VALUES (?)',
          [sectorName]
        );
        sectorId = result.insertId;
      }

      updateFields.push('sector_id = ?');
      updateValues.push(sectorId);
      delete validatedData.sector;
    }

    // Otros campos
    for (const key in validatedData) {
      updateFields.push(`${key} = ?`);
      updateValues.push(validatedData[key as keyof typeof validatedData]);
    }

    if (updateFields.length === 0) return;

    const setClause = updateFields.join(', ');
    const [result] = await db.execute(
      `UPDATE contactos SET ${setClause} WHERE id = ?`,
      [...updateValues, id]
    );

    revalidatePath('/contacts');
    revalidatePath(`/contacts/${id}`);
    return result;
  } catch (error: any) {
    console.error('Error actualizando contacto:', error);
    throw new Error(
      error.sqlMessage || error.message || 'No se pudo actualizar el contacto.'
    );
  }
}

// Eliminar contacto
export async function deleteContact(id: string) {
  const [result] = await db.execute('DELETE FROM contactos WHERE id = ?', [id]);
  revalidatePath('/contacts');
  return result;
}

// Agregar interacción
export async function addInteraction(
  contactId: string,
  data: Omit<Interaction, 'id' | 'date'>
) {
  const validatedData = interactionSchema.parse(data);

  const [result] = await db.execute(
    `INSERT INTO interacciones (contacto_id, date, notes) 
     VALUES (?, CURDATE(), ?)`,
    [contactId, validatedData.notes]
  );

  revalidatePath(`/contacts/${contactId}`);
  return result;
}

// Obtener sectores
