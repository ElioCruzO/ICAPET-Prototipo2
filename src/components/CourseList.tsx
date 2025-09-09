import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export interface Course {
  dta: number;
  contacto_id: number;
  nombre: string;
  estado: string;
  fecha: string;
}

interface CourseListProps {
  courses: Course[];
  onDelete: (id: number) => void; // Para eliminar
}

export default function CourseList({ courses, onDelete }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed rounded-lg mt-4">
        <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-semibold text-foreground">Sin Cursos</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Registra tu primer curso arriba.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-96 mt-4 pr-4">
      <div className="space-y-6">
        {courses.map((course) => (
          <div key={course.dta} className="flex gap-4 justify-between items-center">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                  <Calendar className="h-4 w-4 text-secondary-foreground" />
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{course.nombre}</p>
                <p className="text-sm text-muted-foreground">Estado: {course.estado}</p>
                <p className="text-sm text-muted-foreground">
                  {format(
                    typeof course.fecha === "string"
                      ? parseISO(course.fecha)
                      : new Date(course.fecha),
                    "d 'de' MMMM, yyyy",
                    { locale: es }
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => onDelete(course.dta)}
              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
