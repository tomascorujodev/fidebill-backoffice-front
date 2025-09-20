import { useNavigate } from "react-router-dom";
import jwtDecode from "../utils/jwtDecode";
import "../assets/css/CardPremio.css";
import { convertirFecha } from "../utils/ConvertirFechas";

export default function CardPremio({
  id = 0,
  urlImagen,
  nombre,
  descripcion,
  sellos,
  sellosAcumulados = 0,
  dias = [true, true, true, true, true, true, true],
  fechaInicio = null,
  fechaFin = null,
  sucursales = null,
  eliminar = () => { },
  canjearPremio = null
}) {
  const navigate = useNavigate();
  const token = jwtDecode(sessionStorage.getItem("token"));

  const fechaInicioFormateada = convertirFecha(fechaInicio);
  const fechaFinFormateada = convertirFecha(fechaFin);

  const renderSellosEntrada = () => {
    return (
      sellos !== sellosAcumulados ?
        <div className="sellos-entrada">
          <div className="sellos-linea">
            <div className="sellos-centrar">
              {Array.from({ length: sellos }, (_, index) => (
                <button
                  key={`${id}-${index}`}
                  className={`${((index <= sellosAcumulados && typeof canjearPremio === "function") || index < sellosAcumulados) ? "mas" : ""} sello-punto`}
                  onClick={() => canjearPremio(id)}
                  title={`sello ${index}`}
                  disabled={!(index === sellosAcumulados)}
                >
                  {index === sellosAcumulados && (typeof canjearPremio === "function") ? "+" : ""}
                  {index < sellosAcumulados ? "✓" : ""}
                </button>
              ))}
            </div>
          </div>
          <span className="sellos-progreso">
            {sellosAcumulados}/{sellos}
          </span>
        </div>
        :
        <div className="d-flex justify-content-end">
          <button className="btn btn-success justify-content-end" onClick={() => canjearPremio(id)}> Canjear Premio </button>
        </div>
    );
  };

  const formatDiasTexto = () => {
    const diasNombres = ["L", "M", "X", "J", "V", "S", "D"];
    const diasSeleccionados = dias
      .map((activo, index) => activo ? diasNombres[index] : null)
      .filter(dia => dia !== null);

    if (diasSeleccionados.length === 0) return "Sin días específicos";
    if (diasSeleccionados.length === 7) return "Todos los días";
    return diasSeleccionados.join(" • ");
  };

  const formatVigencia = () => {
    if (!fechaInicioFormateada && !fechaFinFormateada) return "Sin vencimiento";
    if (!fechaInicioFormateada) return `Hasta ${fechaFinFormateada}`;
    if (!fechaFinFormateada) return `Desde ${fechaInicioFormateada}`;
    return `${fechaInicioFormateada} - ${fechaFinFormateada}`;
  };
  return (
    <div className="premio-card-horizontal">
      <div className="premio-imagen">
        <img
          src={urlImagen || `/assets/${token?.NombreEmpresa}_logo.png`}
          alt="Premio"
          className="premio-img"
        />
        {(id > 0 && token?.rol) && (
          <div className="premio-actions">
            <button className="btn-modificar" onClick={() => navigate(`/premios/modificar?id=${id}`)}>
              Modificar
            </button>
            <button className="btn-eliminar" onClick={() => eliminar(id)}>
              Eliminar
            </button>
          </div>
        )}
      </div>

      <div className="premio-contenido">
        <div className="premio-header">
          <h3 className="premio-titulo">{nombre}</h3>
          <div className="premio-badge">
            {sellos} Sellos
          </div>
        </div>

        <p className="premio-descripcion">
          {descripcion || "Describe aquí el premio que recibirán los clientes..."}
        </p>
        <div className="d-flex flex-column justify-content-between">
          <div className="d-flex flex-column justify-content-center">
            <div className="premio-info">
              <span className="info-label">Días:</span>
              <span className="info-valor">{formatDiasTexto()}</span>
              <span className="info-label">Vigencia:</span>
              <span className="info-valor">{formatVigencia()}</span>
            </div>
            <div className="premio-info">
              <span className="info-label">Sucursales:</span>
              <span className="info-valor">{sucursales ? sucursales?.join(", ") : "Todas"}</span>
            </div>
          </div>
          {renderSellosEntrada()}
        </div>
      </div>
    </div>
  );
}
