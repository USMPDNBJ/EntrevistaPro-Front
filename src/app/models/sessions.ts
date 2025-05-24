export default class Sessions {
  public id?: number;
  public profesional_id?: number;
  public usuario_id?: number;
  public id_pago?: number;
  public fecha?: Date;
  public hora_inicio?: string;
  public hora_fin?: string;
  public estado?: string;
  public evaluacion?: string;
  public creado_en?: string;
  public enlace?: string;

  constructor(
    id?: number,
    profesional_id?: number,
    usuario_id?: number,
    id_pago?: number,
    fecha?: Date,
    hora_inicio?: string,
    hora_fin?: string,
    estado?: string,
    evaluacion?: string,
    creado_en?: string,
    enlace?: string
  ) {
    this.id = id;
    this.profesional_id = profesional_id;
    this.usuario_id = usuario_id;
    this.id_pago = id_pago;
    this.fecha = fecha;
    this.hora_inicio = hora_inicio;
    this.hora_fin = hora_fin;
    this.estado = estado;
    this.evaluacion = evaluacion;
    this.creado_en = creado_en;
    this.enlace = enlace;
  }
}
