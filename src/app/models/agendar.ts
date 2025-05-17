export default interface Agendar {
  usuario_id: number;  // Nombre del trabajador
  profesional_id?: number;
  fecha: Date;      // Fecha en formato ISO 8601
  hora_inicio: string; // Hora de inicio de la sesión
  hora_fin: string;    // Hora de fin de la sesión
  estado: string;      // Estado de la sesión
  evaluacion?: string;
  enlace?: string; // Hacer opcional
}
