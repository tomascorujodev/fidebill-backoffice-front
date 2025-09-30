import { useEffect, useState } from "react";
import { DELETE, GET } from "../../services/Fetch";
import CardPremio from "../../components/CardPremio";
import { useParams } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

export default function ViewPremios() {
    const [premios, setPremios] = useState(null);
    const [eliminar, setEliminar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(0);
    const [message, setMessage] = useState("");
    const { empresa } = useParams();

    useEffect(() => {
        async function obtenerPremios() {
            let result = await GET("premios/obtener");
            if (!result) {
                setMessage(navigator.onLine
                    ? "Ha ocurrido un problema. Por favor, espere unos instantes y vuelva a intentarlo"
                    : "Ups... no hay conexión a internet. Verifique la red y vuelva a intentarlo."
                );
                setLoading(false);
                return;
            }
            switch (result.status) {
                case 200:
                    result = await result.json();
                    setPremios(result);
                    break;
                case 204:
                    setMessage("Aún no tiene premios cargados. Publique premios para que sus clientes puedan canjearlos con sus puntos 🏆");
                    break;
                case 401:
                    localStorage.clear();
                    setMessage("Ups... parece que tus credenciales expiraron. Por favor, inicie sesión nuevamente");
                    setTimeout(() => window.location.replace("/admin"), 4000);
                    break;
                default:
                    setMessage("Ha ocurrido un problema en el servidor. Aguardenos unos minutos y vuelva a intentarlo");
                    break;
            }
            setLoading(false);
        }
        obtenerPremios();
    }, [reload]);

    async function eliminarPremio() {
        try {
            setLoading(true);
            let result = await DELETE("premios/eliminar", { IdPremio: eliminar });
            setEliminar(null);
            if (!result) {
                setMessage(navigator.onLine
                    ? "Ha ocurrido un problema. Por favor, espere unos instantes y vuelva a intentarlo."
                    : "Ups... no hay conexión a internet. Verifique la red y vuelva a intentarlo."
                );
                setLoading(false);
                return;
            }
            switch (result.status) {
                case 200:
                    setMessage("El premio se ha eliminado correctamente");
                    setReload(reload + 1);
                    break;
                case 204:
                    setMessage("No se encontró el premio a eliminar.");
                    break;
                case 401:
                    localStorage.clear();
                    setMessage("Ups... parece que tus credenciales expiraron. Por favor, inicie sesión nuevamente");
                    setTimeout(() => window.location.replace("/admin"), 4000);
                    break;
                default:
                    setMessage("Ha ocurrido un problema en el servidor. Aguardenos unos minutos y vuelva a intentarlo");
                    break;
            }
        } catch {
            setMessage("Ha ocurrido un error. Si el problema persiste, por favor, contacte con un administrador.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            {
                loading ? (
                    <div style={{ height: "670px" }} className="w-100 align-content-center">
                        <div style={{ justifySelf: "center", alignSelf: "center" }} className="d-flex spinner-border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : (
                    <div className="d-flex flex-wrap justify-content-center">
                        {premios && premios.map(premio => (
                            <CardPremio
                                key={premio.idPremio}
                                id={premio.idPremio}
                                nombre={premio.nombre}
                                descripcion={premio.descripcion}
                                sellos={premio.sellos}
                                dias={premio.dias}
                                fechaInicio={premio.fechaInicio}
                                fechaFin={premio.fechaFin}
                                sucursales={premio?.usuariosEmpresa?.length === 0 ? ["Todas"] : premio.usuariosEmpresa.map(s => s.nombreUsuarioEmpresa)}
                                urlImagen={premio.urlImagen}
                                eliminar={setEliminar}
                            />
                        ))}
                    </div>
                )
            }

            {message &&
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    aria-labelledby="modalMessageLabel"
                    style={{ display: "block", paddingRight: "17px" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modalMessageLabel">Aviso</h5>
                            </div>
                            <div className="modal-body">{message}</div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setMessage("")}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }

            <Modal show={eliminar} onHide={() => setEliminar(null)}>
                <Modal.Header>
                    <Modal.Title>Advertencia</Modal.Title>
                </Modal.Header>
                <Modal.Body>¿Está seguro que desea eliminar este premio?</Modal.Body>
                <Modal.Footer>
                    {!loading ? (
                        <>
                            <Button variant="secondary" onClick={() => setEliminar(null)}>Cancelar</Button>
                            <Button variant="success" onClick={eliminarPremio}>Confirmar</Button>
                        </>
                    ) : (
                        <div className="d-flex spinner-border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
}