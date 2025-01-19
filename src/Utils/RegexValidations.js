export const RegexValidations = {
    nombre: /^[a-zA-Z\s]{2,}$/, 

    apellido: /^[a-zA-Z\s]{2,}$/, 

    documento: /^[0-9]+$/, 

    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
  
    direccion: /^[a-zA-Z0-9\s,.-]{5,}$/, 

    telefono: /^[0-9]{7,15}$/, 

    fechaNacimiento: /^\d{4}-\d{2}-\d{2}$/,

    genero: /^(Masculino|Femenino|Otro)$/,

    tipoCliente: /^(Responsable Inscripto|Consumidor Final|Monotributista|Excento)$/,
};
  
export default RegexValidations;
  