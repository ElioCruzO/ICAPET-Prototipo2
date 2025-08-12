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
  sector:string;
  cargo: string;
  interactions?: Interaction[];
}
