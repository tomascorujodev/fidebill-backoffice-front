import { useEffect, useState } from "react";
import { GET } from "../Services/Fetch";
import CardBenefit from "../Components/CardBenefit";
import { useParams, useSearchParams } from "react-router-dom";

export default function ViewBeneficios({ setIsLoggedIn }) {
    const [beneficios, setBeneficios] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState("");
    const { empresa } = useParams();

    useEffect(() => {
        async function obtenerBeneficios() {
            let result = await GET("beneficios/obtenerbeneficios")
            if (!result) {
                if (navigator.onLine) {
                    setMensaje("Ha ocurrido un problema. Por favor, espere unos instantes y vuelva a intentarlo")
                } else {
                    setMensaje("Ups... no hay conexion a internet. Verifique la red y vuelva a intentarlo.")
                }
                setLoading(false);
                return;
            }
            switch (result.status) {
                case 200:
                    result = await result.json();
                    setBeneficios(result.beneficiosAgrupados);
                    break;
                case 204:
                    setMensaje("Aun no tiene beneficios cargados. Publique beneficios para que sus clientes puedan aprovechar todas las promociones que tienen disponibles!🥳🥳🥳")
                    break;
                case 401:
                    localStorage.clear();
                    setMensaje("Ups... parece que tus credenciales expiraron. Por favor, inicie sesion nuevamente");
                    setTimeout(() => {
                        window.location.replace(`/${empresa}`)
                    }, 4000)
                    break;
                case 500:
                    setMensaje("Ha ocurrido un problema en el servidor. Aguardenos unos minutos y vuelva a intentarlo");
                    break;
                default:
                    setMensaje("Ha ocurrido un problema en el servidor. Aguardenos unos minutos y vuelva a intentarlo");
                    break;
            }
            setLoading(false);
        }
        obtenerBeneficios();
    }, [])
    return (
        <div className="container">
            {
                loading ?
                    <div style={{ height: "670px" }} className="w-100 align-content-center">
                        <div style={{ justifySelf: "center", alignSelf: "center" }} className="d-flex spinner-border" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                    :
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
                    }}>
                        {
                            beneficios &&
                            beneficios.map(beneficio => (
                                <CardBenefit key={beneficio.idBeneficio} id={beneficio.idBeneficio} descripcion={beneficio.descripcion} titulo={beneficio.direccionLocal}
                                    tipo={beneficio.tipo}
                                    dias={beneficio.dias}
                                    porcentajeReintegro={beneficio.porcentajeReintegro}
                                    fechaInicio={beneficio.fechaInicio}
                                    fechaFin={beneficio.fechaFin}
                                    sucursales={beneficio.idsUsuariosEmpresas.map(sucursal => sucursal.nombreUsuarioEmpresa)}
                                    urlImagen={beneficio.urlImagen}
                                />
                            ))
                        }
                    </div>
            }
            {mensaje &&
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    aria-labelledby="modalMessageLabel"
                    style={{ display: "block", paddingRight: "17px" }}
                >
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="modalMessageLabel">
                                    Mensaje
                                </h5>
                            </div>
                            <div className="modal-body">
                                {mensaje}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={() => setMensaje("")}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
