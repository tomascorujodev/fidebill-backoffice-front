import { useEffect, useState } from "react";
import { GET, POSTFormData } from "../Services/Fetch";
import { Modal, Button } from "react-bootstrap";
import CheckInput from "../Components/CheckInput";

export default function ViewBeneficios() {
  const [isLoading, setIsLoading] = useState(false);
  const [tipo, setTipo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dias, setDias] = useState([false, false, false, false, false, false, false]);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [habilitarFechaInicio, setHabilitarFechaInicio] = useState(true);
  const [habilitarFechaFin, setHabilitarFechaFin] = useState(true);
  const [imagenPromocion, setImagenPromocion] = useState(null);
  const [urlImagen, setUrlImagen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [porcentajeReintegro, setPorcentajeReintegro] = useState(3);
  const [sucursales, setSucursales] = useState(["Todas"]);
  const [sucursalesDisponibles, setSucursalesDisponibles] = useState([]);
  const [selectedSucursal, setSelectedSucursal] = useState(""); // Estado para el valor del select


  useEffect(() => {
    async function cargaInicial() {
      let locales = await GET("promociones/obtenerlocales");
      if (locales) {
        locales = await locales.json();
        let tmp = [];
        locales.map(local => {
          tmp.push(local.direccionLocal);
        })
        setSucursalesDisponibles(tmp);
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
    setIsLoading(true);

    if (tipo === "Reintegro de puntos" && porcentajeReintegro <= 3) {
      setMessage("El porcentaje de reintegro debe ser mayor al 3%");
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    if (fechaInicio && new Date(fechaInicio) < new Date()) {
      setMessage("La fecha de inicio no puede ser menor a la actual");
      setShowModal(true);
      setIsLoading(false);
      return;
    }

    try {
      let response = await POSTFormData("promociones/subirpromocion", imagenPromocion, { Tipo: tipo, Descripcion: descripcion, Dias: dias, PorcentajeReintegro: porcentajeReintegro, FechaInicio: fechaInicio, FechaFin: fechaFin, Sucursales: sucursales });
      setMessage("La promoción se cargó correctamente");
      setShowModal(true);
    } catch {
      setMessage("Hubo un problema al agregar la promoción.");
      setShowModal(true);
    }
    setIsLoading(false);
  }

  function handleUploadImage(e) {
    let archivo = e.target.files[0];
    if (archivo && ["image/jpeg", "image/png", "image/svg+xml"].includes(archivo.type)) {
      setImagenPromocion(archivo);
      setUrlImagen(URL.createObjectURL(archivo));
    } else {
      setMessage("El formato de archivo no es compatible");
      setShowModal(true);
    }
  }

  function handleSelectSucursal(e) {
    let selectedValue = e.target.value;
    if (selectedValue == "Todas") {
      let tmp = sucursales;
      sucursalesDisponibles.map(sucursalDisponible => {
        if (sucursalDisponible !== "Todas")
          tmp.push(sucursalDisponible);
      })
      setSucursalesDisponibles(tmp);
      setSucursales(["Todas"]);
    } else if (!sucursales.includes("Todas")) {
      setSelectedSucursal("");
      setSucursales([...sucursales, selectedValue]);
      setSucursalesDisponibles(sucursalesDisponibles.filter((sucural) => sucural !== selectedValue));
    } else {

    }
  }

  function handleRemoveSucursal(e) {
    let sucursalAEliminar = e.target.name;
    setSucursales(sucursales.filter((sucural) => sucural !== sucursalAEliminar));
    let tmp = sucursalesDisponibles;
    tmp.push(sucursalAEliminar)
    setSucursalesDisponibles(tmp);
  }

  return (
    <div className="container">
      <form className="card p-4 mb-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gridTemplateRows: "80px 100px 80px 100px 150px 80px" }} onSubmit={handleSubmit}>
        <h2 style={{ gridColumn: "1", gridRow: "1" }}>Beneficios</h2>
        <h3 style={{ gridColumn: "1", gridRow: "2" }}>Tipo(*)</h3>
        <h3 style={{ gridColumn: "1", gridRow: "3" }}>Descripcion(*)</h3>
        <h3 style={{ gridColumn: "1", gridRow: "4" }}>Fecha</h3>
        <h3 style={{ gridColumn: "1", gridRow: "5" }}>Sucursales</h3>
        <h3 style={{ gridColumn: "1", gridRow: "6" }}>Imagen</h3>
        <select style={{ gridColumn: "2", gridRow: "2", display: "flex", height: "40px" }} className="form-control" id="Tipo" value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="">Selecciona una opción</option>
          <option value="Reintegro de puntos">Reintegro de puntos</option>
          <option value="Promocion">Promoción</option>
        </select>
        {tipo === "Reintegro de puntos" &&
          <span style={{ gridColumn: "3", gridRow: "2", display: "flex", height: "40px", width: "80px", alignItems: "center" }} className="d-flex flex-row align-content-center">
            <span style={{ marginInline: "8px" }}>%</span>
            <input style={{ width: "70px" }} type="number" min="3" max="100" className="form-control" id="PorcentajeReintegro" value={porcentajeReintegro} onChange={e => setPorcentajeReintegro(e.target.value)} />
          </span>

        }
        <div style={{ gridColumn: "2 / 5", gridRow: "3" }} className="mb-3">
          <textarea style={{ maxHeight: "95px" }} className="form-control" id="Descripcion" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
        </div>
        <div style={{ gridColumn: "2 / 4", gridRow: "4" }} className="mb-3 d-flex align-content-center">
          <div>
            <label htmlFor="CheckFechaInicio" className="pe-4">Fecha de Inicio</label>
            <input type="checkbox" id="CheckFechaInicio" checked={habilitarFechaInicio} onChange={() => setHabilitarFechaInicio(!habilitarFechaInicio)} />
            <input type="date" className="form-control" id="FechaInicio" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} disabled={!habilitarFechaInicio} />
          </div>
          <div className="d-flex p-3 mt-3">
            -
          </div>
          <div>
            <label htmlFor="CheckFechaFin" className="pe-4">Fecha de Fin</label>
            <input type="checkbox" checked={habilitarFechaFin} onChange={() => setHabilitarFechaFin(!habilitarFechaFin)} />
            <input type="date" id="CheckFechaFin" className="form-control" value={fechaFin} onChange={e => setFechaFin(e.target.value)} disabled={!habilitarFechaFin} />
          </div>
        </div>
        <div style={{ gridColumn: "2 / 5", gridRow: "5", maxHeight: "150px" }} className="mb-3">
          <select className="form-control" id="Sucursales" value={selectedSucursal} onChange={handleSelectSucursal}>
            <option value=""></option>
            {sucursalesDisponibles.map((sucursal, index) => (
              <option key={index} value={sucursal}>
                {sucursal}
              </option>
            ))}
          </select>
          <div className="mt-2 border p-2" style={{ minHeight: "50px" }}>
            {sucursales.map((sucursal, index) => (
              <span key={index} style={{fontSize: "14px"}} className="badge bg-light text-dark me-2 mb-2">
                {sucursal} <button name={sucursal} type="button" style={{ background: "transparent", border: "none", color: "#e06971", fontSize: "20px"}} onMouseEnter={(e) => e.target.style.color = "#ff0000"}
                  onMouseLeave={(e) => e.target.style.color = "#dc3545"} className="btn btn-sm btn-danger ms-2" onClick={(e) => handleRemoveSucursal(e)}>X</button>
              </span>
            ))}
          </div>
        </div>
        <div style={{ gridColumn: "2 / 4", gridRow: "6" }} className="mb-3">
          <input type="file" className="form-control" accept="image/png, image/jpeg, image/svg+xml" onChange={handleUploadImage} />
          {imagenPromocion && <img src={urlImagen} alt="Imagen Promocional" width="200" />}
        </div>
        {isLoading ? <div style={{ gridColumn: "4 / 5", gridRow: "7" }} className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div> : <button style={{ gridColumn: "3 / 5", gridRow: "7", justifySelf: "self-end", width: "150px", height: "60px" }} type="submit" className="btn btn-success mt-3">Subir Promocion</button>}
      </form>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmación</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
