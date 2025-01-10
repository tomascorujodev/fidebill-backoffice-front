import { Link } from "react-router-dom";

export default function Menu() {
    return (
        <div className="container">

        <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
                <a className="navbar-brand" href="#">
                    <img src="/assets/LOGOSDCapCut.png" alt="FideBill Logo" width="140" height="30" />
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
                            <Link className="nav-link" to="/puntos">
                                Facturación
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/cliente">
                                Clientes
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/puntos">
                                Puntos
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/ayuda">
                                Soporte
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <div className="container">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">First</th>
                        <th scope="col">Last</th>
                        <th scope="col">Handle</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td colspan="2">Larry the Bird</td>
                        <td>@twitter</td>
                    </tr>
                </tbody>
            </table>
        </div>
        </div>
 
    );
}
