'use server';

import { revalidatePath } from 'next/cache';
import { db } from './db';
import { z } from 'zod';
import { Contact, Interaction } from './types';

// Esquema de validación de contacto (folio ahora es string)
const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  location: z.string().min(2),
  sector: z.string().min(2),
  cargo: z.string().min(2),
  folio: z.string().optional(),
  fechaVinculacion: z.string().optional(), // YYYY-MM-DD
});

// Esquema de validación de interacción
const interactionSchema = z.object({
  notes: z.string().min(1),
});

// Esquema de validación de curso
const courseSchema = z.object({
  dta: z.number().int(),
  contactoId: z.number().int(),
  nombre: z.string().min(2),
  estado: z.string().min(2),
  fecha: z.string(),
})

// ➕ Agregar contacto
export async function addContact(
  data: Omit<Contact, 'id' | 'interactions' | 'sectorId' | 'cursos'>
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
      `INSERT INTO contactos 
         (name, phone, email, location, sector_id, cargo, folio, fecha_vinculacion)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        validatedData.name,
        validatedData.phone,
        validatedData.email,
        validatedData.location,
        sectorId,
        validatedData.cargo,
        validatedData.folio ?? null,
        validatedData.fechaVinculacion ?? null,
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

// ✏️ Actualizar contacto
export async function updateContact(
  id: number,
  data: Partial<Omit<Contact, 'id' | 'interactions' | 'sectorId' | 'cursos'>>
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

    // Otros campos (incluyendo folio y fechaVinculacion)
    for (const key in validatedData) {
      if (key === 'fechaVinculacion') {
        updateFields.push('fecha_vinculacion = ?');
        updateValues.push(validatedData[key as keyof typeof validatedData]);
      } else {
        updateFields.push(`${key} = ?`);
        updateValues.push(validatedData[key as keyof typeof validatedData]);
      }
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

// 🗑️ Eliminar contacto
export async function deleteContact(id: string) {
  const [result] = await db.execute('DELETE FROM contactos WHERE id = ?', [id]);
  revalidatePath('/contacts');
  return result;
}

// ➕ Agregar interacción
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

// 📌 Obtener sectores
export async function getSectores() {
  try {
    const [rows]: any = await db.query(
      'SELECT id, nombre FROM sectores ORDER BY nombre ASC'
    );

    return rows.map((s: any) => ({
      id: s.id.toString(),
      nombre: s.nombre,
    }));
  } catch (error: any) {
    console.error('Error obteniendo sectores:', error);
    throw new Error('No se pudieron cargar los sectores.');
  }
}

export async function addCourse(data: z.infer<typeof courseSchema>) {
  try {
    const validatedData = courseSchema.parse(data);

    const [result]: any = await db.execute(
      `INSERT INTO cursos (dta, contacto_id, nombre, estado, fecha)
       VALUES (?, ?, ?, ?, ?)`,
      [
        validatedData.dta,
        validatedData.contactoId,
        validatedData.nombre,
        validatedData.estado,
        validatedData.fecha,
      ]
    );

    revalidatePath('/cursos');
    return { success: true, insertId: result.insertId };
  } catch (error: any) {
    console.error('Error agregando curso:', error);
    return {
      success: false,
      error:
        error.sqlMessage ||
        error.message ||
        'No se pudo agregar el curso.',
    };
  }
}

export async function updateCourse(dta: number, data: Partial<z.infer<typeof courseSchema>>) {
  try {
    const validatedData = courseSchema.partial().parse(data);

    const updateFields: string[] = [];
    const updateValues: any[] = [];

    for (const key in validatedData) {
      updateFields.push(`${key === 'contactoId' ? 'contacto_id' : key} = ?`);
      updateValues.push(validatedData[key as keyof typeof validatedData]);
    }

    if (updateFields.length === 0) return;

    const setClause = updateFields.join(', ');
    const [result] = await db.execute(
      `UPDATE cursos SET ${setClause} WHERE dta = ?`,
      [...updateValues, dta]
    );

    revalidatePath('/cursos');
    return result;
  } catch (error: any) {
    console.error('Error actualizando curso:', error);
    throw new Error(
      error.sqlMessage || error.message || 'No se pudo actualizar el curso.'
    );
  }
}

export async function deleteCourse(dta: number) {
  const [result] = await db.execute('DELETE FROM cursos WHERE dta = ?', [dta]);
  revalidatePath('/cursos');
  return result;
}

export async function getCourses() {
  try {
    const [rows]: any = await db.query(
      `SELECT c.dta, c.nombre, c.estado, c.fecha, ct.name AS contacto
       FROM cursos c
       JOIN contactos ct ON c.contacto_id = ct.id
       ORDER BY c.fecha DESC`
    );

    return rows.map((c: any) => ({
      dta: c.dta,
      nombre: c.nombre,
      estado: c.estado,
      fecha: c.fecha,
      contacto: c.contacto,
    }));
  } catch (error: any) {
    console.error('Error obteniendo cursos:', error);
    throw new Error('No se pudieron cargar los cursos.');
  }
}
