import 'server-only';
import { db } from './db';
import { Contact, Interaction, Curso } from './types';
import { unstable_noStore as noStore } from 'next/cache';

type ContactFromDB = {
  id: number;
  name: string;
  phone: string;
  email: string;
  location: string;
  sectorId: number;
  sectorNombre: string;
  cargo: string;
  folio: string | null;               // 👈 string en vez de number
  fecha_vinculacion: string | null;   // 👈 string ISO
};

type InteractionFromDB = {
  id: number;
  contacto_id: number;
  date: string;
  notes: string;
};

type CursoFromDB = {
  dta: number;
  contacto_id: number;
  nombre: string;
  estado: string;
  fecha: string;
};

export async function getContacts(query: string): Promise<Contact[]> {
  noStore();
  try {
    const searchTerm = `%${query}%`;
    const [rows] = await db.query<ContactFromDB[]>(
      `SELECT c.id, c.name, c.phone, c.email, c.location, 
              c.sector_id AS sectorId, s.nombre AS sectorNombre, 
              c.cargo, c.folio, c.fecha_vinculacion
       FROM contactos c
       JOIN sectores s ON c.sector_id = s.id
       WHERE c.name LIKE ? 
          OR c.email LIKE ? 
          OR c.phone LIKE ? 
          OR c.location LIKE ?
          OR c.cargo LIKE ?
          OR s.nombre LIKE ?
       ORDER BY c.name ASC`,
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
    );

    return rows.map(row => ({
      id: row.id.toString(),
      name: row.name,
      phone: row.phone,
      email: row.email,
      location: row.location,
      sectorId: row.sectorId.toString(),
      sector: {
        id: row.sectorId.toString(),
        nombre: row.sectorNombre,
      },
      cargo: row.cargo,
      folio: row.folio ?? undefined,
      fechaVinculacion: row.fecha_vinculacion ?? undefined,
      interactions: [],
      cursos: [],
    }));
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch contacts.');
  }
}

export async function getContactById(id: string): Promise<Contact | null> {
  noStore();
  try {
    const [contactRows] = await db.query<ContactFromDB[]>(
      `SELECT c.id, c.name, c.phone, c.email, c.location, 
              c.sector_id AS sectorId, s.nombre AS sectorNombre, 
              c.cargo, c.folio, c.fecha_vinculacion
       FROM contactos c
       JOIN sectores s ON c.sector_id = s.id
       WHERE c.id = ?`,
      [id]
    );

    if (contactRows.length === 0) return null;

    const contact = contactRows[0];

    const [interactionRows] = await db.query<InteractionFromDB[]>(
      'SELECT * FROM interacciones WHERE contacto_id = ? ORDER BY date DESC',
      [id]
    );

    const [cursoRows] = await db.query<CursoFromDB[]>(
      'SELECT * FROM cursos WHERE contacto_id = ? ORDER BY fecha DESC',
      [id]
    );

    return {
      id: contact.id.toString(),
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      location: contact.location,
      sectorId: contact.sectorId.toString(),
      sector: {
        id: contact.sectorId.toString(),
        nombre: contact.sectorNombre,
      },
      cargo: contact.cargo,
      folio: contact.folio ?? undefined,
      fechaVinculacion: contact.fecha_vinculacion ?? undefined,
      interactions: interactionRows.map(i => ({
        id: i.id.toString(),
        date: i.date,
        notes: i.notes,
      })),
      cursos: cursoRows.map(c => ({
        dta: c.dta.toString(),
        contactoId: c.contacto_id.toString(),
        nombre: c.nombre,
        estado: c.estado,
        fecha: c.fecha,
      })),
    };
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}
