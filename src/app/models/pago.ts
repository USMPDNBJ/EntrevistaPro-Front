export default class Pago {

  constructor(
    public numero_tarjeta?: String,
    public nombre?: String,
    public fecha_expiracion?: Date,
    public cvv?: string,
    public monto?: number
  ){ }

}
