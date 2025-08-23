import { useNavigate } from "react-router-dom";
import jwtDecode from "../utils/jwtDecode";
import "../assets/css/CardPremio.css";
import { convertirFechaMuestra } from "../utils/ConvertirFechas";

export default function CardPremio({ 
  id = null, 
  urlImagen, 
  nombrePremio, 
  descripcion, 
  sellosRequeridos, 
  dias = [false, false, false, false, false, false, false],
  fechaInicio = null,
  fechaFin = null,
  sucursales = ["Todas"],
  eliminar = () => {} 
}) {
  const navigate = useNavigate();
  const token = jwtDecode(sessionStorage.getItem("token"));

  function formatDate(dateString) {
    if (!dateString) return null;
    return convertirFechaMuestra(dateString);
  }

  const fechaInicioFormateada = formatDate(fechaInicio);
  const fechaFinFormateada = formatDate(fechaFin);

  // Función para generar los sellos como entrada horizontal
  const renderSellosEntrada = () => {
    const totalSellos = sellosRequeridos || 5;
    const sellosCompletados = 0; // En vista previa siempre 0
    
    return (
      <div className="sellos-entrada">
        <div className="sellos-header">
          <span className="sellos-titulo">Entrada de Sellos</span>
          <span className="sellos-progreso">{sellosCompletados}/{totalSellos}</span>
        </div>
        <div className="sellos-linea">
          {Array.from({ length: totalSellos }, (_, index) => (
            <div
              key={index}
              className={`sello-punto ${index < sellosCompletados ? "completado" : "pendiente"}`}
              title={`Sello ${index + 1}`}
            >
              {index < sellosCompletados ? "✓" : ""}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Función para formatear los días como texto compacto
  const formatDiasTexto = () => {
    const diasNombres = ["L", "M", "X", "J", "V", "S", "D"];
    const diasSeleccionados = dias
      .map((activo, index) => activo ? diasNombres[index] : null)
      .filter(dia => dia !== null);
    
    if (diasSeleccionados.length === 0) return "Sin días específicos";
    if (diasSeleccionados.length === 7) return "Todos los días";
    return diasSeleccionados.join(" • ");
  };

  // Función para formatear la vigencia de forma compacta
  const formatVigencia = () => {
    if (!fechaInicioFormateada && !fechaFinFormateada) return "Sin vencimiento";
    if (!fechaInicioFormateada) return `Hasta ${fechaFinFormateada}`;
    if (!fechaFinFormateada) return `Desde ${fechaInicioFormateada}`;
    return `${fechaInicioFormateada} - ${fechaFinFormateada}`;
  };

  return (
    <div className="premio-card-horizontal">
      {/* Imagen del premio */}
      <div className="premio-imagen">
        <img
          src={urlImagen || `/assets/${token?.NombreEmpresa}_logo.png`}
          alt="Premio"
          className="premio-img"
        />
        {id && (
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

      {/* Contenido principal */}
      <div className="premio-contenido">
        <div className="premio-header">
          <h3 className="premio-titulo">{nombrePremio || "Nombre del Premio"}</h3>
          <div className="premio-badge">
            {sellosRequeridos || 5} {(sellosRequeridos || 5) === 1 ? "Sello" : "Sellos"}
          </div>
        </div>
        
        <p className="premio-descripcion">
          {descripcion || "Describe aquí el premio que recibirán los clientes..."}
        </p>

        {/* Información compacta */}
        <div className="premio-info">
          <div className="info-item">
            <span className="info-label">📅 Días:</span>
            <span className="info-valor">{formatDiasTexto()}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">⏰ Vigencia:</span>
            <span className="info-valor">{formatVigencia()}</span>
          </div>
          
          <div className="info-item">
            <span className="info-label">🏪 Sucursales:</span>
            <span className="info-valor">
              {sucursales.length === 1 && sucursales[0] === "Todas" 
                ? "Todas" 
                : sucursales.slice(0, 2).join(", ") + (sucursales.length > 2 ? "..." : "")
              }
            </span>
          </div>
        </div>

        {/* Entrada de sellos */}
        {renderSellosEntrada()}
      </div>
    </div>
  );
}
