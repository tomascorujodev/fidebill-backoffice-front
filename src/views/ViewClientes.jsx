import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GET } from "../Services/Fetch";
import { convertirFecha } from "../Utils/ConvertirFechas";
import Pagination from "../Components/Pagination";

export default function ViewCompras() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => {
    if (busqueda) {
      filtarClientes();
    } else {
      obtenerClientes();
    }
  }, [page, busqueda]);

  async function obtenerClientes() {
    try {
      let response = await GET("clientes/obtenerclientes", { page: page });
      if (response) {
        switch (response.status) {
          case 200:
            response = await response.json();
            setClientes(response.clientes);
            setMensaje("");
            return;
          case 204:
            setMensaje("No hay clientes cargados");
            return;
          case 500:
            setMensaje("Hubo un problema en el servidor. Por favor, contacte con un administrador");
            return;
          default:
            setMensaje("Hubo un problema. Por favor, contacte con un administrador");
            return;
        }
      }
    } catch {
      setMensaje("Hubo un problema al intentar obtener los clientes");
      setClientes([]);
    }
  }

  async function filtarClientes() {
    try {
      let clients = await GET("clientes/buscarclientes", { page: page , busqueda: busqueda});
      if (clients) {  
        setMensaje("");
        clients = await clients.json();
        setClientes(clients.clientes);
      }
    } catch {
      setMensaje("Hubo un problema al intentar obtener los clientes");
    }
  }
  
  return (
    <>
      <div className="container">
        <div className="card p-4">
          <h2>Clientes</h2>
          <h3 className="text-end">
          <Link className="btn btn-outline-success" to="/cliente/agregar-cliente"> 
            Agregar cliente
          </Link>
          </h3>
          <br />

          <input
            className="form-control me-2"
            type="search"
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar cliente"
            aria-label="Buscar cliente"
          />
        </div>

        {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
        <br />
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Apellido</th>
              <th scope="col">Documento</th>
              <th scope="col">Fecha de Nacimiento</th>
              <th scope="col">Telefono</th>
              <th scope="col">Tipo Cliente</th>
              <th scope="col">Genero</th>
              <th scope="col">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {clientes?.map(cliente => (
              <tr key={cliente.idCliente}>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.documento}</td>
                <td>{convertirFecha(cliente?.fechaNacimiento)}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.tipoCliente}</td>
                <td>{cliente.genero}</td>
                <td>{cliente.puntos}</td>
              </tr>
            ))}
          <Pagination currentPage={page} onPageChange={setPage} />
          </tbody>
        </table>
      </div>
      <br />
    </>
  );
}
