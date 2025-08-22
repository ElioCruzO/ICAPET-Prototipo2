import 'server-only';
import { db } from './db';
import { Contact, Interaction } from './types';
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
};

type InteractionFromDB = {
  id: number;
  contacto_id: number;
  date: string;
  notes: string;
};

type SectorFromDB = {
  id: number;
  
  nombre: string;
};
export async function getContacts(query: string): Promise<Contact[]> {
  noStore();
  try {
    const searchTerm = `%${query}%`;
    const [rows] = await db.query<ContactFromDB[]>(
      `SELECT c.id, c.name, c.phone, c.email, c.location, 
              c.sector_id AS sectorId, s.nombre AS sectorNombre, 
              c.cargo
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
        nombre: row.sectorNombre
      },
      cargo: row.cargo,
      interactions: []
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
              c.cargo
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

    return {
      id: contact.id.toString(),
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      location: contact.location,
      sectorId: contact.sectorId.toString(),
      sector: {
        id: contact.sectorId.toString(),
        nombre: contact.sectorNombre
      },
      cargo: contact.cargo,
      interactions: interactionRows.map(i => ({
        id: i.id.toString(),
        contacto_id: i.contacto_id.toString(),
        date: i.date,
        notes: i.notes
      }))
    };
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}
