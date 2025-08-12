import 'server-only';
import { db } from './db';
import { Contact, Interaction } from './types';
import { unstable_noStore as noStore } from 'next/cache';

type ContactFromDB = {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  sector: string;
  cargo: string;
};

type InteractionFromDB = {
    id: string;
    contacto_id: string;
    date: string;
    notes: string;
}

export async function getContacts(query: string): Promise<Contact[]> {
  noStore();
  
  try {
    const searchTerm = `%${query}%`;
    const [rows] = await db.query<ContactFromDB[]>(
      `SELECT * FROM contactos 
       WHERE name LIKE ? 
       OR email LIKE ? 
       OR phone LIKE ? 
       OR location LIKE ?
       OR cargo LIKE ?
       OR sector LIKE ?
       ORDER BY name ASC`,
      [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm]
    );
    return rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch contacts.');
  }
}

export async function getContactById(id: string): Promise<Contact | null> {
    noStore();
    try {
        const [contactRows] = await db.query<ContactFromDB[]>('SELECT * FROM contactos WHERE id = ?', [id]);

        if (contactRows.length === 0) {
            return null;
        }

        const contact = contactRows[0];

        const [interactionRows] = await db.query<InteractionFromDB[]>('SELECT * FROM interacciones WHERE contacto_id = ? ORDER BY date DESC', [id]);
        
        return {
            ...contact,
            interactions: interactionRows
        };

    } catch (error) {
        console.error('Database Error:', error);
        return null;
    }
}
