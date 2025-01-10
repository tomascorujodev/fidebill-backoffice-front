import { useState } from "react";
import { Link } from "react-router-dom";

export default function ViewClientes() {
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
      <form className="d-flex" role="search">
          <input className="form-control me-2" type="search" placeholder="Buscar cliente" aria-label="Buscar cliente"/>
              <button className="btn btn-outline-success" type="submit">
                  Buscar
              </button>
      </form>
      <br />
      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td colspan="2">Larry the Bird</td>
            <td>@twitter</td>
          </tr>
        </tbody>
        <br />
        <Link className="btn btn-outline-success" to="/cliente/agregar-cliente">
            Agregar cliente
        </Link>
    </table>
    </div>
    </>
  );
}
