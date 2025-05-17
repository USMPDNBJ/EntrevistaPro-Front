export default interface Session {
  id: number;
  trabajador: string;  // Nombre del trabajador
  fecha: Date;      // Fecha en formato ISO 8601
  hora_inicio: string; // Hora de inicio de la sesión
  hora_fin: string;    // Hora de fin de la sesión
  estado: string;      // Estado de la sesión
  evaluacion: string;  // URL del archivo PDF de evaluación
  creado_en: string;   // Fecha de creación
  enlace: string;
}
