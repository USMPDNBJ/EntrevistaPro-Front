export default class Sessions {

  constructor(
    public id: number,
    public profesional_id: number,  // Nombre del trabajador,
    public usuario_id: number,
    public id_pago: number,
    public fecha: Date,      // Fecha en formato ISO 8601
    public hora_inicio: string, // Hora de inicio de la sesión
    public hora_fin: string,    // Hora de fin de la sesión
    public estado: string,      // Estado de la sesión
    public evaluacion: string,  // URL del archivo PDF de evaluación
    public creado_en: string,   // Fecha de creación
    public enlace: string
  ){ }

}
