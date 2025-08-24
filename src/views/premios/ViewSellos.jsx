import React, { useState } from 'react';
import "../../assets/css/ViewPuntos.css";
import Button from "../../components/Button";
import CardPremio from '../../components/CardPremio';
import { GET } from '../../services/Fetch';

export default function ViewSellos() {
  const [documento, setDocumento] = useState("");
  const [cliente, setCliente] = useState(null);
  const [opcionSellos, setOpcionSellos] = useState(0);
  const [premios, setPremios] = useState([]);
  const [premioSeleccionado, setPremioSeleccionado] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [fadeClass, setFadeClass] = useState("fade-out");
  const [effectId, setEffectId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // cree el procedure [BO_CL_obtener_sellos_x_cliente], ahora resta usarlo en el back para traer todos los premios del usuario
  // ya esta implementado, hay que ver si anda y terminar el SP de cargar sellos
  async function buscarCliente(){
    try {
      if (documento.length < 4) {
        setMensaje("Ingrese al menos 4 números");
        return;
      }
      setIsLoading(true);
      let response = await GET("clientes/buscarclientepordocumento", {busqueda: documento});
      setCliente(await response.json());
    } catch {
      setMensaje("Ha ocurrido un error inesperado. Por favor, reintente en unos momentos.");
    }finally{
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (effectId) {
      clearTimeout(effectId);
    }
    if (mensaje) {
      setFadeClass("fade-out");
      setEffectId(
        setTimeout(() => {
          setFadeClass("fade-out hide");
          setTimeout(() => {
            setMensaje("");
            setFadeClass("fade-out");
          }, 1000);
        }, 6000)
      );
    }
  }, [mensaje]);

  const cargarSello = () => {
    setCliente((prev) => {
      const nuevosSellos = { ...prev.sellos };
      nuevosSellos[premioSeleccionado.id] = (nuevosSellos[premioSeleccionado.id] || 0) + 1;
      return { ...prev, sellos: nuevosSellos };
    });
    setModalText(`Se cargó 1 sello para "${premioSeleccionado.nombre}" a "${cliente?.nombre} ${cliente?.apellido}"`);
    setShowModal(true);
  };

  const canjearPremio = () => {
    if ((cliente.sellos[premioSeleccionado.id] || 0) >= premioSeleccionado.sellosNecesarios) {
      setCliente((prev) => {
        const nuevosSellos = { ...prev.sellos };
        nuevosSellos[premioSeleccionado.id] -= premioSeleccionado.sellosNecesarios;
        return { ...prev, sellos: nuevosSellos };
      });
      setModalText(`Se canjeó el premio "${premioSeleccionado.nombre}" a "${cliente?.nombre} ${cliente?.apellido}"`);
      setShowModal(true);
    } else {
      setMensaje("El cliente no tiene suficientes sellos para este premio.");
    }
  };

  const resetear = () => {
    setOpcionSellos(0);
    setPremioSeleccionado(null);
    setShowModal(false);
  };

  return (
    <div className="container mt-2">
      <div style={{ boxShadow: "rgb(0 0 0 / 40%) 0px 1rem 2rem" }} className="card-rounded">
        <h2>Gestión de Sellos</h2>
        <br />
        <label htmlFor="documento" className="form-label">
          Documento del Cliente
        </label>
        <div className="d-flex mb-4">
          <input
            type="text"
            className="form-control w-75"
            id="documento"
            value={documento}
            onChange={e => setDocumento(e.target.value)}
          />
          <button
            style={{ width: "25%", minHeight: "2rem", maxHeight: "4rem" }}
            className="btn btn-primary ms-2 center"
            onClick={buscarCliente}
            disabled={isLoading}
          >
            Buscar Cliente
          </button>
        </div>
        {cliente && (
          <span>
            <h5 className="card-title mb-4">
              {cliente.nombre} {cliente.apellido}, DNI: {cliente.documento}
            </h5>
            <button
              className={`btn p-3 me-4 ${opcionSellos === 1 ? "btn-success active" : "btn-outline-success"}`}
              onClick={() => { setOpcionSellos(1); setPremioSeleccionado(null); }}
            >
              Cargar Sello
            </button>
            <button
              className={`btn p-3 ${opcionSellos === 2 ? "btn-warning active" : "btn-outline-warning"}`}
              onClick={() => { setOpcionSellos(2); setPremioSeleccionado(null); }}
            >
              Canjear Premio
            </button>
          </span>
        )}
        {mensaje && <div className={`alert alert-info mt-3 ${fadeClass}`}>{mensaje}</div>}
      </div>

      {opcionSellos !== 0 && cliente && (
        <>
          <br />
          <div className="card-rounded">
            <h5 className="mb-3">Premios Disponibles</h5>
            <div className="row">
              {premios.map((premio) =>
                <CardPremio id={premio.id} urlImagen={premio?.urlImagen} nombrePremio={premio?.nombre} descripcion={premio?.descripcion} sellosRequeridos={premio?.sellosNecesarios} eliminar={premio?.descripcion} />
              )}
            </div>
            {premioSeleccionado && (
              <div className="mt-4">
                {opcionSellos === 1 && (
                  <Button text={"Cargar Sello"} onClick={cargarSello} />
                )}
                {opcionSellos === 2 && (
                  <Button text={"Canjear Premio"} className="btn-warning" onClick={canjearPremio} />
                )}
              </div>
            )}
          </div>
        </>
      )}
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
                <h5 className="modal-title">Operación Exitosa</h5>
              </div>
              <div className="modal-body">
                <p>{modalText}</p>
              </div>
              <div className="modal-footer">
                <Button text="Cerrar" className="btn-success" onClick={resetear} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 