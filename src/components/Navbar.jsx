import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "../utils/jwtDecode"
import "../assets/css/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = jwtDecode(sessionStorage.getItem("token"));

  function logOut() {
    sessionStorage.clear();
    if (token?.rol === "admin") {
      navigate("/admin")
    }
    window.location.reload();
    return;
  }

  return (
    <nav className="navbar rounded-navbar">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img
            src={`/assets/${token?.NombreEmpresa}_logo.png`}
            alt="Empresa Logo"
            width="100"
            height="50"
            style={{ objectFit: "contain" }}
          />
        </a>

        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li className="d-flex flex-row flex-wrap align-content-center mx-2">
            <svg xmlns="http://www.w3.org/2000/svg" style={{ marginTop: "1px", marginRight: "4px" }} width="23" height="23" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
            </svg>
            <p style={{ marginTop: "2px" }}>
              {
                token?.Usuario
                  ? token?.Usuario
                  : "Usuario no disponible"
              }
            </p>
          </li>
          <li className="nav-item">
            <button className="btn nav-link" onClick={() => logOut()}>
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
                <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </nav >
  );
}
