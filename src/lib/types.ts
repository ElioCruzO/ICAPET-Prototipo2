export interface Sector {
  id: string;
  nombre: string;
}

export interface Interaction {
  id: string;
  date: string; // ISO date string
  notes: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  sectorId: string;   // FK hacia sectores
  sector?: Sector;    // objeto sector (opcional para cuando hacemos JOIN)
  cargo: string;
  interactions?: Interaction[];
}
