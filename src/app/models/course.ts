export default interface Course {
  id_course?: string; // Optional, if included by the service
  nombre: string;
  descripcion: string;
  descripcion2: string;
  profesional: string;
  duracion: string;
  precio: number;
  categoria: string;
  etapas: string[];
  url: string;
}
