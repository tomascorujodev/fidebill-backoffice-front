import { useEffect, useState } from "react";
import { GET, POSTFormData } from "../../services/Fetch.js";
import { Modal, Button } from "react-bootstrap";
import CheckInput from "../../components/CheckInput.jsx";
import { useNavigate } from "react-router-dom";
import CardPremio from "../../components/CardPremio.jsx";

export default function CrearPremios() {
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
  const [sucursales, setSucursales] = useState(["Todas"]);
  const [sucursalesConId, setSucursalesConId] = useState(null);
  const [sucursalesDisponibles, setSucursalesDisponibles] = useState([]);
  const [selectedSucursal, setSelectedSucursal] = useState("");
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [created, setCreated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargaInicial() {
      let locales = await GET("beneficios/obtenerlocales");
      if (locales) {
        switch (locales.status) {
          case 200:
            locales = await locales.json();
            setSucursalesConId(locales);
            let tmp = [];
            locales?.map((local) => {
              tmp.push(local.direccionLocal);
            });
            setSucursalesDisponibles(tmp);
            break;
          case 204:
            setMessage("No hay sucursales disponibles para su empresa");
            setShowModal(true);
            break;
          case 401:
            setMessage("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
            setTimeout(() => {
              navigate("/");
            }, 3000);
            setShowModal(true);
            break;
          case 500:
            setMessage("Error al cargar las sucursales. Por favor, contacte con un administrador");
            setShowModal(true);
            break;
          default:
            setMessage("Error desconocido al cargar las sucursales");
            setShowModal(true);
            break;
        }
      } else {
        if (navigator.onLine) {
          setMessage(
            "El servidor no responde. Por favor vuelva a intentarlo en unos minutos. Si el problema persiste contáctese con un administrador"
          );
        } else {
          setMessage("Se perdió la conexión a internet");
        }
        setShowModal(true);
      }
    }
    cargaInicial();
  }, [navigate]);

  function handleChangeDays(e) {
    const newDias = [...dias];
    newDias[e.target.name] = e.target.checked;
    setDias(newDias);
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

    if (
      habilitarFechaFin &&
      habilitarFechaInicio &&
      new Date(fechaInicio) >= new Date(fechaFin)
    ) {
      setMessage("La fecha de fin debe ser posterior a la fecha de inicio");
      setShowModal(true);
      return;
    }

    if (!dias.some((value) => value === true)) {
      setMessage("Debe seleccionar al menos un dia de la semana");
      setShowModal(true);
      return;
    }

    if (!isConfirmation) {
      setIsConfirmation(true);
      setMessage("Está a punto de crear un premio visible para sus clientes. Los clientes podrán canjear este premio al acumular los sellos requeridos. ¿Desea publicar?");
      setShowModal(true);
      return;
    }

    setIsConfirmation(false);
    setIsLoading(true);
    try {
      let tmp = [];
      if (
        (sucursalesDisponibles[0] === "Todas" &&
          sucursalesDisponibles.length === 1) ||
        (sucursales[0] === "Todas" && sucursales.length === 1)
      ) {
        tmp = null;
      } else {
        sucursales.map((sucursal) => {
          sucursalesConId.map((sucursalConId) => {
            if (sucursalConId.direccionLocal === sucursal) {
              tmp.push(sucursalConId.idUsuarioEmpresa);
            }
          });
        });
      }

      const premioData = {
        Nombre: nombrePremio,
        Descripcion: descripcion,
        Sellos: sellosRequeridos,
        Dias: dias,
        FechaInicio: habilitarFechaInicio ? fechaInicio : null,
        FechaFin: habilitarFechaFin ? fechaFin : null,
        Sucursales: tmp
      };

      let response = await POSTFormData(
        "premios/cargar",
        imagenPremio,
        premioData
      );

      if (response) {
        switch (response.status) {
          case 200:
            setMessage("El premio se ha creado correctamente.");
            setCreated(true);
            setNombrePremio("");
            setDescripcion("");
            setSellosRequeridos(5);
            setDias([false, false, false, false, false, false, false]);
            setFechaInicio("");
            setFechaFin("");
            setHabilitarFechaInicio(true);
            setHabilitarFechaFin(true);
            setImagenPremio(null);
            setUrlImagen(null);
            setSucursales(["Todas"]);
            setSelectedSucursal("");
            break;
          case 400:
            setMessage(
              "Verifique que todos los campos sean correctos y vuelva a intentarlo"
            );
            break;
          case 401:
            setMessage("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
            setTimeout(() => {
              navigate("/");
            }, 3000);
            break;
          case 500:
            setMessage(
              "No se pudo procesar su petición. Por favor, contacte con un administrador"
            );
            break;
          default:
            try {
              const errorData = await response.json();
              setMessage(errorData.message || "Error desconocido");
            } catch {
              setMessage("Error al procesar la respuesta del servidor");
            }
            break;
        }
      } else {
        if (navigator.onLine) {
          setMessage(
            "El servidor no responde. Por favor vuelva a intentarlo en unos minutos. Si el problema persiste contáctese con un administrador"
          );
        } else {
          setMessage("Se perdió la conexión a internet");
        }
      }
      setShowModal(true);
    } catch (error) {
      console.error("Error al crear premio:", error);
      setMessage(
        "¡Ups! Hubo un error al intentar procesar su petición. Por favor inténtelo nuevamente, y si el error persiste, contacte con un administrador."
      );
      setShowModal(true);
    }
    setIsLoading(false);
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

  function handleSelectSucursal(e) {
    let selectedValue = e.target.value;
    if (selectedValue == "Todas") {
      let tmp = [...sucursales];
      sucursalesDisponibles.map((sucursalDisponible) => {
        if (sucursalDisponible !== "Todas") tmp.push(sucursalDisponible);
      });
      setSucursalesDisponibles(tmp);
      setSucursales(["Todas"]);
    } else if (!sucursales.includes("Todas")) {
      setSelectedSucursal("");
      setSucursales([...sucursales, selectedValue]);
      setSucursalesDisponibles(
        sucursalesDisponibles.filter((sucural) => sucural !== selectedValue)
      );
    }
  }

  function handleRemoveSucursal(e) {
    let sucursalAEliminar = e.target.name;
    setSucursales(
      sucursales.filter((sucural) => sucural !== sucursalAEliminar)
    );
    let tmp = sucursalesDisponibles;
    tmp.push(sucursalAEliminar);
    setSucursalesDisponibles(tmp);
  }

  return (
    <div className="container">
      <div className="card-rounded p-3">
        <div className="row g-4">
          <div className="col-12 col-xl-6">
            <h2 className="mb-4">Premios</h2>

            <div className="mb-3">
              <label className="form-label">Nombre(*)</label>
              <input
                className="form-control"
                type="text"
                maxLength="50"
                placeholder="Ej: Descuento 50% en pizza"
                value={nombrePremio}
                onChange={(e) => setNombrePremio(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Descripción(*)</label>
              <textarea
                className="form-control"
                maxLength="500"
                placeholder="Describe el premio..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            <div className="mb-3 d-flex align-items-center">
              <label className="me-3">Sellos requeridos:</label>
              <input
                type="number"
                min="2"
                max="15"
                className="form-control"
                style={{ maxWidth: "100px" }}
                value={sellosRequeridos}
                onChange={(e) =>
                  setSellosRequeridos(parseInt(e.target.value) || 2)
                }
              />
              <span className="ms-2 text-muted">(2-15)</span>
            </div>

            <div className="mb-3">
              <label className="form-label">Días</label>
              <div className="d-flex flex-wrap gap-2">
                <CheckInput dia="L" name="0" evento={handleChangeDays} />
                <CheckInput dia="M" name="1" evento={handleChangeDays} />
                <CheckInput dia="X" name="2" evento={handleChangeDays} />
                <CheckInput dia="J" name="3" evento={handleChangeDays} />
                <CheckInput dia="V" name="4" evento={handleChangeDays} />
                <CheckInput dia="S" name="5" evento={handleChangeDays} />
                <CheckInput dia="D" name="6" evento={handleChangeDays} />
              </div>
            </div>

            <div className="mb-3 d-flex flex-wrap gap-3">
              <div>
                <label>
                  <input
                    type="checkbox"
                    className="me-2"
                    checked={habilitarFechaInicio}
                    onChange={() =>
                      setHabilitarFechaInicio(!habilitarFechaInicio)
                    }
                  />
                  Fecha de Inicio</label>
                <input
                  type="date"
                  className="form-control mt-1"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  disabled={!habilitarFechaInicio}
                />
              </div>

              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={habilitarFechaFin}
                    className="me-2"
                    onChange={() => setHabilitarFechaFin(!habilitarFechaFin)}
                  />
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  className="form-control mt-1"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  disabled={!habilitarFechaFin}
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Sucursales</label>
              <select
                className="form-control"
                value={selectedSucursal}
                onChange={handleSelectSucursal}
              >
                <option value="" disabled>
                  Seleccione una sucursal
                </option>
                {sucursalesDisponibles?.map((s, i) => (
                  <option key={i} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="mt-2 border p-2">
                {sucursales?.map((s, i) => (
                  <span
                    key={i}
                    className="badge bg-light text-dark me-2 mb-2"
                    style={{ fontSize: "14px" }}
                  >
                    {s}
                    <button
                      name={s}
                      type="button"
                      className="btn btn-sm btn-danger ms-2"
                      onClick={handleRemoveSucursal}
                    >
                      X
                    </button>
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
                />
              </div>
              <div className="col-12 col-md-4 mt-2 mt-md-0">
                <button
                  className="btn btn-danger w-100"
                  onClick={() => {
                    setUrlImagen(null);
                    setImagenPremio(null);
                  }}
                  disabled={created}
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
                <button
                  className="btn btn-success"
                  style={{ minWidth: "170px" }}
                  onClick={handleSubmit}
                  disabled={created}
                >
                  Crear Premio
                </button>
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

      {
        isLoading ?
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Body style={{ alignSelf: "center" }} >
              {
                <div className="spinner-border mt-4 mr-4" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              }
            </Modal.Body>
          </Modal>
          :
          <Modal show={showModal} onHide={() => { setShowModal(false); setIsConfirmation(false); setCreated(false); }}>
            <Modal.Header closeButton>
              <Modal.Title>{isConfirmation ? "Confirmación" : created ? "Aviso" : "Error"}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ alignSelf: "center" }}>{message}</Modal.Body>
            <Modal.Footer>
              {!created ?
                isConfirmation ?
                  <>
                    <Button variant="secondary" onClick={() => { setShowModal(false); setIsConfirmation(false) }}>Cancelar</Button>
                    <Button variant="success" onClick={handleSubmit}>Confirmar</Button>
                  </>
                  :
                  <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
                :
                <Button variant="secondary" onClick={() => { navigate("/beneficios/verbeneficios"); }}>Cerrar</Button>
              }
            </Modal.Footer>
          </Modal>
      }
    </div >
  );
} 