import React, { useEffect, useState } from "react";
import "../../assets/css/ViewPuntos.css";
import { GET } from "../../services/Fetch";
import CheckOnline from "../../utils/CheckOnline";
import { convertirFechaArgentina } from "../../utils/ConvertirFechas";
import BuscarCliente from "../../components/BuscarCliente";

export default function ViewPremiosCanjeados() {
  const [message, setMessage] = useState("");
  const [fadeClass, setFadeClass] = useState("fade-out");
  const [effectId, setEffectId] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [premiosReclamados, setPremiosReclamados] = useState([]);

  async function getCanjes() {
    try {
      setIsLoading(true);
      let response = await GET("premios/premioscanjeados",  cliente?.idCliente ? {idCliente: cliente?.idCliente} : {});
      if (response) {
        switch (response.status) {
          case 200:
            response = await response.json();
            setPremiosReclamados(response);
            break;
          case 204:
            setMessage("No se encontraron premios");
            setPremiosReclamados(null)
            break;
          case 401:
            setMessage("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
            setTimeout(() => {
              navigate("/");
            }, 3000);
            break;
          case 500:
            setMessage("Error los premios. Por favor, contacte con un administrador");
            break;
          default:
            setMessage("Error desconocido al cargar los premios");
            break;
        }
      } else {
        setMessage(CheckOnline());
      }
    } catch (err) {
      console.warn(err);
      setMessage(CheckOnline());
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getCanjes();
  }, [cliente]);

  useEffect(() => {
    if (effectId) {
      clearTimeout(effectId);
    }
    if (message) {
      setFadeClass("fade-out");
      setEffectId(
        setTimeout(() => {
          setFadeClass("fade-out hide");
          setTimeout(() => {
            setMessage("");
            setFadeClass("fade-out");
          }, 1000);
        }, 6000)
      );
    }
  }, [message]);

  return (
    <div className="container mt-2">
      <div style={{ boxShadow: "rgb(0 0 0 / 40%) 0px 1rem 2rem" }} className="card-rounded">
        <h2>Premios Reclamados</h2>
        <p className="mb-3">Visualizá los premios canjeados por los clientes</p>
        <BuscarCliente setCliente={setCliente} setMensaje={setMessage} isLoading={isLoading} setIsLoading={setIsLoading}/>
        {message && <div className={`alert alert-info mt-3 ${fadeClass}`}>{message}</div>}
        <div className="table-responsive mt-4">
          {isLoading ? (
            <div className="d-flex justify-content-center align-items-center py-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <table className="table table-striped table-hover align-middle text-center">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Documento</th>
                  <th>Sucursal</th>
                  <th>Premio</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {premiosReclamados && premiosReclamados.length === 0 && (
                  <tr>
                    <td colSpan={11} className="text-center">
                      No hay premios reclamados.
                    </td>
                  </tr>
                )}
                {premiosReclamados && premiosReclamados.map((premio) => (
                  <tr
                    key={premio?.id}
                    className={premio?.estado === "Entregado" ? "table-success" : ""}
                  >
                    <td>{premio?.nombreCliente} {premio?.apellidoCliente}</td>
                    <td>{premio?.documento}</td>
                    <td>{premio?.nombreSucursal}</td>
                    <td>{premio?.nombrePremio}</td>
                    <td>{convertirFechaArgentina(premio?.fecha)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
} 