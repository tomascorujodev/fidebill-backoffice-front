import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GET } from "../Services/Fetch";

export default function ViewClientes() {
  const [clientes, setClientes] = useState([]);
  const [page, setPage] = useState(1);
  useEffect(() =>{
    // let request = {
    //   pagina: `${page}`
    // }
    async function getClients(){
      let clients = await GET("clientes/obtenerclientes");
      console.log(await clients.json())
    }
    getClients();
  }, [])

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
      <table className="table">
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
            <td colSpan="2">Larry the Bird</td>
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
