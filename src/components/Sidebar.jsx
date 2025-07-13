import { Link } from "react-router-dom";
import jwtDecode from "../utils/jwtDecode";
import "../assets/css/Sidebar.css";

export default function Sidebar() {
  const token = jwtDecode(sessionStorage.getItem("token"));

  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li className="sidebar-item">
            <Link className="sidebar-link" to="/cliente">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people me-2" viewBox="0 0 16 16">
                <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zM7.5 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                <path d="M2.197 15.954l-.02-.021c1.095-.132 1.907-.368 2.335-.442.327-.243.793-.062.793.242v.723c0 .334-.278.604-.62.604a.604.604 0 0 1-.604-.604v-.714c-.063-.107-.714-.093-.714-.093z"/>
              </svg>
              Clientes
            </Link>
          </li>

          {token?.rol === "admin" ? (
            <>
              <li className="sidebar-item">
                <div className="sidebar-dropdown">
                  <button className="sidebar-link dropdown-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#beneficiosCollapse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gift me-2" viewBox="0 0 16 16">
                      <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3H2.932l.04-.248c.02-.156.045-.345.045-.43a1.5 1.5 0 0 1 3 0z"/>
                      <path d="M15 4h-3V3h2.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5M1 4h3v1H1.5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                    Beneficios
                  </button>
                  <div className="collapse" id="beneficiosCollapse">
                    <ul className="sidebar-submenu">
                      <li>
                        <Link className="sidebar-sublink" to="beneficios/crearbeneficio">
                          Crear
                        </Link>
                      </li>
                      <li>
                        <Link className="sidebar-sublink" to="beneficios/verbeneficios">
                          Activos
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>

              <li className="sidebar-item">
                <div className="sidebar-dropdown">
                  <button className="sidebar-link dropdown-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#premiosCollapse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trophy me-2" viewBox="0 0 16 16">
                      <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 0 1-1.133 2.12C11.886 4.539 10.5 5.5 8 5.5c-2.5 0-3.886-.961-4.333-1.344A3 3 0 0 1 2.534 1.536C2.512 1.05 2.5.538 2.5.5m3.082 1.776A2.5 2.5 0 0 1 8 4.5c1.5 0 2.5-.5 3.418-1.224A2.5 2.5 0 0 1 13 6.5c0 .676-.328 1.276-.87 1.664C11.828 8.889 10.5 9.5 8 9.5c-2.5 0-3.828-.611-4.13-1.336A2.5 2.5 0 0 1 3 6.5c0-.676.328-1.276.87-1.664M4.5 10.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                    Premios
                  </button>
                  <div className="collapse" id="premiosCollapse">
                    <ul className="sidebar-submenu">
                      <li>
                        <Link className="sidebar-sublink" to="premios/crearpremio">
                          Crear
                        </Link>
                      </li>
                      <li>
                        <Link className="sidebar-sublink" to="premios/verpremios">
                          Activos
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>

              <li className="sidebar-item">
                <div className="sidebar-dropdown">
                  <button className="sidebar-link dropdown-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#catalogoCollapse">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-collection me-2" viewBox="0 0 16 16">
                      <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM1 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>
                    </svg>
                    Catálogo
                  </button>
                  <div className="collapse" id="catalogoCollapse">
                    <ul className="sidebar-submenu">
                      <li>
                        <Link className="sidebar-sublink" to="catalogo/crearproducto">
                          Crear
                        </Link>
                      </li>
                      <li>
                        <Link className="sidebar-sublink" to="catalogo/verproductos">
                          Activos
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>

              <li className="sidebar-item">
                <Link className="sidebar-link" to="/facturacion">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-receipt me-2" viewBox="0 0 16 16">
                    <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0L11 1.293l.646-.647a.5.5 0 0 1 .708 0L13 1.293l.646-.647a.5.5 0 0 1 .434-.14.5.5 0 0 1 .066.719l-1.5 1.5a.5.5 0 0 1-.708 0L11 2.207l-.646.647a.5.5 0 0 1-.708 0L9 2.207l-.646.647a.5.5 0 0 1-.708 0L7 2.207l-.646.647a.5.5 0 0 1-.708 0L5 2.207l-.646.647a.5.5 0 0 1-.708 0L3 2.207l-.646.647a.5.5 0 0 1-.708 0L1 2.207l-.646.647a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .066-.719z"/>
                    <path d="M14 4.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-9zM2 5.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0 2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0 2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1zm0 2a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-1z"/>
                  </svg>
                  Facturación
                </Link>
              </li>

              <li className="sidebar-item">
                <Link className="sidebar-link" to="/pedidos-pendientes">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard-check me-2" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zM4.5 1.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z"/>
                  </svg>
                  Pedidos Pendientes
                </Link>
              </li>

              <li className="sidebar-item">
                <Link className="sidebar-link" to="/appclientes">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-phone me-2" viewBox="0 0 16 16">
                    <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                    <path d="M7.5 14a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5"/>
                  </svg>
                  Aplicación
                </Link>
              </li>

              <li className="sidebar-item">
                <Link className="sidebar-link" to="/funciones">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear me-2" viewBox="0 0 16 16">
                    <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0"/>
                    <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292-.16c-.764-.415-1.6.42-1.184 1.185l.159.292A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.291c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z"/>
                  </svg>
                  Funciones
                </Link>
              </li>
            </>
          ) : (
            <li className="sidebar-item">
              <Link className="sidebar-link" to="/puntos">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star me-2" viewBox="0 0 16 16">
                  <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                </svg>
                Puntos
              </Link>
            </li>
          )}

          <li className="sidebar-item">
            <div className="sidebar-dropdown">
              <button className="sidebar-link dropdown-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#historialCollapse">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock-history me-2" viewBox="0 0 16 16">
                  <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.171a7 7 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.43zm.374 1.383a6.987 6.987 0 0 0-.332-.86l.985-.277c.286.93.465 1.93.525 2.968l-1.178-.831zM8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
                  <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
                </svg>
                Historial
              </button>
              <div className="collapse" id="historialCollapse">
                <ul className="sidebar-submenu">
                  <li>
                    <Link className="sidebar-sublink" to="/compras">
                      Compras
                    </Link>
                  </li>
                  <li>
                    <Link className="sidebar-sublink" to="/canjes">
                      Canjes
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </li>

          <li className="sidebar-item">
            <Link className="sidebar-link" to="/ayuda">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-question-circle me-2" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.206 2.016v.03a.5.5 0 0 0 .5.5h.777a.5.5 0 0 0 .5-.5v-.867c0-.332.278-.686.95-.686.385 0 .84.332.84.846 0 .479-.277.835-.605.835-.334 0-.605-.279-.605-.835h-.777c0 .556.271.835.605.835.328 0 .605-.279.605-.835 0-.514-.455-.846-.84-.846-.672 0-.95.354-.95.686v.867a.5.5 0 0 1-.5.5h-.777a.5.5 0 0 1-.5-.5v-.03c0-.956-.533-1.527-1.206-2.016C5.374 6.927 5 6.635 5 6c0-.825.628-1.168 1.314-1.168.802 0 1.253.478 1.342 1.134.018.137.128.25.266.25h.825a.237.237 0 0 0 .241-.247z"/>
              </svg>
              Soporte
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
} 