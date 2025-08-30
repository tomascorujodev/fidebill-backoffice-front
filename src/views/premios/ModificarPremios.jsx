import { useEffect, useState } from "react";
import { GET, POSTFormData } from "../../services/Fetch.js";
import { Modal, Button } from "react-bootstrap";
import CheckInput from "../../components/CheckInput.jsx";
import jwtDecode from "../../utils/jwtDecode.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import CardPremio from "../../components/CardPremio.jsx";
import CheckOnline from "../../utils/CheckOnline.jsx";

export default function ModificarPremio() {
    let [params] = useSearchParams();
    let id = params?.get("id");
    const [isLoading, setIsLoading] = useState(false);
    const [nombrePremio, setNombrePremio] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [sellosRequeridos, setSellosRequeridos] = useState(5);
    const [dias, setDias] = useState([false, false, false, false, false, false, false]);
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [habilitarFechaInicio, setHabilitarFechaInicio] = useState(true);
    const [habilitarFechaFin, setHabilitarFechaFin] = useState(true);
    const [imagenPremio, setImagenPremio] = useState(null);
    const [urlImagen, setUrlImagen] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const [sucursalesConId, setSucursalesConId] = useState(null);
    const [sucursalesDisponibles, setSucursalesDisponibles] = useState([]);
    const [sucursales, setSucursales] = useState(["Todas"]);
    const [selectedSucursal, setSelectedSucursal] = useState("");
    const [isConfirmation, setIsConfirmation] = useState(false);
    const [updated, setUpdated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function cargaLocales() {
            const localesResponse = await GET("beneficios/obtenerlocales");
            if (localesResponse) {
                switch (localesResponse.status) {
                    case 200:
                        const locales = await localesResponse.json();
                        setSucursalesConId(locales);
                        const direcciones = locales.map((l) => l.direccionLocal);
                        setSucursalesDisponibles(direcciones.length > 0 ? direcciones : ["Todas"]);
                        break;
                    case 204:
                        setMessage("No hay sucursales disponibles para su empresa");
                        setShowModal(true);
                        break;
                    case 401:
                        setMessage("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
                        setShowModal(true);
                        setTimeout(() => navigate("/"), 3000);
                        break;
                    default:
                        setMessage("Error al cargar las sucursales");
                        setShowModal(true);
                        break;
                }
            } else {
                setMessage(CheckOnline());
                setShowModal(true);
            }
        }

        cargaLocales();
    }, [navigate]);

    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                setIsLoading(true);
                let res = await GET(`premios/buscar/${id}`);
                switch (res?.status) {
                    case 200:
                        res = await res?.json();
                        setNombrePremio(res?.nombre);
                        setDescripcion(res?.descripcion)
                        setSellosRequeridos(res?.sellos);
                        setDias(res?.dias);
                        if (res?.fechaInicio) {
                            setHabilitarFechaInicio(true);
                            setFechaInicio(res?.fechaInicio.split("T")[0]);
                        } else {
                            setHabilitarFechaInicio(false);
                        }
                        if (res?.fechaFin) {
                            setHabilitarFechaFin(true);
                            setFechaFin(res?.fechaFin.split("T")[0]);
                        } else {
                            setHabilitarFechaFin(false);
                        }
                        setUrlImagen(res?.urlImagen);
                        setImagenPremio(null);

                        if (!res?.sucursales || res?.sucursales?.length === 0) {
                            setSucursales(["Todas"]);
                        } else {
                            const sucursalesAsignadas = [];
                            res.sucursales?.forEach((idSucursal) => {
                                const suc = sucursalesConId?.find((s) => s.idUsuarioEmpresa === idSucursal);
                                if (suc) sucursalesAsignadas.push(suc.direccionLocal);
                            });
                            setSucursales(sucursalesAsignadas.length > 0 ? sucursalesAsignadas : ["Todas"]);
                        }
                        break;
                    case 404:
                        setMessage("El premio no existe");
                        setShowModal(true);
                        break;
                    case 401:
                        setMessage("Sesión expirada");
                        setShowModal(true);
                        setTimeout(() => navigate("/"), 3000);
                        break;
                    default:
                        setMessage(CheckOnline());
                        setShowModal(true);
                        break;
                }
            } catch {
                setMessage("Ha ocurrido un problema en la aplicación. Por favor, intente más tarde.");
                setShowModal(true);
            } finally {
                setIsLoading(false);
            }
        }
        )()
    }, [id]);

    function handleChangeDays(e) {
        const newDias = [...dias];
        newDias[e.target.name] = e.target.checked;
        setDias(newDias);
    }

    function handleSelectSucursal(e) {
        let selectedValue = e.target.value;
        if (selectedValue === "Todas") {
            setSucursales(["Todas"]);
            setSucursalesDisponibles(sucursalesConId.map((l) => l.direccionLocal));
        } else if (!sucursales.includes("Todas")) {
            setSelectedSucursal("");
            setSucursales([...sucursales, selectedValue]);
            setSucursalesDisponibles(sucursalesDisponibles.filter((s) => s !== selectedValue));
        }
    }

    function handleRemoveSucursal(e) {
        const sucursalAEliminar = e.target.name;
        setSucursales(sucursales.filter((s) => s !== sucursalAEliminar));
        setSucursalesDisponibles([...sucursalesDisponibles, sucursalAEliminar]);
    }

    function handleUploadImage(e) {
        let archivo = e.target.files[0];
        if (archivo && ["image/jpeg", "image/png", "image/svg+xml"].includes(archivo.type)) {
            if (archivo.size <= 1048576) {
                setImagenPremio(archivo);
                setUrlImagen(URL.createObjectURL(archivo));
            } else {
                setMessage("La imagen excede el tamaño máximo permitido de 1MB");
                setShowModal(true);
                setImagenPremio(null);
                setUrlImagen(null);
                e.target.value = null;
            }
        } else {
            setMessage("El formato de archivo no es compatible");
            setShowModal(true);
            setUrlImagen(null);
            setImagenPremio(null);
            e.target.value = "";
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!nombrePremio.trim()) {
            setMessage("El nombre del premio es obligatorio");
            setShowModal(true);
            return;
        }
        if (!descripcion.trim()) {
            setMessage("La descripción del premio es obligatoria");
            setShowModal(true);
            return;
        }
        if (sellosRequeridos < 1 || sellosRequeridos > 15) {
            setMessage("Los sellos requeridos deben estar entre 1 y 15");
            setShowModal(true);
            return;
        }
        if (habilitarFechaInicio && !fechaInicio) {
            setMessage("La fecha de inicio aun no ha sido establecida");
            setShowModal(true);
            return;
        }
        if (habilitarFechaFin && !fechaFin) {
            setMessage("La fecha de fin aun no ha sido establecida");
            setShowModal(true);
            return;
        }
        if (habilitarFechaFin && new Date(fechaFin) < new Date()) {
            setMessage("La fecha de fin debe ser posterior a la fecha actual");
            setShowModal(true);
            return;
        }
        if (habilitarFechaFin && habilitarFechaInicio && new Date(fechaInicio) >= new Date(fechaFin)) {
            setMessage("La fecha de fin debe ser posterior a la fecha de inicio");
            setShowModal(true);
            return;
        }
        if (!dias.some((v) => v === true)) {
            setMessage("Debe seleccionar al menos un día de la semana");
            setShowModal(true);
            return;
        }

        if (!isConfirmation) {
            setIsConfirmation(true);
            setMessage(
                "Está a punto de modificar el premio visible para sus clientes. ¿Desea continuar?"
            );
            setShowModal(true);
            return;
        }

        setIsConfirmation(false);
        setIsLoading(true);

        try {
            let sucursalesIds = null;
            if (
                (sucursalesDisponibles[0] === "Todas" && sucursalesDisponibles.length === 1) ||
                (sucursales[0] === "Todas" && sucursales.length === 1)
            ) {
                sucursalesIds = null;
            } else {
                sucursalesIds = [];
                sucursales.forEach((sucursal) => {
                    sucursalesConId.forEach((sucursalConId) => {
                        if (sucursalConId.direccionLocal === sucursal) {
                            sucursalesIds.push(sucursalConId.idUsuarioEmpresa);
                        }
                    });
                });
            }

            const premioData = {
                Id: id,
                Nombre: nombrePremio,
                Descripcion: descripcion,
                Sellos: sellosRequeridos,
                Dias: dias,
                FechaInicio: habilitarFechaInicio ? fechaInicio : null,
                FechaFin: habilitarFechaFin ? fechaFin : null,
                Sucursales: sucursalesIds,
            };

            const response = await POSTFormData("premios/modificar", imagenPremio, premioData);

            if (response) {
                switch (response.status) {
                    case 200:
                        setMessage("El premio se ha modificado correctamente.");
                        setUpdated(true);
                        setShowModal(true);
                        break;
                    case 400:
                        setMessage("Verifique que todos los campos sean correctos y vuelva a intentarlo");
                        setShowModal(true);
                        break;
                    case 401:
                        setMessage("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
                        setShowModal(true);
                        setTimeout(() => navigate("/"), 3000);
                        break;
                    case 500:
                        setMessage("No se pudo procesar su petición. Por favor, contacte con un administrador");
                        setShowModal(true);
                        break;
                    default:
                        try {
                            const errData = await response.json();
                            setMessage(errData.message || "Error desconocido");
                            setShowModal(true);
                        } catch {
                            setMessage("Error al procesar la respuesta del servidor");
                            setShowModal(true);
                        }
                        break;
                }
            } else {
                setMessage(navigator.onLine ? "El servidor no responde. Intente más tarde." : "Se perdió la conexión a internet");
                setShowModal(true);
            }
        } catch (error) {
            console.error("Error al modificar premio:", error);
            setMessage(
                "¡Ups! Hubo un error al intentar procesar su petición. Por favor inténtelo nuevamente, y si el error persiste, contacte con un administrador."
            );
            setShowModal(true);
        }

        setIsLoading(false);
    }

    return (
        <div className="container">
            <div
                className="card-rounded"
                style={{
                    display: "grid",
                    gridTemplateColumns: "250px 1fr 1fr 40px 1fr",
                    gridTemplateRows: "90px 90px 110px 90px 80px 90px 140px 90px 90px 90px",
                    gap: "16px",
                }}
            >
                <h2 style={{ gridColumn: "1", gridRow: "1", paddingRight: "16px" }}>Modificar Premio</h2>
                <h4 style={{ gridColumn: "1", gridRow: "2", paddingRight: "16px" }}>Nombre(*)</h4>
                <h4 style={{ gridColumn: "1", gridRow: "3", paddingRight: "16px" }}>Descripción(*)</h4>
                <h4 style={{ gridColumn: "1", gridRow: "4", paddingRight: "16px" }}>Sellos</h4>
                <h4 style={{ gridColumn: "1", gridRow: "5", paddingRight: "16px" }}>Días</h4>
                <h4 style={{ gridColumn: "1", gridRow: "6", paddingRight: "16px" }}>Fechas</h4>
                <h4 style={{ gridColumn: "1", gridRow: "7", paddingRight: "16px" }}>Sucursales</h4>
                <h4 style={{ gridColumn: "1", gridRow: "8", paddingRight: "16px" }}>Imagen</h4>

                <div
                    style={{
                        gridColumn: "4",
                        gridRow: "1 / span 8",
                        borderLeft: "1px solid gray",
                        height: "auto",
                        alignSelf: "stretch",
                        justifySelf: "center",
                    }}
                ></div>

                <div style={{ gridColumn: "5", gridRow: "1", alignSelf: "start", paddingLeft: "16px" }}>
                    <h4>Vista Previa</h4>
                    <p style={{ color: "gray", fontSize: "12px" }}>
                        📌 Los clientes podrán canjear este premio al acumular {sellosRequeridos} sellos.
                    </p>
                </div>

                <input
                    style={{ gridColumn: "2 / 4", gridRow: "2", display: "flex", height: "40px" }}
                    className="form-control"
                    type="text"
                    maxLength="100"
                    placeholder="Ej: Descuento 50% en pizza"
                    value={nombrePremio}
                    onChange={(e) => setNombrePremio(e.target.value)}
                    disabled={updated}
                />

                <textarea
                    style={{ maxHeight: "95px", gridColumn: "2 / 4", gridRow: "3", paddingRight: "16px" }}
                    className="form-control"
                    maxLength="500"
                    placeholder="Describe el premio que recibirán los clientes..."
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    disabled={updated}
                />

                <div style={{ gridColumn: "2 / 4", gridRow: "4", paddingRight: "16px" }} className="mb-3 d-flex align-items-center">
                    <label htmlFor="sellosRequeridos" className="me-3">
                        Sellos requeridos:
                    </label>
                    <input
                        type="number"
                        min="2"
                        max="15"
                        className="form-control"
                        style={{ width: "100px" }}
                        id="sellosRequeridos"
                        value={sellosRequeridos}
                        onChange={(e) => setSellosRequeridos(parseInt(e.target.value) || 1)}
                        disabled={updated}
                    />
                    <span className="ms-2 text-muted">(2-15)</span>
                </div>

                <div style={{ gridColumn: "2 / 5", gridRow: "5", paddingRight: "16px" }}>
                    <CheckInput dia={"L"} name={"0"} evento={handleChangeDays} value={dias[0]} />
                    <CheckInput dia={"M"} name={"1"} evento={handleChangeDays} value={dias[1]} />
                    <CheckInput dia={"X"} name={"2"} evento={handleChangeDays} value={dias[2]} />
                    <CheckInput dia={"J"} name={"3"} evento={handleChangeDays} value={dias[3]} />
                    <CheckInput dia={"V"} name={"4"} evento={handleChangeDays} value={dias[4]} />
                    <CheckInput dia={"S"} name={"5"} evento={handleChangeDays} value={dias[5]} />
                    <CheckInput dia={"D"} name={"6"} evento={handleChangeDays} value={dias[6]} />
                </div>

                <div
                    style={{ gridColumn: "2 / 4", gridRow: "6", paddingRight: "16px" }}
                    className="mb-3 d-flex align-content-center"
                >
                    <div>
                        <label htmlFor="CheckFechaInicio" className="pe-4">
                            Fecha de Inicio
                        </label>
                        <input
                            type="checkbox"
                            id="CheckFechaInicio"
                            checked={habilitarFechaInicio}
                            onChange={() => setHabilitarFechaInicio(!habilitarFechaInicio)}
                            disabled={updated}
                        />
                        <input
                            type="date"
                            className="form-control"
                            id="FechaInicio"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            disabled={!habilitarFechaInicio || updated}
                        />
                    </div>

                    <div className="d-flex p-3 mt-3">-</div>

                    <div>
                        <label htmlFor="CheckFechaFin" className="pe-4">
                            Fecha de Fin
                        </label>
                        <input
                            type="checkbox"
                            id="CheckFechaFin"
                            checked={habilitarFechaFin}
                            onChange={() => setHabilitarFechaFin(!habilitarFechaFin)}
                            disabled={updated}
                        />
                        <input
                            type="date"
                            className="form-control"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            disabled={!habilitarFechaFin || updated}
                        />
                    </div>
                </div>

                <div
                    style={{ gridColumn: "2 / 4", gridRow: "7", maxHeight: "120px", paddingRight: "16px" }}
                    className="mb-3"
                >
                    <select
                        className="form-control"
                        id="Sucursales"
                        value={selectedSucursal}
                        onChange={handleSelectSucursal}
                        disabled={updated}
                    >
                        <option value="" disabled>
                            Seleccione una sucursal
                        </option>
                        {sucursalesDisponibles &&
                            sucursalesDisponibles.map((sucursal, index) => (
                                <option key={index} value={sucursal}>
                                    {sucursal}
                                </option>
                            ))}
                    </select>
                    <div className="mt-2 border p-2" style={{ minHeight: "50px", overflowY: "auto" }}>
                        {sucursales &&
                            sucursales.map((sucursal, index) => (
                                <span
                                    key={index}
                                    style={{ fontSize: "14px" }}
                                    className="badge bg-light text-dark me-2 mb-2"
                                >
                                    {sucursal}{" "}
                                    {!updated && (
                                        <button
                                            name={sucursal}
                                            type="button"
                                            style={{
                                                background: "transparent",
                                                border: "none",
                                                color: "#e06971",
                                                fontSize: "20px",
                                                cursor: "pointer",
                                            }}
                                            onMouseEnter={(e) => (e.target.style.color = "#ff0000")}
                                            onMouseLeave={(e) => (e.target.style.color = "#dc3545")}
                                            className="btn btn-sm btn-danger ms-2"
                                            onClick={handleRemoveSucursal}
                                        >
                                            X
                                        </button>
                                    )}
                                </span>
                            ))}
                    </div>
                </div>

                <div style={{ gridColumn: "2 / 3", gridRow: "8", paddingRight: "16px" }} className="mb-3">
                    <input
                        type="file"
                        className="form-control"
                        accept="image/png, image/jpeg, image/svg+xml"
                        onChange={handleUploadImage}
                        disabled={updated}
                    />
                </div>

                <div style={{ gridColumn: "3 / 4", gridRow: "8" }} className="mb-3 mx-4">
                    <button
                        className="btn btn-danger"
                        onClick={() => {
                            setUrlImagen(null);
                            setImagenPremio(null);
                        }}
                        disabled={updated}
                    >
                        Eliminar imagen
                    </button>
                </div>

                <div style={{ gridColumn: "5", gridRow: "2 / 9", paddingLeft: "16px" }}>
                    <CardPremio urlImagen={urlImagen}
                        nombre={nombrePremio}
                        descripcion={descripcion}
                        sellos={sellosRequeridos}
                        dias={dias}
                        fechaInicio={habilitarFechaInicio ? fechaInicio : null}
                        fechaFin={habilitarFechaFin ? fechaFin : null}
                        sucursales={sucursales}
                    />
                </div>

                <div
                    className="d-flex align-content-center justify-content-end"
                    style={{ gridColumn: "5", gridRow: "9" }}
                >
                    {isLoading ? (
                        <div className="spinner-border mt-4 mr-4" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    ) : (
                        !updated && (
                            <button
                                style={{ width: "170px", height: "40px" }}
                                className="btn btn-success"
                                onClick={handleSubmit}
                            >
                                Actualizar Premio
                            </button>
                        )
                    )}
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isConfirmation ? "Confirmar acción" : updated ? "Éxito" : "Error"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{message}</Modal.Body>
                <Modal.Footer>
                    {isConfirmation ? (
                        <>
                            <Button
                                variant="success"
                                onClick={() => {
                                    setShowModal(false);
                                    handleSubmit(new Event("submit", { cancelable: true, bubbles: true }));
                                }}
                            >
                                Confirmar
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setShowModal(false);
                                    setIsConfirmation(false);
                                }}
                            >
                                Cancelar
                            </Button>
                        </>
                    ) : (
                        <Button variant="primary" onClick={() => setShowModal(false)}>
                            {updated ? "Cerrar" : "Aceptar"}
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
}
