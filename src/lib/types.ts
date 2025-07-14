export interface Interaction {
  id: string;
  date: string;
  notes: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  cargo: string;
  interactions: Interaction[];
}
