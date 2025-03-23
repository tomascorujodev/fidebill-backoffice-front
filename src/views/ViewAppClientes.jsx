import { useEffect, useState } from "react";
import { POST } from "../Services/Fetch";
import { Modal, Button } from "react-bootstrap";
import Carousel from "../Components/Carousel";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

export default function ViewAppClientes() {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [imagenes, setImagenes] = useState({ imagen1: "", imagen2: "", imagen3: "" });
  const [urlImagenes, seturlImagenes] = useState({ urlImagen1: null, urlImagen2: null, urlImagen3: null });
  const [colorPrincipal, setColorPrincipal] = useState("");
  const [modifiedStates, setModifiedStates] = useState({ imagen1: "", imagen2: "", imagen3: "" });
  const [message, setMessage] = useState("");
  const [color, setColor] = useColor("#561ecb");

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!validaciones[key].test(formData[key])) {
        newErrors[key] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);
    if (isValid) {
      try {
        let response = await POST("clientes/crearcliente", {
          ...formData,
          FechaNacimiento: new Date(formData.FechaNacimiento).toISOString(),
        });
        if (response) {
          switch (response.status) {
            case 200:
              setMessage(
                "El cliente " +
                formData.Nombre +
                " " +
                formData.Apellido +
                ", Documento: " +
                formData.Documento +
                " ha sido cargado correctamente"
              );
              setFormData({
                Nombre: "",
                Apellido: "",
                Documento: "",
                FechaNacimiento: "",
                Genero: "Masculino",
                TipoCliente: "Consumidor Final",
                Email: "",
                Direccion: "",
                Telefono: "",
              });
              setErrors({});
              setShowModal(true);
              break;
            case 401:
              setMessage(
                "Su sesion expiro. Por favor, vuelva a iniciar sesion"
              );
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
            setMessage(
              "El servidor no responde. Por favor vuelva a intentarlo en unos minutos. Si el problema persiste contáctese con la sucursal más cercana"
            );
          } else {
            setMessage(
              "Hubo un problema al agregar cliente. Por favor, verifique la conexión y vuelva a intentarlo."
            );
          }
          setShowModal(true);
        }
      } catch {
        setMessage(
          "Hubo un problema al agregar cliente. Por favor, contacte con un administrador."
        );
        setShowModal(true);
        setIsLoading(false);
      }
    }
    setIsLoading(false);
  }



  function cargarImagen(e) {
    let archivo = e.target.files[0];
    let id = e.target.id;

    if (!archivo) return;

    if (["image/jpeg", "image/png", "image/svg+xml"].includes(archivo.type)) {
      if (archivo.size <= 1048576) {

        let keyMap = {
          imagen1: "urlImagen1",
          imagen2: "urlImagen2",
          imagen3: "urlImagen3"
        };

        if (keyMap[id]) {
          seturlImagenes((prev) => ({
            ...prev,
            [keyMap[id]]: URL.createObjectURL(archivo),
          }));

          setImagenes((prev) => ({
            ...prev,
            [id]: archivo,
          }));
        }

      } else {
        setMessage("La imagen excede el tamaño máximo permitido de 1MB");
        setShowModal(true);
        e.target.value = "";
      }
    } else {
      setMessage("El formato de archivo no es compatible");
      setShowModal(true);
      e.target.value = "";
    }
  }


  return (
    <div className="container">
      <div className="card-rounded">
        <h2>Configurar App de Clientes</h2>
        <br />
        <form>
          <div className="mb-3">
            <h5 htmlFor="Nombre" className="form-label">
              Color Principal
            </h5>
            <div className="custom-layout">
              <ColorPicker color={color} onChange={setColor} />
            </div>
          </div>
          <div className="mb-3">
            <h5 htmlFor="Carrousel" className="form-label">
              Carrousel
            </h5>
            <label htmlFor="imagen1" className="form-label">
              Imagen 1
            </label>
            <input
              type="file"
              id="imagen1"
              className="form-control"
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={cargarImagen}
            />
            <label htmlFor="imagen2" className="form-label">
              Imagen 2
            </label>
            <input
              type="file"
              id="imagen2"
              className="form-control"
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={cargarImagen}
            />
            <label htmlFor="imagen3" className="form-label">
              Imagen 3
            </label>
            <input
              type="file"
              id="imagen3"
              className="form-control"
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={cargarImagen}
            />
          </div>
          <p style={{ color: "gray", fontSize: "12px" }}>
            📌 Recomendación: Para una mejor visualización, suba imágenes con
            una relación de aspecto 4:1 (Ejemplo: 1600 × 400, 2000 × 500, 2400 × 600).
          </p>
          <Carousel imagen1={urlImagenes.urlImagen1} imagen2={urlImagenes.urlImagen2} imagen3={urlImagenes.urlImagen3} />
          {isLoading ? (
            <div
              style={{ justifySelf: "center" }}
              className="d-flex spinner-border"
              role="status"
            >
              <span className="visually-hidden">Cargando...</span>
            </div>
          ) : (
            <>
              <button
                style={{
                  marginTop: "0px",
                  marginBottom: "10px",
                }}
                type="submit"
                className="btn btn-success w-25 mt-3 custom-button"
              >
                Guardar cambios
              </button>
            </>
          )}
        </form>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Confirmación</Modal.Title>
          </Modal.Header>
          <Modal.Body>{message}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
        <br />
      </div>
      <br />
    </div>
  );
}
