import { useState } from "react";

export default function AgregarCliente() {
  const [cliente, setCliente] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    fecha_nacimiento: "",
    genero: "Masculino",
    email: "",
    telefono: "",
    tipo_cliente_id: 1,
    puntos: 0,
    puntos_pesos: 0.0,
    fecha_alta: new Date().toISOString().split("T")[0],
    mas_datos: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://tu-backend.com/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cliente),
      });

      if (response.ok) {
        alert("Cliente agregado exitosamente");
        setCliente({
          nombre: "",
          apellido: "",
          documento: "",
          fecha_nacimiento: "",
          genero: "Masculino",
          email: "",
          telefono: "",
          tipo_cliente_id: 1,
          puntos: 0,
          puntos_pesos: 0.0,
          fecha_alta: new Date().toISOString().split("T")[0],
          mas_datos: "",
          password: "",
        });
      } else {
        alert("Error al agregar el cliente");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <>
    <div className="container">
      
      <h3>Agregar Cliente</h3>
      <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input type="text" className="form-control" id="nombre" name="nombre" value={cliente.nombre} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="apellido" className="form-label">Apellido</label>
          <input type="text" className="form-control" id="apellido" name="apellido" value={cliente.apellido} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="documento" className="form-label">Documento</label>
          <input type="text" className="form-control" id="documento" name="documento" value={cliente.documento} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="fecha_nacimiento" className="form-label">Fecha de Nacimiento</label>
          <input type="date" className="form-control" id="fecha_nacimiento" name="fecha_nacimiento" value={cliente.fecha_nacimiento} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="genero" className="form-label">Género</label>
          <select className="form-select" id="genero" name="genero" value={cliente.genero} onChange={handleChange}>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name="email" value={cliente.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="telefono" className="form-label">Teléfono</label>
          <input type="text" className="form-control" id="telefono" name="telefono" value={cliente.telefono} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-primary">Agregar</button>
      </form>
      </div>
    </div>
    </>
  );
}
