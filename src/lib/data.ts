import 'server-only';
import { db } from './db';
import { Contact, Interaction, Sector } from './types';
import { unstable_noStore as noStore } from 'next/cache';

type ContactFromDB = {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  sectorId: string;   // FK
  sectorNombre: string; // nombre del sector
  cargo: string;
};

type InteractionFromDB = {
  id: string;
  contacto_id: string;
  date: string;
  notes: string;
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
      id: row.id,
      name: row.name,
      phone: row.phone,
      email: row.email,
      location: row.location,
      sectorId: row.sectorId,
      sector: {
        id: row.sectorId,
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

    if (contactRows.length === 0) {
      return null;
    }

    const contact = contactRows[0];

    const [interactionRows] = await db.query<InteractionFromDB[]>(
      'SELECT * FROM interacciones WHERE contacto_id = ? ORDER BY date DESC',
      [id]
    );

    return {
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      location: contact.location,
      sectorId: contact.sectorId,
      sector: {
        id: contact.sectorId,
        nombre: contact.sectorNombre
      },
      cargo: contact.cargo,
      interactions: interactionRows
    };
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}
