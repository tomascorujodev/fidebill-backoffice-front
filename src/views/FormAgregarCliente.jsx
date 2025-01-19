import { useState } from "react";
import { POST } from "../Services/Fetch";

export default function FormAgregarCliente() {
const [cliente, setCliente] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente((prevCliente) => ({
      ...prevCliente,
      [name]: value
    }));
  };

  async function handleSubmit(e){
    e.preventDefault();
    console.log("Cliente agregado:", cliente);
    let request = {
      ...cliente
    }
    let rsp;
    try{
      rsp = await POST("clientes/crearcliente", request);
      console.log(rsp)
    }catch{

    }
  };


  return (
    <>
    <div className="container">
      <div className="card p-4">
      <h2>Agregar Cliente</h2>
      <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="Nombre" className="form-label">Nombre(*)</label>
          <input type="text" className="form-control" id="Nombre" name="Nombre" value={cliente.nombre} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="Apellido" className="form-label">Apellido(*)</label>
          <input type="text" className="form-control" id="Apellido" name="Apellido" value={cliente.apellido} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="Documento" className="form-label">Documento(*)</label>
          <input type="text" className="form-control" id="Documento" name="Documento" value={cliente.documento} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="FechaNacimiento" className="form-label">Fecha de Nacimiento(*)</label>
          <input type="date" className="form-control" id="FechaNacimiento" name="FechaNacimiento" value={cliente.fecha_nacimiento} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="Genero" className="form-label">Género(*)</label>
          <select className="form-select" id="Genero" name="Genero" value={cliente.genero} onChange={handleChange}>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="Email" className="form-label">Email(*)</label>
          <input type="email" className="form-control" id="Email" name="Email" value={cliente.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="Direccion" className="form-label">Dirección</label>
          <input type="text" className="form-control" id="Direccion" name="Direccion" value={cliente.direccion} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="Telefono" className="form-label">Teléfono</label>
          <input type="text" className="form-control" id="Telefono" name="Telefono" value={cliente.telefono} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="TipoCliente" className="form-label">Tipo Cliente(*)</label>
          <select className="form-select" id="TipoCliente" name="TipoCliente" value={cliente.tipoCliente} onChange={handleChange}>
            <option value="Responsable Inscripto">Responsable Inscripto</option>
            <option value="Consumidor Final">Consumidor Final</option>
            <option value="Consumidor Final<">Monotributista</option>
            <option value="Excento">Excento</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Agregar</button>
      </form>
      </div>
      </div>
      <br />
    </div>
    </>
  );
}
