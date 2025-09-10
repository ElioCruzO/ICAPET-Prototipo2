export interface Sector {
  id: string;
  nombre: string;
}

export interface Interaction {
  id: string;
  date: string; // ISO date string
  notes: string;
}

export interface Curso {
  dta: string;          // id del curso
  
  nombre: string;
  estado: string;
  fecha: string;        // ISO date string
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  sectorId: string;   // FK hacia sectores
  sector?: number;    // objeto sector (cuando se hace JOIN)
  cargo: string;
  folio: string;     // nuevo campo
  fechaVinculacion?: string; // ISO date string
  interactions?: Interaction[];
  cursos?: Curso[];   // relación con cursos
}
