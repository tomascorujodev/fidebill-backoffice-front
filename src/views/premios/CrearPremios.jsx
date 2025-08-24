import { useEffect, useState, useReducer } from "react";
import { GET, POSTFormData } from "../../services/Fetch.js";
import { Modal, Button } from "react-bootstrap";
import CheckInput from "../../components/CheckInput.jsx";
import jwtDecode from "../../utils/jwtDecode.jsx";
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

    if (sellosRequeridos < 1 || sellosRequeridos > 50) {
      setMessage("Los sellos requeridos deben estar entre 1 y 50");
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
      <div
        className="card-rounded"
        style={{
          display: "grid",
          gridTemplateColumns: "200px 1.5fr 0.6fr 20px 1fr 1fr",
          gridTemplateRows: "90px 80px 90px 100px 80px 100px 150px 100px 100px 100px",
          gap: "28px"
        }}
      >
        <h2 style={{ gridColumn: "1", gridRow: "1", paddingRight: "16px" }}>Premios</h2>
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
            borderLeft: "2px solid #e0e0e0",
            height: "auto",
            alignSelf: "stretch",
            justifySelf: "center",
          }}
        ></div>

        <div style={{ gridColumn: "5 / 7", gridRow: "2", alignSelf: "start", paddingLeft: "20px", paddingBottom: "24px" }}>
          <h4 style={{ color: "#333", marginBottom: "16px", fontSize: "20px" }}>Vista Previa</h4>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "18px", lineHeight: "1.4" }}>
            📌 Los clientes podrán canjear este premio al acumular <strong>{sellosRequeridos}</strong> sellos.
          </p>
          <p style={{ color: "#666", fontSize: "13px", marginBottom: "24px", lineHeight: "1.4" }}>
            💡 Recomendación: Para una mejor visualización, suba imágenes con una relación de aspecto 4:3 (Ejemplo: 1200x900, 800x600, 400x300).
          </p>
        </div>

        <input
          style={{
            gridColumn: "2 / 4",
            gridRow: "2",
            display: "flex",
            height: "40px",
          }}
          className="form-control"
          type="text"
          maxLength="100"
          placeholder="Ej: Descuento 50% en pizza"
          value={nombrePremio}
          onChange={(e) => setNombrePremio(e.target.value)}
        />

        <div style={{ gridColumn: "2 / 4", gridRow: "3", paddingRight: "16px" }} className="mb-3">
          <textarea
            style={{ maxHeight: "95px" }}
            className="form-control"
            maxLength="500"
            placeholder="Describe el premio que recibirán los clientes..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div style={{ gridColumn: "2 / 4", gridRow: "4", paddingRight: "16px" }} className="mb-3 d-flex align-items-center">
          <label htmlFor="sellosRequeridos" className="me-3">
            Sellos requeridos:
          </label>
          <input
            type="number"
            min="1"
            max="50"
            className="form-control"
            style={{ width: "100px" }}
            id="sellosRequeridos"
            value={sellosRequeridos}
            onChange={(e) => setSellosRequeridos(parseInt(e.target.value) || 1)}
          />
          <span className="ms-2 text-muted">(1-50)</span>
        </div>

        <div style={{ gridColumn: "2 / 5", gridRow: "5", paddingRight: "16px" }}>
          <CheckInput dia={"L"} name={"0"} evento={handleChangeDays} />
          <CheckInput dia={"M"} name={"1"} evento={handleChangeDays} />
          <CheckInput dia={"X"} name={"2"} evento={handleChangeDays} />
          <CheckInput dia={"J"} name={"3"} evento={handleChangeDays} />
          <CheckInput dia={"V"} name={"4"} evento={handleChangeDays} />
          <CheckInput dia={"S"} name={"5"} evento={handleChangeDays} />
          <CheckInput dia={"D"} name={"6"} evento={handleChangeDays} />
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
            />
            <input
              type="date"
              className="form-control"
              id="FechaInicio"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              disabled={!habilitarFechaInicio}
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
            />
            <input
              type="date"
              className="form-control"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              disabled={!habilitarFechaFin}
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
            onChange={handleSelectSucursal} car
          >
            <option value="" disabled>
              Seleccione una sucursal
            </option>
            {sucursalesDisponibles && sucursalesDisponibles.map((sucursal, index) => (
              <option key={index} value={sucursal}>
                {sucursal}
              </option>
            ))}
          </select>
          <div className="mt-2 border p-2" style={{ minHeight: "50px" }}>
            {sucursales &&
              sucursales?.map((sucursal, index) => (
                <span
                  key={index}
                  style={{ fontSize: "14px" }}
                  className="badge bg-light text-dark me-2 mb-2"
                >
                  {sucursal}{" "}
                  <button
                    name={sucursal}
                    type="button"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#e06971",
                      fontSize: "20px",
                    }}
                    onMouseEnter={(e) => (e.target.style.color = "#ff0000")}
                    onMouseLeave={(e) => (e.target.style.color = "#dc3545")}
                    className="btn btn-sm btn-danger ms-2"
                    onClick={(e) => handleRemoveSucursal(e)}
                  >
                    X
                  </button>
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
          />
        </div>

        <div style={{ gridColumn: "3 / 4", gridRow: "8" }}>
          <button className="btn btn-danger" onClick={() => { setUrlImagen(null); setImagenPremio(null) }} disabled={created}>Eliminar imagen</button>
        </div>
        <div style={{
          gridColumn: "5 / 7",
          gridRow: "3 / 6",
          paddingLeft: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: "70px"
        }}>
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

        <div
          className="d-flex aling-content-center justify-content-end"
          style={{ gridColumn: "3", gridRow: "9" }}
        >
          {
            isLoading ?
              <div className="spinner-border mt-4 mr-4" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              :
              <button
                style={{
                  width: "170px",
                  height: "40px",
                }}
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={created}
              >
                Crear Premio
              </button>
          }
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
    </div>
  );
} 