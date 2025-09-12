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
  sector: z.number(),
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
  dta: z.preprocess((val) => Number(val), z.number().int().positive()),
  nombre: z.string().min(2),
  estado: z.string().min(2),
  fecha: z.string(),
})

// ➕ Agregar contacto
export async function addContact(
  data: Omit<Contact, 'id' | 'interactions' | 'sectorId' | 'cursos'>
) {
  console.log("🚀 ~ data:", data)
  try {
    const validatedData = contactSchema.parse(data);
    console.log("🚀 ~ validatedData:", validatedData)
    // const sectorName = validatedData.sector;

    // Buscar o crear sector
    // const [sectorRows]: any = await db.query(
    //   'SELECT id FROM sectores WHERE LOWER(nombre) = LOWER(?)',
    //   [sectorName]
    // );

    let sectorId: number = validatedData.sector;
    // if (sectorRows.length > 0) {
    //   sectorId = sectorRows[0].id;
    // } else {
    //   const [result]: any = await db.execute(
    //     'INSERT INTO sectores (nombre) VALUES (?)',
    //     [sectorName]
    //   );
    //   sectorId = result.insertId;
    // }

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
      // const sectorName = validatedData.sector;
      // const [sectorRows]: any = await db.query(
      //   'SELECT id FROM sectores WHERE LOWER(nombre) = LOWER(?)',
      //   [sectorName]
      // );

      let sectorId: number = validatedData.sector;
      // if (sectorRows.length > 0) {
      //   sectorId = sectorRows[0].id;
      // } else {
      //   const [result]: any = await db.execute(
      //     'INSERT INTO sectores (nombre) VALUES (?)',
      //     [sectorName]
      //   );
      //   sectorId = result.insertId;
      // }

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
    console.log("getting...");
    
    // Desfragmentar la tabla sectores antes de la consulta
    const [rows]: any[] = await db.query(
      'SELECT id, nombre FROM sectores ORDER BY nombre ASC'
    );

    return rows.map((s: any) => ({
      id: s.id,
      nombre: s.nombre,
    }));
  } catch (error: any) {
    console.error('Error obteniendo sectores:', error);
    throw new Error('No se pudieron cargar los sectores.');
  }
}


export async function addCourse(
  contactId: string,
  data: z.infer<typeof courseSchema>
) {
  const validatedData = courseSchema.parse(data);


    console.log("Datos validados en addCourse:", validatedData);
  console.log("ID del contacto:", contactId);


  const [result]: any = await db.execute(
    `INSERT INTO cursos (dta, contacto_id, nombre, estado, fecha)
     VALUES (?, ?, ?, ?, ?)`,
    [
      validatedData.dta,
      contactId,
      validatedData.nombre,
      validatedData.estado,
      validatedData.fecha,
    ]
  );

  revalidatePath("/cursos");
  revalidatePath(`/contacts/${contactId}`);

  return { insertId: result.insertId };
}




export async function updateCourse(
  dta: string, // clave primaria
  contactId: string, // para asegurar que pertenece al contacto
  data: z.infer<typeof courseSchema>
) {
  const validatedData = courseSchema.parse(data);

  const [result]: any = await db.execute(
    `UPDATE cursos
     SET nombre = ?, estado = ?, fecha = ?
     WHERE dta = ? AND contacto_id = ?`,
    [
      validatedData.nombre,
      validatedData.estado,
      validatedData.fecha,
      dta,
      contactId,
    ]
  );

  revalidatePath("/cursos");
  revalidatePath(`/contacts/${contactId}`);

  return result;
}export async function deleteCourse(dta: number) {
  try {
    const [result] = await db.execute('DELETE FROM cursos WHERE dta = ?', [dta]);
    revalidatePath('/cursos');
    return result;
  } catch (error: any) {
    console.error('Error eliminado curso: ', error);
    throw new Error(error.sqlMessage || error.message || 'No se pudo eliminar el curso.');
  }
}

