import { useNavigate } from "react-router-dom";
import jwtDecode from "../utils/jwtDecode";

export default function CardPremio({ id = null, urlImagen, nombrePremio, descripcion, sellosRequeridos, eliminar = () => {} }) {
  const navigate = useNavigate();
  const token = jwtDecode(sessionStorage.getItem("token"));

  return (
    <div 
      className="card border-0 shadow-sm mb-3" 
      style={{ maxWidth: "300px", position: "relative" }}
    >
      {id && (
        <div style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          zIndex: 10,
        }}>
          <button
            className="btn btn-warning btn-sm"
            onClick={() => navigate(`/premios/modificar?id=${id}`)}
          >
            Modificar
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => eliminar(id)}
          >
            Eliminar
          </button>
        </div>
      )}

      {urlImagen && (
        <img
          src={urlImagen}
          className="card-img-top"
          alt="Premio"
          style={{ height: "150px", objectFit: "cover" }}
        />
      )}
      <div
        className="card-body"
        style={{ background: `linear-gradient(135deg, #efecf3 25%,${token?.ColorPrincipal} 100%)` }}
      >
        <h5 className="card-title">{nombrePremio || "Nombre del Premio"}</h5>
        <p className="card-text small">{descripcion || "Descripción del premio"}</p>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="badge bg-primary">
            {sellosRequeridos} {sellosRequeridos === 1 ? "Sello" : "Sellos"}
          </span>
        </div>
      </div>
    </div>
  );
}
