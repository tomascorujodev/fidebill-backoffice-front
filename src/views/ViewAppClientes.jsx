import { useEffect, useState } from "react";
import { GET, PATCH, POSTFormData } from "../services/Fetch";
import { Modal, Button } from "react-bootstrap";
import Carousel from "../components/Carousel";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { useNavigate } from "react-router-dom";
import { hexToHsv } from "../utils/hexToHsv.js"
import { hexToRgba } from "../utils/hexToRgba.js";

export default function ViewAppClientes() {
  const [action, setAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imagenes, setImagenes] = useState({ imagen1: "", imagen2: "", imagen3: "" });
  const [urlImagenes, seturlImagenes] = useState({ urlImagen1: null, urlImagen2: null, urlImagen3: null });
  const [message, setMessage] = useState("");
  const [color, setColor] = useColor("#00000000");
  const [newColorSent, setNewColorSent] = useState(false);
  const [newImageSent, setNewImageSent] = useState({ imagen1: false, imagen2: false, imagen3: false });
  const navigate = useNavigate();

  useEffect(() => {
    async function obtenerConfiguracion() {
      let result = await GET("ConfiguracionApp/getconfiguracion")
      if (!result) {
        if (navigator.onLine) {
          setMessage("Ha ocurrido un problema. Por favor, espere unos instantes y vuelva a intentarlo")
        } else {
          setMessage("Ups... no hay conexion a internet. Verifique la red y vuelva a intentarlo.")
        }
        setIsLoading(false);
        setShowModal(true);
        return;
      }
      switch (result.status) {
        case 200:
          result = await result.json();
          setMessage("");
          setColor({ hex: result.colorPrincipal, hsv: hexToHsv(result.colorPrincipal), rgb: hexToRgba(result.colorPrincipal) });
          seturlImagenes({ urlImagen1: result.imagen1, urlImagen2: result.imagen2, urlImagen3: result.imagen3 });
          return;
        case 204:
          setMessage("La empresa aun no tiene creados sus estilos. Contacte con un administrador para mas información.");
          setAction(() => () => { navigate("/ayuda") });
          break;
        case 401:
          localStorage.clear();
          setMessage("Ups... parece que tus credenciales expiraron. Por favor, inicie sesion nuevamente");
          setTimeout(() => {
            window.location.replace(`/${empresa}`)
          }, 4000)
          break;
        case 500:
          setMessage("Ha ocurrido un problema en el servidor. Aguardenos unos minutos y vuelva a intentarlo");
          break;
        default:
          setMessage("Ha ocurrido un problema en el servidor. Aguardenos unos minutos y vuelva a intentarlo");
          break;
      }
      setShowModal(true);
      setIsLoading(false);
    }
    obtenerConfiguracion();
  }, [])

  async function uploadImage(e) {
    let name = e.target.name;

    try {
      if (!["image/jpeg", "image/png", "image/svg+xml"].includes(imagenes[name].type)) {
        setMessage("El formato de archivo no es compatible");
        setShowModal(true);
        e.target.value = "";
        return;
      }

      if (imagenes[name].size >= 1048576) {
        setMessage("La imagen excede el tamaño máximo permitido de 1MB");
        setShowModal(true);
        e.target.value = "";
        return;
      }

      setIsLoading(true);

      let keys = Object.keys(imagenes);
      let index = keys.indexOf(name) + 1;
      console.log(imagenes[name])
      let response = await POSTFormData("ConfiguracionApp/cargarimagencarrousel", imagenes[name], { NumeroImagen: index });

      if (response) {
        switch (response.status) {
          case 200:
            setMessage(`La imagen ${index} se guardo correctamente`);
            setNewImageSent(
              (prev) => ({
                ...prev,
                [name]: true,
              })
            );
            break;
          case 401:
            setMessage("Su sesion expiro. Por favor, vuelva a iniciar sesion");
            break;
          case 422:
            setMessage("El formato de imagen es invalido");
            break;
          default:
            setMessage("Ha ocurrido un error. Si el problema persiste, por favor, contacte con un administrador");
            break;
        }
      } else {
        if (navigator.onLine) {
          setMessage("El servidor no responde. Por favor, vuelva a intentarlo en unos minutos. Si el problema persiste contacte con un administrador");
        } else {
          setMessage("Hubo un problema al cargar la imagen. Por favor, verifique la conexión y vuelva a intentarlo.");
        }
      }
    } catch {
      setMessage("Hubo un problema al agregar la imagen. Por favor, vuelva a intentarlo en unos minutos. Si el problema persiste contacte con un administrador");
      setShowModal(true);
      setIsLoading(false);
    }
    setShowModal(true);
    setIsLoading(false);
  }



  function cargarImagen(e) {
    let archivo = e.target.files[0];
    let name = e.target.name;

    if (!archivo) return;

    if (!["image/jpeg", "image/png", "image/svg+xml"].includes(archivo.type)) {
      setMessage("El formato de archivo no es compatible");
      setShowModal(true);
      e.target.value = "";
    }

    if (archivo.size >= 1048576) {
      setMessage("La imagen excede el tamaño máximo permitido de 1MB");
      setShowModal(true);
      e.target.value = "";
      return;
    }

    let keyMap = {
      imagen1: "urlImagen1",
      imagen2: "urlImagen2",
      imagen3: "urlImagen3"
    };

    if (keyMap[name]) {
      seturlImagenes((prev) => ({
        ...prev,
        [keyMap[name]]: URL.createObjectURL(archivo),
      }));

      setImagenes((prev) => ({
        ...prev,
        [name]: archivo,
      }));
    }
  }

  function Spinner() {
    return (
      <div
        style={{ justifySelf: "end" }}
        className="d-flex spinner-border"
        role="status"
      >
        <span className="visually-hidden">Cargando...</span>
      </div>
    );
  }

  async function submitNewColor() {
    setIsLoading(true);
    try {
      let response = await PATCH("ConfiguracionApp/modificarcolorprincipal", color.hex);
      if (response) {
        switch (response.status) {
          case 200:
            setNewColorSent(true);
            break;
          case 401:
            setMessage("Su sesion expiro. Por favor, vuelva a iniciar sesion");
            setShowModal(true);
            break;
          case 422:
            setMessage("El formato enviado es incorrecto");
            setShowModal(true);
            break;
          default:
            response = await response.json();
            setMessage(response.message);
            setShowModal(true);
            break;
        }
      } else {
        if (navigator.onLine) {
          setMessage("El servidor no responde. Por favor, vuelva a intentarlo en unos minutos. Si el problema persiste contacte con un administrador");
        } else {
          setMessage("Hubo un problema al agregar cliente. Por favor, verifique la conexión y vuelva a intentarlo.");
        }
      }
    } catch {
      setMessage("Hubo un problema al agregar cliente. Por favor, contacte con un administrador.");
      setShowModal(true);
      setIsLoading(false);
    }
    setIsLoading(false);
  }


  return (
    <div className="container">
      <div className="card-rounded">
        <h2 className="mb-4">Configuracion</h2>
        <div className="mb-3">
          <h3 htmlFor="Carrousel" className="form-label">
            Carrusel de imagenes
          </h3>
          <hr className="m-2"></hr>
          <div>
            <label htmlFor="imagen1" className="ms-1 fs-4 form-label">
              Imagen 1
            </label>
            <input type="file" name="imagen1" id="imagen1" className="form-control mb-2" accept="image/png, image/jpeg, image/svg+xml" onChange={cargarImagen} />
            {
              newImageSent.imagen1 ?
                <div className="d-flex justify-content-end flex-wrap">
                  La imagen 1 se ha subido con exito!
                </div>
                :
                isLoading ?
                  <Spinner />
                  :
                  <div className="d-flex justify-content-between mb-3">
                    <button className="btn btn-danger p-1 me-3 mt-2">
                      Eliminar imagen
                    </button>
                    <button name="imagen1" className="btn btn-success p-1 me-3 mt-2" onClick={uploadImage}>
                      Subir imagen
                    </button>
                  </div>
            }
          </div>
          <hr className="m-2"></hr>
          <div>
            <label htmlFor="imagen2" className="ms-1 fs-4 form-label">
              Imagen 2
            </label>
            <input type="file" name="imagen2" id="imagen2" className="form-control" accept="image/png, image/jpeg, image/svg+xml" onChange={cargarImagen} />
            {
              newImageSent.imagen2 ?
                <div className="d-flex justify-content-end flex-wrap">
                  La imagen 2 se ha subido con exito!
                </div>
                :
                isLoading ?
                  <Spinner />
                  :
                  <div className="d-flex justify-content-between mb-3">
                    <button className="btn btn-danger p-1 me-3 mt-2">
                      Eliminar imagen
                    </button>
                    <button name="imagen2" className="btn btn-success p-1 me-3 mt-2" onClick={uploadImage}>
                      Subir imagen
                    </button>
                  </div>
            }
          </div>
          <hr className="m-2"></hr>
          <div>
            <label htmlFor="imagen3" className="ms-1 fs-4 form-label">
              Imagen 3
            </label>
            <input type="file" name="imagen3" id="imagen3" className="form-control" accept="image/png, image/jpeg, image/svg+xml" onChange={cargarImagen} />
            {
              newImageSent.imagen3 ?
                <div className="d-flex justify-content-end flex-wrap">
                  La imagen 3 se ha subido con exito!
                </div>
                :
                isLoading ?
                  <Spinner />
                  :
                  <div className="d-flex justify-content-between mb-3">
                    <button name="imagen3" className="btn btn-danger p-1 me-3 mt-2">
                      Eliminar imagen
                    </button>
                    <button name="imagen3" className="btn btn-success p-1 me-3 mt-2" onClick={uploadImage}>
                      Subir imagen
                    </button>
                  </div>
            }
          </div>
          <hr className="m-2"></hr>
        </div>
        <p style={{ color: "gray", fontSize: "12px" }}>
          📌 Recomendación: Para una mejor visualización, suba imágenes con
          una relación de aspecto 2:1 (Ejemplo: 800 × 400, 1000 × 500, 1200 × 600).
        </p>
        <Carousel imagen1={urlImagenes.urlImagen1} imagen2={urlImagenes.urlImagen2} imagen3={urlImagenes.urlImagen3} />
        <br/>
        <div className="mb-3">
          <h3 htmlFor="Nombre" className="form-label">
            Color Principal
          </h3>
          <div style={{width: "400px"}} className="custom-layout">
            <ColorPicker  hideInput={["rgb", "hsv"]}  color={color} onChange={setColor} />
          </div>
          {
            newColorSent ?
              <div className="d-flex justify-content-end flex-wrap">
                El color se ha cambiado con exito!
              </div>
              :
              isLoading ?
                <Spinner />
                :
                <div className="d-flex justify-content-end flex-wrap">
                  <button style={{ marginTop: "0px", marginBottom: "10px" }} className="btn btn-success mt-3 custom-button" onClick={submitNewColor}>
                    Guardar Estilo
                  </button>
                </div>
          }
        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header>
            <Modal.Title>Aviso</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowModal(false); action() }}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}


{/* <input
type="text"
className="form-control"
value={color}
onChange={(e) => setColor(e.target.value)}
style={{ marginRight: 10, width: "150px", height: "30px" }}
/>
<div
onClick={() => setShowPicker(!showPicker)}
style={{
  display: "inline-block",
  width: 30,
  height: 30,
  backgroundColor: color,
  border: "1px solid #ccc",
  cursor: "pointer",
  borderRadius: 8,
}}
/>
{showPicker && (
<div style={{ position: "relative", bottom: 200, zIndex: 2 }}>
  <button
    onClick={() => setShowPicker(false)}
    style={{
      right: -6,
      top: -5,
      position: "absolute",
      background: "transparent",
      border: "none",
      fontSize: "14px",
      cursor: "pointer",
      marginBottom: "-10px",
    }}
  >
    ✖
  </button>
  <SketchPicker
    color={color}
    onChange={(updatedColor) => setColor(updatedColor.hex)}
  />
</div>
)} */}