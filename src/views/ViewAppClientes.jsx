import React, { useEffect, useState } from "react";
import { DELETE, GET, PATCH, POSTFormData } from "../services/Fetch";
import { Modal, Button } from "react-bootstrap";
import Carousel from "../components/Carousel";
import "react-color-palette/css";
import { useNavigate } from "react-router-dom";
import { SketchPicker } from "react-color";

export default function ViewAppClientes() {
  const [action, setAction] = useState(() => () => { });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imagenes, setImagenes] = useState({ imagen1: "", imagen2: "", imagen3: "" });
  const [urlImagenes, seturlImagenes] = useState({ urlImagen1: null, urlImagen2: null, urlImagen3: null });
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("#00000000");
  const [showPicker, setShowPicker] = useState(false);
  const [newColorSent, setNewColorSent] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({ imagen1: false, imagen2: false, imagen3: false });
  const [newImageSent, setNewImageSent] = useState({ imagen1: false, imagen2: false, imagen3: false });
  const [redesSociales, setRedesSociales] = useState([]);
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
          setColor(result.colorPrincipal);
          seturlImagenes({ urlImagen1: result.imagen1, urlImagen2: result.imagen2, urlImagen3: result.imagen3 });
          setImageLoaded({ imagen1: !!result.imagen1, imagen2: !!result.imagen2, imagen3: !!result.imagen3 });
          setRedesSociales([
            { key: "Whatsapp", value: result?.whatsapp, try: "https://wa.me/" },
            { key: "Instagram", value: result?.instagram, try: `https://instagram.com/` },
            { key: "Facebook", value: result?.facebook, try: `https://www.facebook.com/` },
            { key: "Telefono", value: result?.telefono, try: `tel:` },
          ]);
          return;
        case 204:
          setMessage("La empresa aun no tiene creados sus estilos. Contacte con un administrador para mas información.");
          setAction(() => () => { navigate("/ayuda") });
          break;
        case 401:
          localStorage.clear();
          setMessage("Ups... parece que tus credenciales expiraron. Por favor, inicie sesion nuevamente");
          setTimeout(() => {
            window.location.replace("/admin");
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
      let response = await POSTFormData("ConfiguracionApp/cargarimagencarrousel", imagenes[name], { NumeroImagen: index });

      if (response) {
        switch (response.status) {
          case 200:
            setMessage(`La imagen ${index} se guardo correctamente`);
            setImageLoaded({ ...imageLoaded, [name]: true });
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
      let response = await PATCH("ConfiguracionApp/modificarcolorprincipal", color);
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

  async function deleteImage() {
    try {
      setIsLoading(true);
      setShowDeleteModal(false);
      let name = action.target.name;
      let response = await DELETE("ConfiguracionApp/eliminarimagencarrousel", { imagen: name });
      if (!response) {
        setMessage(CheckOnline());
        return;
      }
      switch (response.status) {
        case 200:
          setMessage(`La imagen ${name} se elimino correctamente`);
          setNewImageSent(
            (prev) => ({
              ...prev,
              ["imagen" + name]: false,
            })
          );
          setImageLoaded((prev) => ({
            ...prev,
            ["imagen" + name]: false,
          }));
          break;
        case 204:
          setMessage("La imagen ya ha sido eliminada");
          setImageLoaded((prev) => ({
            ...prev,
            ["imagen" + name]: false,
          }));
          break;
        case 401:
          setMessage("Su sesion expiro. Por favor, vuelva a iniciar sesion");
          break;
        default:
          setMessage("Ha ocurrido un error. Si el problema persiste, por favor, contacte con un administrador");
          break;
      }
    } catch {
      setMessage("Hubo un problema al agregar la imagen. Por favor, vuelva a intentarlo en unos minutos. Si el problema persiste contacte con un administrador");
    } finally {
      setAction(() => () => { });
      setShowModal(true);
      setIsLoading(false);
    }
  }

  async function saveSocialMedia(e) {
    try {
      setIsLoading(true);
      let name = e.target.name;
      let red = redesSociales.find(r => r.key === name);
      let response = await PATCH(`ConfiguracionApp/modificarcontacto`, { Contacto: name, Valor: red.value });
      if (!response) {
        setMessage(CheckOnline());
        return;
      }
      switch (response.status) {
        case 200:
          setMessage("El contacto se actualizo correctamente");
          break;
        case 204:
          setMessage("La imagen ya ha sido eliminada");
          break;
        case 401:
          setMessage("Su sesion expiro. Por favor, vuelva a iniciar sesion");
          break;
        default:
          setMessage("Ha ocurrido un error inesperado. Si el problema persiste, por favor, contacte con un administrador");
          break;
      }
    } catch {
      setMessage("Hubo un problema al intentar modificar los medios de contacto. Por favor, vuelva a intentarlo en unos minutos. Si el problema persiste contacte con un administrador.");
    } finally {
      setAction(() => () => { });
      setShowModal(true);
      setIsLoading(false);
    }
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
            <div className="d-flex">
              <label htmlFor="imagen1" className="ms-1 me-4 fs-4 form-label">
                Imagen 1
              </label>
              {imageLoaded.imagen1 && <img style={{ height: "30px" }} src="/assets/IconoOk.png" />}
            </div>
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
                    <button name="1" className={`btn btn-danger p-1 me-3 mt-2 ${!imageLoaded.imagen1 && "disabled"}`} onClick={(e) => { setShowDeleteModal(true); setMessage("¿Está seguro de que desea quitar la imagen 1 del carrusel?"); setAction(e); }}>
                      Eliminar imagen
                    </button>
                    <button name="imagen1" className={`btn btn-success me-3 mt-2 ${!imagenes.imagen1 && "disabled"}`} onClick={uploadImage}>
                      Subir imagen
                    </button>
                  </div>
            }
          </div>
          <hr className="m-2"></hr>
          <div>
            <div className="d-flex">
              <label htmlFor="imagen1" className="ms-1 me-4 fs-4 form-label">
                Imagen 2
              </label>
              {imageLoaded.imagen2 && <img style={{ height: "30px" }} src="/assets/IconoOk.png" />}
            </div>
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
                    <button name="2" className={`btn btn-danger p-1 me-3 mt-2 ${!imageLoaded.imagen2 && "disabled"}`} onClick={(e) => { setShowDeleteModal(true); setMessage("¿Está seguro de que desea quitar la imagen 2 del carrusel?"); setAction(e); }}>
                      Eliminar imagen
                    </button>
                    <button name="imagen2" className={`btn btn-success me-3 mt-2 ${!imagenes.imagen2 && "disabled"}`} onClick={uploadImage}>
                      Subir imagen
                    </button>
                  </div>
            }
          </div>
          <hr className="m-2"></hr>
          <div>
            <div className="d-flex">
              <label htmlFor="imagen1" className="ms-1 me-4 fs-4 form-label">
                Imagen 3
              </label>
              {imageLoaded.imagen3 && <img style={{ height: "30px" }} src="/assets/IconoOk.png" />}
            </div>
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
                    <button name="imagen3" className={`btn btn-danger p-1 me-3 mt-2 ${!imageLoaded.imagen3 && "disabled"}`} onClick={(e) => { setShowDeleteModal(true); setMessage("¿Está seguro de que desea quitar la imagen 3 del carrusel?"); setAction(e); }}>
                      Eliminar imagen
                    </button>
                    <button name="imagen3" className={`btn btn-success me-3 mt-2 ${!imagenes.imagen3 && "disabled"}`} onClick={uploadImage}>
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
        <br />
        <div className="mb-2 d-flex flex-column">
          <h3 htmlFor="Nombre" className="form-label">
            Color Principal
          </h3>
          <div className="d-flex flex-wrap align-items-center gap-2">
            <input
              type="text"
              className="form-control"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ marginRight: 10, width: "150px", height: "30px" }}
            />

            <button
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
            {
              showPicker &&
              <div style={{ position: "absolute", }}>
                <div style={{ position: "absolute", left: "200px", bottom: "-70px", zIndex: 1 }}>
                  <SketchPicker
                    color={color}
                    onChange={(updatedColor) => setColor(updatedColor.hex)}
                  />
                </div>
              </div>
            }
            <div className="d-flex ms-4">
              {
                newColorSent ?
                  <div className="">
                    El color se ha cambiado con exito!
                  </div>
                  :
                  isLoading ?
                    <Spinner />
                    :
                    <div className="">
                      <button style={{ marginTop: "0px", marginBottom: "10px" }} className="btn btn-success mt-3" onClick={submitNewColor}>
                        Guardar Color
                      </button>
                    </div>
              }
            </div>
          </div>
        </div>
        <div className="mb-2 d-flex flex-column">
          <h3 className="form-label mb-4">
            Redes Sociales
          </h3>
          {redesSociales && redesSociales.map(red => (
            <React.Fragment key={red.key}>
              <h5 className="form-label">
                {red.key}
              </h5>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <input
                  className="form-control"
                  onChange={(e) => { setRedesSociales(redesSociales.map(r => r.key === red.key ? { ...r, value: e.target.value } : r)) }}
                  value={red?.value ? red?.value : ""}
                />
                <div className="d-flex w-100 justify-content-between">
                  {
                    red.try &&
                    <a className="d-block" target="_blank" href={`${red.try}${red?.value ? red?.value : ""}`}>{red.try}{red?.value ? red?.value : ""}</a>
                  }
                  {
                    isLoading ?
                      <Spinner />
                      :
                      <div>
                        <button id={`button${red.key}`} name={red.key} style={{ marginTop: "0px", marginBottom: "10px" }} className="btn btn-success" onClick={(e) => { saveSocialMedia(e) }}>
                          Guardar {red.key}
                        </button>
                      </div>
                  }
                </div>
              </div>
            </React.Fragment>
          ))}
          <p style={{ color: "gray", fontSize: "12px" }}>
            📌 Verifica que todos los datos sean correctos haciendo click en cada enlace
          </p>
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

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header>
            <Modal.Title>Eliminar imagen</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => { setShowDeleteModal(false); }}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={deleteImage}>
              {isLoading ? <Spinner /> : "Borrar"}
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
}