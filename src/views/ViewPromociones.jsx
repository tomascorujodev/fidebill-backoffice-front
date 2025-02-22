import { useState } from "react";
import { POSTImage } from "../Services/Fetch";
import { Modal, Button } from "react-bootstrap";
import CheckInput from "../Components/CheckInput";

export default function ViewPromociones() {
  const [isLoading, setIsLoading] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [dias, setDias] = useState([false, false, false, false, false, false, false]);
  const [imagenPromocion, setImagenPromocion] = useState(null);
  const [urlImagen, setUrlImagen] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  function handleChangeDays(e) {
    let tmp = dias;
    tmp[e.target.name] = e.target.checked;
    setDias(tmp);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    try {
      let response = await POSTImage("`https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload`", imagenPromocion, {Titulo: titulo, Descripcion: descripcion, Dias: dias});
      if (response) {
        switch (response.status) {
          case 200:
            setMessage("El cliente " + formData.Titulo + " " + formData.Descripcion + ", Dias: " + formData.Dias + " ha sido cargado correctamente");
            setFormData({
              Titulo: "",
              Descripcion: "",
              Dias: "",
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
            setMessage("Su sesion expiro. Por favor, vuelva a iniciar sesion");
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
          setMessage("El servidor no responde. Por favor vuelva a intentarlo en unos minutos. Si el problema persiste contáctese con la sucursal más cercana");
        } else {
          setMessage("Hubo un problema al agregar cliente. Por favor, verifique la conexión y vuelva a intentarlo.");
        }
        setShowModal(true);
      }
    } catch {
      setMessage("Hubo un problema al agregar cliente. Por favor, contacte con un administrador.");
      setShowModal(true);
      setIsLoading(false);
    }
    setIsLoading(false);
  }


function handleUploadImage(e) {
  let archivo = e.target.files[0];

  if (archivo) {
    if (archivo.type === "image/jpeg" || archivo.type === "image/png" || archivo.type === "image/svg+xml") {
      setImagenPromocion(archivo);
      const url = URL.createObjectURL(archivo);
      setUrlImagen(url);
    } else {
      setMessage("El formato de archivo no es comaptible")
      setShowModal(true);
    }
  }
  console.log(imagenPromocion);
}

return (
  <div className="container card p-4 mb-4">
    <h2>
      Promociones
    </h2>
    <br />
    <form onSubmit={handleSubmit}>
      <div className="mb-3 w-50">
        <label htmlFor="Titulo" className="form-label">
          Titulo(*)
        </label>
        <input
          type="text"
          className={"form-control"}
          id="Titulo"
          name="Titulo"
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="Descripcion" className="form-label">
          Descripcion(*)
        </label>
        <textarea
          type="text"
          className={"form-control"}
          id="Descripcion"
          name="Descripcion"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="Dias" className="form-label">
          Dias(*)
        </label>
        <div>
          <CheckInput dia={"L"} name={"0"} evento={handleChangeDays} />
          <CheckInput dia={"M"} name={"1"} evento={handleChangeDays} />
          <CheckInput dia={"X"} name={"2"} evento={handleChangeDays} />
          <CheckInput dia={"J"} name={"3"} evento={handleChangeDays} />
          <CheckInput dia={"V"} name={"4"} evento={handleChangeDays} />
          <CheckInput dia={"S"} name={"5"} evento={handleChangeDays} />
          <CheckInput dia={"D"} name={"6"} evento={handleChangeDays} />
        </div>
      </div>
      <div className="mb-3">
        <label htmlFor="Imagen" className="form-label">
          Imagen
        </label>
        <input
          type="file"
          className="form-control"
          accept="image/png, image/jpeg, image/svg+xml"
          id="imagen"
          name="Imagen"
          onChange={e => handleUploadImage(e)}
        />
        <br />
        {imagenPromocion && <img src={urlImagen} alt="Imagen Promocional" width="200" />}
      </div>
      {isLoading ? (
        <div style={{ justifySelf: "center" }} className="d-flex spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      ) : (
        <button style={{ float: "inline-end" }} type="submit" className="btn btn-success w-25 mt-3 custom-button">
          Subir Promocion
        </button>
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
  </div>
  );
}
