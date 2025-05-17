export default interface Session {
  id: string;           // Identificador único de la sesión
  usuario_id: string;   // Identificador del usuario asociado
  fecha: Date;        // Fecha de la sesión
  hora_inicio: string;  // Hora de inicio de la sesión
  hora_fin: string;     // Hora de fin de la sesión
  estado: string;       // Estado de la sesión (por ejemplo: "activa", "finalizada")
  evaluacion: string;   // Evaluación de la sesión (si aplica)
  creado_en: Date;    // Fecha en la que se creó la sesión
  enlace: string;       // Enlace asociado con la sesión (si aplica)
}
