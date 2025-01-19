import { useEffect, useState } from "react";
import { GET, POST } from "../Services/Fetch";
import { convertirFecha, convertirFechaArgentina } from "../Utils/ConvertirFechas";
import Pagination from "../Components/Pagination";
import StatusLabel from "../Components/StatusLabel";
import Button from "../Components/Button";

export default function ViewCompras() {
  const [compras, setCompras] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(null);
  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (busqueda) {
      filtarCompras();
    } else {
      obtenerCompras();
    }
  }, [page, busqueda]);

  async function obtenerCompras() {
    try {
      let response = await GET("puntos/obtenercompras", { page: page });
      if (response) {
        switch (response.status) {
          case 200:
            response = await response.json();
            setCompras(response.compras);
            setMensaje("");
            return;
          case 204:
            setMensaje("No hay compras cargados");
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
      setMensaje("Hubo un problema al intentar obtener las compras");
      setClientes([]);
    }
  }

  async function filtarCompras() {
    try {
      let compras = await GET("puntos/buscarcomprasporcliente", { page: page, busqueda: busqueda });
      if (compras) {
        setMensaje("");
        compras = await compras.json();
        setCompras(compras.compras);
      }
    } catch {
      setMensaje("Hubo un problema al intentar obtener los compras");
    }
  }

  async function cancelarCompra() {
    try {
      let response = await POST("puntos/anulacioncompra", { IdaAnular: showModal, Motivo: motivo });
      if (response.status === 200) {
        setMensaje("Compra cancelada correctamente");
        obtenerCompras();
      } else {
        setMensaje("Hubo un error al cancelar la compra");
      }
    } catch {
      setMensaje("Hubo un problema al intentar cancelar la compra");
    }
  }

  return (
    <>
      <div className="container">
      <div className="card p-4">
        <h2>Compras</h2>
        <br />
          <input
            className="form-control me-2"
            type="search"
            onChange={e => setBusqueda(e.target.value)}
            placeholder="Buscar compra"
            aria-label="Buscar compra"
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
              <th scope="col">Fecha y hora</th>
              <th scope="col">Estado</th>
              <th scope="col">Monto</th>
              <th scope="col">Puntos agregados</th>
              <th scope="col">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {compras?.map((compra, index) => (
              <tr key={`${compra.fechaCompra}` + index}>
                <td>{compra.nombre}</td>
                <td>{compra.apellido}</td>
                <td>{compra.documento}</td>
                <td>{convertirFechaArgentina(compra?.fechaCompra)}</td>
                <td>{<StatusLabel status={compra.estadoCompra} />}</td>
                <td>{compra.monto}</td>
                <td>{compra.puntosAgregados}</td>
                <td>{compra.puntos}</td>
                <td>
                  <Button
                    text={"Cancelar"}
                    className="btn btn-danger"
                    onClick={() => setShowModal(compra.idCompra)}
                    disabled={compra.estadoCompra === 0 || (compra.puntos < compra.puntosAgregados)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination currentPage={page} onPageChange={setPage} />
      </div>
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)", position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1050 }}
          aria-modal="true"
          role="dialog"
        >
          <div className="modal-dialog" style={{ maxWidth: "800px", top: "50%", transform: "translate(-0%, -50%)", margin: "auto" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar cancelación</h5>
                <Button text="" className="btn-close" onClick={() => setShowModal(null)} />
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que deseas cancelar esta compra? Esta acción no se puede deshacer.</p>
                <div className="form-group">
                  <label htmlFor="motivo">Motivo de la cancelación:</label>
                  <textarea id="motivo" className="form-control" value={motivo} onChange={e => setMotivo(e.target.value)} rows="4" placeholder="Escriba el motivo aquí"/>
                </div>
              </div>
              <div className="modal-footer">
                <Button text="Cancelar" className="btn-secondary" onClick={() => setShowModal(null)} />
                <Button text="Confirmar" className="btn-danger" onClick={cancelarCompra} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
