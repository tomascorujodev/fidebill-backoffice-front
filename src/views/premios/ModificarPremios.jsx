import { useEffect, useState } from "react";
import { GET, PATCHFormData, POSTFormData } from "../../services/Fetch.js";
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

                        if (!res?.usuariosEmpresa || res?.usuariosEmpresa?.length === 0) {
                            setSucursales(["Todas"]);
                        } else {
                            let locales = await GET("beneficios/obtenerlocales");
                            locales = await locales.json();
                            setSucursalesConId(locales);
                            let sucursalesAsignadas = [];
                            res.usuariosEmpresa?.forEach((sucursal) => {
                                sucursalesAsignadas.push(sucursal.nombreUsuarioEmpresa)
                            });
                            let tmp = [];
                            locales.map(local => {
                                let flag = false;
                                sucursalesAsignadas.map(nombreUsuarioEmpresa => {
                                    if (local.direccionLocal === nombreUsuarioEmpresa) {
                                        flag = true;
                                    }
                                })
                                if (!flag) {
                                    tmp.push(local.direccionLocal);
                                }
                            })
                            if (sucursalesAsignadas.length === 0) { sucursalesAsignadas.push("Todas") };
                            setSucursales(sucursalesAsignadas);
                            if (sucursalesAsignadas != "Todas") {
                                tmp.push("Todas");
                            }
                            setSucursalesDisponibles(tmp);
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
            } catch (err) {
                console.log(err);
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
        if (sucursales.length === 0) {
            setMessage("Debe seleccionar al menos una sucursal para aplicar su beneficio");
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
                IdPremio: id,
                Nombre: nombrePremio,
                Descripcion: descripcion,
                Sellos: sellosRequeridos,
                Dias: dias,
                FechaInicio: habilitarFechaInicio ? fechaInicio : null,
                FechaFin: habilitarFechaFin ? fechaFin : null,
                Sucursales: sucursalesIds,
            };

            const response = await PATCHFormData("premios/modificar", imagenPremio, premioData);

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
            <div className="card-rounded p-3">
                <div className="row g-4">
                    <div className="col-12 col-xl-6">
                        <h2 className="mb-4">Modificar Premio</h2>

                        <div className="mb-3">
                            <label className="form-label">Nombre(*)</label>
                            <input
                                type="text"
                                className="form-control"
                                maxLength="100"
                                placeholder="Ej: Descuento 50% en pizza"
                                value={nombrePremio}
                                onChange={(e) => setNombrePremio(e.target.value)}
                                disabled={updated}
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Descripción(*)</label>
                            <textarea
                                className="form-control"
                                maxLength="500"
                                placeholder="Describe el premio que recibirán los clientes..."
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                disabled={updated}
                            />
                        </div>

                        <div className="mb-3 d-flex align-items-center">
                            <label htmlFor="sellosRequeridos" className="me-3">Sellos requeridos:</label>
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

                        <div className="mb-3">
                            <label className="form-label">Días</label>
                            <div className="d-flex flex-wrap gap-2">
                                <CheckInput dia={"L"} name={"0"} evento={handleChangeDays} value={dias[0]} />
                                <CheckInput dia={"M"} name={"1"} evento={handleChangeDays} value={dias[1]} />
                                <CheckInput dia={"X"} name={"2"} evento={handleChangeDays} value={dias[2]} />
                                <CheckInput dia={"J"} name={"3"} evento={handleChangeDays} value={dias[3]} />
                                <CheckInput dia={"V"} name={"4"} evento={handleChangeDays} value={dias[4]} />
                                <CheckInput dia={"S"} name={"5"} evento={handleChangeDays} value={dias[5]} />
                                <CheckInput dia={"D"} name={"6"} evento={handleChangeDays} value={dias[6]} />
                            </div>
                        </div>

                        <div className="mb-3 d-flex flex-wrap gap-3">
                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={habilitarFechaInicio}
                                        onChange={() => setHabilitarFechaInicio(!habilitarFechaInicio)}
                                        disabled={updated}
                                        className="me-2"
                                    />
                                    Fecha de Inicio
                                </label>
                                <input
                                    type="date"
                                    className="form-control mt-1"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    disabled={!habilitarFechaInicio || updated}
                                />
                            </div>

                            <div>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={habilitarFechaFin}
                                        onChange={() => setHabilitarFechaFin(!habilitarFechaFin)}
                                        disabled={updated}
                                        className="me-2"
                                    />
                                    Fecha de Fin
                                </label>
                                <input
                                    type="date"
                                    className="form-control mt-1"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    disabled={!habilitarFechaFin || updated}
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label>Sucursales</label>
                            <select
                                className="form-control"
                                value={selectedSucursal}
                                onChange={handleSelectSucursal}
                                disabled={updated}
                            >
                                <option value="" disabled>Seleccione una sucursal</option>
                                {sucursalesDisponibles.map((s, i) => (
                                    <option key={i} value={s}>{s}</option>
                                ))}
                            </select>
                            <div className="mt-2 border p-2" style={{ minHeight: "50px", overflowY: "auto" }}>
                                {sucursales.map((s, i) => (
                                    <span key={i} className="badge bg-light text-dark me-2 mb-2">
                                        {s}{" "}
                                        {!updated && (
                                            <button
                                                name={s}
                                                type="button"
                                                style={{ background: "transparent", border: "none", color: "#e06971", fontSize: "20px", cursor: "pointer" }}
                                                onMouseEnter={(e) => e.target.style.color = "#ff0000"}
                                                onMouseLeave={(e) => e.target.style.color = "#dc3545"}
                                                onClick={handleRemoveSucursal}
                                            >
                                                X
                                            </button>
                                        )}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-12 col-md-8">
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/png, image/jpeg, image/svg+xml"
                                    onChange={handleUploadImage}
                                    disabled={updated}
                                />
                            </div>
                            <div className="col-12 col-md-4 mt-2 mt-md-0">
                                <button
                                    className="btn btn-danger w-100"
                                    onClick={() => {
                                        setUrlImagen(null);
                                        setImagenPremio(null);
                                    }}
                                    disabled={updated}
                                >
                                    Eliminar imagen
                                </button>
                            </div>
                        </div>

                        <div className="d-flex justify-content-end">
                            {isLoading ? (
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            ) : (
                                !updated && (
                                    <button className="btn btn-success" style={{ width: "170px" }} onClick={handleSubmit}>
                                        Actualizar Premio
                                    </button>
                                )
                            )}
                        </div>
                    </div>

                    <div className="col-12 col-xl-6 d-flex justify-content-center">
                        <div>
                            <h4 className="mb-3">Vista Previa</h4>
                            <p className="text-muted">
                                📌 Los clientes podrán canjear este premio al acumular{" "}
                                <strong>{sellosRequeridos}</strong> sellos.
                            </p>
                            <p className="text-muted">
                                💡 Recomendación: Suba imágenes con relación 4:3 (ej: 1200x900).
                            </p>
                            <CardPremio
                                urlImagen={urlImagen}
                                nombre={nombrePremio}
                                descripcion={descripcion}
                                sellos={sellosRequeridos}
                                dias={dias}
                                fechaInicio={habilitarFechaInicio ? fechaInicio : null}
                                fechaFin={habilitarFechaFin ? fechaFin : null}
                                sucursales={sucursales}
                            />
                        </div>
                    </div>


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
