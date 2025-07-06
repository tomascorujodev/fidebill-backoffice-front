import { useEffect, useState } from "react";
import { GET, POSTFormData } from "../services/Fetch";
import { Modal, Button } from "react-bootstrap";
import CheckInput from "../components/CheckInput";
import jwtDecode from "../utils/jwtDecode";
import { useNavigate } from "react-router-dom";

export default function ViewCatalogo() {
  const [isLoading, setIsLoading] = useState(false);
  const [nombreProducto, setNombreProducto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precioPuntos, setPrecioPuntos] = useState(100);
  const [stock, setStock] = useState(1);
  const [dias, setDias] = useState([false, false, false, false, false, false, false]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [habilitarFechaInicio, setHabilitarFechaInicio] = useState(true);
  const [habilitarFechaFin, setHabilitarFechaFin] = useState(true);
  const [imagenProducto, setImagenProducto] = useState(null);
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
        locales = await locales.json();
        setSucursalesConId(locales);
        let tmp = [];
        locales.map((local) => {
          tmp.push(local.direccionLocal);
        });
        setSucursalesDisponibles(tmp);
      } else {
        if (navigator.onLine) {
          setMessage(
            "El servidor no responde. Por favor vuelva a intentarlo en unos minutos. Si el problema persiste contáctese con un administrador"
          );
        } else {
          setMessage("Se perdio la conexion a internet");
        }
        setShowModal(true);
      }
    }
    cargaInicial();
  }, []);

  function handleChangeDays(e) {
    const newDias = [...dias];
    newDias[e.target.name] = e.target.checked;
    setDias(newDias);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!nombreProducto.trim()) {
      setMessage("El nombre del producto es obligatorio");
      setShowModal(true);
      return;
    }

    if (!descripcion.trim()) {
      setMessage("La descripción del producto es obligatoria");
      setShowModal(true);
      return;
    }

    if (precioPuntos < 1) {
      setMessage("El precio en puntos debe ser mayor a 0");
      setShowModal(true);
      return;
    }

    if (stock < 1) {
      setMessage("El stock debe ser mayor a 0");
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
      setMessage("Está a punto de crear un producto visible para sus clientes. Los clientes podrán canjear este producto por puntos. ¿Desea publicar?");
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

      // Aquí iría la llamada al endpoint cuando esté disponible
      // let response = await POSTFormData(
      //   "catalogo/crearproducto",
      //   imagenProducto,
      //   {
      //     Nombre: nombreProducto,
      //     Descripcion: descripcion,
      //     PrecioPuntos: precioPuntos,
      //     Stock: stock,
      //     Dias: dias,
      //     FechaInicio: habilitarFechaInicio ? fechaInicio : null,
      //     FechaFin: habilitarFechaFin ? fechaFin : null,
      //     Sucursales: tmp,
      //   }
      // );

      // Simulación de respuesta exitosa por ahora
      setTimeout(() => {
        setMessage("El producto se ha creado correctamente.");
        setCreated(true);
        setShowModal(true);
        setIsLoading(false);
      }, 1000);

      // Código comentado para cuando esté el endpoint
      // if (response) {
      //   switch (response.status) {
      //     case 200:
      //       setMessage("El producto se ha creado correctamente.");
      //       setCreated(true);
      //       break;
      //     case 400:
      //       setMessage(
      //         "Verifique que todos los campos sean correctos y vuelva a intentarlo"
      //       );
      //       break;
      //     case 401:
      //       navigate("/")
      //       break;
      //     case 500:
      //       setMessage(
      //         "No se pudo procesar su petición. Por favor, contacte con un administrador"
      //       );
      //       break;
      //     default:
      //       response = await response.json();
      //       setMessage(response.message);
      //       break;
      //   }
      // } else {
      //   if (navigator.onLine) {
      //     setMessage(
      //       "El servidor no responde. Por favor vuelva a intentarlo en unos minutos. Si el problema persiste contáctese con un administrador"
      //     );
      //   } else {
      //     setMessage("Se perdio la conexion a internet");
      //   }
      // }
      // setShowModal(true);
    } catch {
      setMessage(
        "¡ups! Hubo un error al intentar procesar su peticion. Por favor intentelo nuevamente, y si el error persiste, contacte con un administrador."
      );
      setShowModal(true);
      setIsLoading(false);
    }
    setIsLoading(false);
  }

  function handleUploadImage(e) {
    let archivo = e.target.files[0];
    if (archivo && ["image/jpeg", "image/png", "image/svg+xml"].includes(archivo.type)) {
      if (archivo.size <= 1048576) {
        setImagenProducto(archivo);
        setUrlImagen(URL.createObjectURL(archivo));
      } else {
        setMessage("La imagen excede el tamaño máximo permitido de 1MB");
        setShowModal(true);
        setImagenProducto(null);
        setUrlImagen(null);
        e.target.value = null;
      }
    } else {
      setMessage("El formato de archivo no es compatible");
      setShowModal(true);
      setUrlImagen(null);
      setImagenProducto(null);
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
          gridTemplateColumns: "250px 1fr 1fr 1fr 1fr 1fr",
          gridTemplateRows: "90px 90px 110px 90px 110px 90px 90px 170px 90px",
          gap: "16px"
        }}
      >
        <h2 style={{ gridColumn: "1", gridRow: "1", paddingRight: "16px" }}>Catálogo</h2>
        <h4 style={{ gridColumn: "1", gridRow: "2", paddingRight: "16px" }}>Nombre(*)</h4>
        <h4 style={{ gridColumn: "1", gridRow: "3", paddingRight: "16px" }}>Descripción(*)</h4>
        <h4 style={{ gridColumn: "1", gridRow: "4", paddingRight: "16px" }}>Precios</h4>
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
            📌 Los clientes podrán canjear este producto por {precioPuntos} puntos.
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
          placeholder="Ej: Pizza Margherita Grande"
          value={nombreProducto}
          onChange={(e) => setNombreProducto(e.target.value)}
        />

        <div style={{ gridColumn: "2 / 4", gridRow: "3", paddingRight: "16px" }} className="mb-3">
          <textarea
            style={{ maxHeight: "95px" }}
            className="form-control"
            maxLength="500"
            placeholder="Describe el producto, sus características, ingredientes..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div style={{ gridColumn: "2 / 4", gridRow: "4", paddingRight: "16px" }} className="mb-3">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="precioPuntos" className="form-label">
                Puntos:
              </label>
              <input
                type="number"
                min="1"
                max="10000"
                className="form-control"
                id="precioPuntos"
                value={precioPuntos}
                onChange={(e) => setPrecioPuntos(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="stock" className="form-label">
                Stock disponible:
              </label>
              <input
                type="number"
                min="1"
                max="1000"
                className="form-control"
                id="stock"
                value={stock}
                onChange={(e) => setStock(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
        </div>

        <div style={{ gridColumn: "2 / 4", gridRow: "5", paddingRight: "16px" }} className="mb-3">
          <div className="mb-3">
            <label className="form-label">Días disponibles:</label>
            <div className="d-flex gap-2">
              <CheckInput dia={"L"} name={"0"} evento={handleChangeDays} />
              <CheckInput dia={"M"} name={"1"} evento={handleChangeDays} />
              <CheckInput dia={"X"} name={"2"} evento={handleChangeDays} />
              <CheckInput dia={"J"} name={"3"} evento={handleChangeDays} />
              <CheckInput dia={"V"} name={"4"} evento={handleChangeDays} />
              <CheckInput dia={"S"} name={"5"} evento={handleChangeDays} />
              <CheckInput dia={"D"} name={"6"} evento={handleChangeDays} />
            </div>
          </div>
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
          style={{ gridColumn: "2 / 4", gridRow: "7", maxHeight: "150px", paddingRight: "16px" }}
          className="mb-3"
        >
          <select
            className="form-control"
            id="Sucursales"
            value={selectedSucursal}
            onChange={handleSelectSucursal}
          >
            <option value="" disabled>
              Seleccione una sucursal
            </option>
            {sucursalesDisponibles.map((sucursal, index) => (
              <option key={index} value={sucursal}>
                {sucursal}
              </option>
            ))}
          </select>
          <div className="mt-2 border p-2" style={{ minHeight: "50px" }}>
            {sucursales.map((sucursal, index) => (
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

        <div style={{ gridColumn: "3 / 4", gridRow: "8" }} className="mb-3 mx-4">
          <button className="btn btn-danger" onClick={() => { setUrlImagen(null); setImagenProducto(null) }} disabled={created}>Eliminar imagen</button>
        </div>

        {/* Vista previa del producto */}
        <div style={{ gridColumn: "5", gridRow: "2 / 7" }} className="mb-3">
          <div className="card border-0 shadow-sm" style={{ maxWidth: "300px" }}>
            {urlImagen && (
              <img 
                src={urlImagen} 
                className="card-img-top" 
                alt="Producto"
                style={{ height: "150px", objectFit: "cover" }}
              />
            )}
            <div className="card-body">
              <h5 className="card-title">{nombreProducto || "Nombre del Producto"}</h5>
              <p className="card-text small">{descripcion || "Descripción del producto"}</p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="badge bg-primary">
                  {precioPuntos} puntos
                </span>
              </div>
              <div className="mt-2">
                <small className="text-muted">
                  Stock: {stock} unidades
                </small>
              </div>
            </div>
          </div>
        </div>

        <div
          className="d-flex aling-content-center justify-content-center"
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
                    gridColumn: "6",
                    gridRow: "9",
                    width: "170px",
                    height: "40px",
                  }}
                  className="btn btn-success mt-1"
                  onClick={handleSubmit}
                  disabled={created}
                >
                  Crear Producto
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
          <Modal show={showModal} onHide={() => { setShowModal(false); setIsConfirmation(false) }}>
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
                <Button variant="secondary" onClick={() => {navigate("/catalogo");}}>Cerrar</Button>
              }
            </Modal.Footer>
          </Modal>
      }
    </div>
  );
} 