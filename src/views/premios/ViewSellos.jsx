import { useEffect, useState } from 'react';
import "../../assets/css/ViewPuntos.css";
import Button from "../../components/Button";
import BuscarCliente from "../../components/BuscarCliente.jsx";
import CardPremio from '../../components/CardPremio';
import { GET, POST } from '../../services/Fetch';
import CheckOnline from '../../utils/CheckOnline.jsx';
import { convertirFecha } from '../../utils/ConvertirFechas.jsx';

export default function ViewSellos() {
  const [cliente, setCliente] = useState(null);
  const [premios, setPremios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [fadeClass, setFadeClass] = useState("fade-out");
  const [effectId, setEffectId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState("alert");
  const [onConfirm, setOnConfirm] = useState(null);


  useEffect(() => {
    if (!cliente) return;
    (async () => {
      try {
        let response = await GET("premios/obtenerselloscliente", { idCliente: cliente.idCliente });
        if (!response) {
          setMensaje(CheckOnline());
        } else {
          switch (response.status) {
            case 200:
              response = await response.json();
              setPremios(response);
              break;
            case 204:
              setMensaje("No se encontraron sellos");
              setPremios([]);
              break;
            case 401:
              setMensaje("Sus credenciales expiraron, por favor, vuelva a iniciar sesion.");
              setPremios([]);
              break;
            case 500:
              setMensaje("Hubo un problema en el servidor. Por favor, contacte con un administrador");
              setPremios([]);
              break;
            default:
              setMensaje("Hubo un problema. Por favor, contacte con un administrador");
              setPremios([]);
              break;
          }
        }
      } catch (error) {
        console.log(error)
        setMensaje("Hubo un problema al intentar obtener los sellos");
        setPremios([]);
      } finally {
        setIsLoading(false);
      }
    })()
  }, [cliente]);

  useEffect(() => {
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

  async function canjearPremio(id) {
    openConfirmModal(
      "¿Está seguro que desea cargar este premio?",
      async () => {
        setIsLoading(true);
        try {
          let premio = premios.find(p => p.idPremio === id);
          let request = { IdPremio: id, IdCliente: cliente.idCliente }
          const response = await POST("premios/cargarsellos", request);

          if (response?.status === 200) {
            if (premio.sellosAcumulados === premio.sellos) {
              setModalText("Se canjeó el premio correctamente");
            } else {
              setModalText("El sello se cargó correctamente");
            }
            setModalType("alert");
            setCliente(null);
            setPremios(null);
          } else {
            setModalText(CheckOnline());
            setModalType("alert");
          }
        } catch (err) {
          console.log(err);
          setModalText(CheckOnline());
          setModalType("alert");
        } finally {
          setShowModal(true);
          setIsLoading(false);
        }
      }
    );
  }


  function openConfirmModal(text, confirmCallback) {
    setModalText(text);
    setModalType("confirm");
    setOnConfirm(() => confirmCallback);
    setShowModal(true);
  }


  return (

    <div className="container mt-2">
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000
          }}
        >
          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}
      <div style={{ boxShadow: "rgb(0 0 0 / 40%) 0px 1rem 2rem" }} className="card-rounded">
        <BuscarCliente titulo={"Gestión de Sellos"} setCliente={setCliente} setMensaje={setMensaje} isLoading={isLoading} setIsLoading={setIsLoading} />
        {cliente && (
          <span>
            <h5 className="card-title">
              {cliente.nombre} {cliente.apellido}, DNI: {cliente.documento}
            </h5>
          </span>
        )}
        {mensaje && <div className={`alert alert-info mt-3 ${fadeClass}`}>{mensaje}</div>}
      </div>

      {cliente && (
        <>
          <br />
          <div className="card-rounded">
            <h5 className="mb-3">Premios Disponibles</h5>
            <div className="d-flex flex-wrap w-100 justify-content-center">
              {(premios && premios?.length > 0) && premios.map((premio) =>
                <CardPremio
                  key={premio.idPremio}
                  id={premio.idPremio}
                  nombre={premio?.nombre}
                  descripcion={premio?.descripcion}
                  dias={premio?.dias}
                  sellos={premio?.sellos}
                  sellosAcumulados={premio?.sellosAcumulados}
                  fechaInicio={premio?.fechaInicio}
                  fechaFin={premio?.fechaFin}
                  sucursales={premio?.usuariosEmpresa && premio.usuariosEmpresa.map(s => s.nombreUsuarioEmpresa)}
                  urlImagen={premio?.urlImagen}
                  canjearPremio={canjearPremio}
                />
              )}
            </div>
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
                <h5 className="modal-title">{modalType === "confirm" ? "Confirmar acción" : "Aviso"}</h5>
              </div>
              <div className="modal-body">
                <p>{modalText}</p>
              </div>
              <div className="modal-footer">
                {modalType === "confirm" ? (
                  <>
                    <Button text="Cancelar" className="btn-secondary" onClick={() => setShowModal(false)} />
                    <Button text="Aceptar" className="btn-success" onClick={() => { onConfirm?.(); setShowModal(false); }} />
                  </>
                ) : (
                  <Button text="Cerrar" className="btn-success" onClick={() => setShowModal(false)} />
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
} 