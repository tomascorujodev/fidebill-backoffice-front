import { Link } from "react-router-dom";

export default function Navbar() {
  function logOut(){
    sessionStorage.clear();
    window.location.reload();
    return;
  }

  return (
<nav className="navbar navbar-expand-lg mb-4" style={{ backgroundColor: "#202020" }}>

  <br />
  <div className="container-fluid">
    <a className="navbar-brand" href="/">
      <img
        src="/assets/LOGOSDCapCut.png"
        alt="FideBill Logo"
        width="140"
        height="30"
      />
    </a>
    <button
      className="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link" to="/cliente" style={{ color: "white" }}>
            Clientes
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/puntos" style={{ color: "white" }}>
            Puntos
          </Link>
        </li>
        <li className="nav-item dropdown">
          <Link
            className="nav-link dropdown-toggle"
            to="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ color: "white" }}
          >
            Historial
          </Link>
          <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
            <li>
              <Link className="dropdown-item" to="/compras">
                Compras
              </Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/canjes">
                Canjes
              </Link>
            </li>
          </ul>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/ayuda" style={{ color: "white" }}>
            Soporte
          </Link>
        </li>
      </ul>
      <ul className="navbar-nav mb-2 mb-lg-0">
        <li className="nav-item">
          <button className="btn nav-link" onClick={() => logOut()} style={{ color: "white" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
            <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
          </svg>
          </button>
        </li>
      </ul>
    </div>
  </div>
</nav>

  );
}
