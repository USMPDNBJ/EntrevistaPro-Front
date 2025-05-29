export default class Course {

  constructor(
    public id_course?: number,
    public nombre?: String,
    public descripcion?: String,
    public profesional?: String,
    public duracion?: string,
    public precio?: number,
    public categoria?: string,
    public etapas?: string[],
    public url?: string
  ){ }

}
