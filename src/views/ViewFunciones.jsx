import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ViewFunciones() {
  const [funciones, setFunciones] = useState({
    beneficios: false,
    puntos: false,
    premios: false,
    catalogo: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleToggleFuncion = (funcion) => {
    setFunciones(prev => ({
      ...prev,
      [funcion]: !prev[funcion]
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Aquí iría la lógica para guardar en el backend
    // Por ahora solo simulamos el guardado
    setTimeout(() => {
      setMessage("Configuración guardada correctamente");
      setShowModal(true);
      setIsLoading(false);
    }, 1000);
  };

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

  return (
    <div className="container">
      <div className="card-rounded">
        <h2 className="mb-4">Configuración de Funciones</h2>
        <div className="mb-3">
          <h3 className="form-label">
            Funcionalidades del Sistema
          </h3>
          <hr className="m-2"></hr>
          <p style={{ color: "gray", fontSize: "12px" }}>
            📌 Activa o desactiva las funcionalidades disponibles en el sistema. 
            Los cambios se aplicarán inmediatamente después de guardar.
          </p>

          <div className="row">
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill={funciones.beneficios ? "#0d6efd" : "#6c757d"} className="bi bi-gift" viewBox="0 0 16 16">
                      <path d="M3 2.5a2.5 2.5 0 0 1 5 0 2.5 2.5 0 0 1 5 0v.006c0 .07 0 .27-.038.494H15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1v7.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 14.5V7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2.038A2.968 2.968 0 0 1 3 2.506zm1.068.5H7v-.5a1.5 1.5 0 1 0-3 0c0 .085.002.274.045.43zM9 3H2.932l.04-.248c.02-.156.045-.345.045-.43a1.5 1.5 0 0 1 3 0z"/>
                      <path d="M15 4h-3V3h2.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5M1 4h3v1H1.5a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5z"/>
                    </svg>
                  </div>
                  <h5 className="card-title">Beneficios</h5>
                  <p className="card-text text-muted small">
                    Sistema de beneficios y descuentos para clientes
                  </p>
                  <div className="form-check form-switch d-flex justify-content-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="beneficios"
                      checked={funciones.beneficios}
                      onChange={() => handleToggleFuncion('beneficios')}
                      style={{ transform: "scale(1.5)" }}
                    />
                    <label className="form-check-label ms-2" htmlFor="beneficios">
                      {funciones.beneficios ? 'Activado' : 'Desactivado'}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill={funciones.puntos ? "#0d6efd" : "#6c757d"} className="bi bi-star" viewBox="0 0 16 16">
                      <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/>
                    </svg>
                  </div>
                  <h5 className="card-title">Puntos</h5>
                  <p className="card-text text-muted small">
                    Sistema de puntos y recompensas
                  </p>
                  <div className="form-check form-switch d-flex justify-content-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="puntos"
                      checked={funciones.puntos}
                      onChange={() => handleToggleFuncion('puntos')}
                      style={{ transform: "scale(1.5)" }}
                    />
                    <label className="form-check-label ms-2" htmlFor="puntos">
                      {funciones.puntos ? 'Activado' : 'Desactivado'}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill={funciones.premios ? "#0d6efd" : "#6c757d"} className="bi bi-trophy" viewBox="0 0 16 16">
                      <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5c0 .538-.012 1.05-.034 1.536a3 3 0 0 1-1.133 2.12C11.886 4.539 10.5 5.5 8 5.5c-2.5 0-3.886-.961-4.333-1.344A3 3 0 0 1 2.534 1.536C2.512 1.05 2.5.538 2.5.5m3.082 1.776A2.5 2.5 0 0 1 8 4.5c1.5 0 2.5-.5 3.418-1.224A2.5 2.5 0 0 1 13 6.5c0 .676-.328 1.276-.87 1.664C11.828 8.889 10.5 9.5 8 9.5c-2.5 0-3.828-.611-4.13-1.336A2.5 2.5 0 0 1 3 6.5c0-.676.328-1.276.87-1.664M4.5 10.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                  </div>
                  <h5 className="card-title">Premios</h5>
                  <p className="card-text text-muted small">
                    Sistema de premios y canjes
                  </p>
                  <div className="form-check form-switch d-flex justify-content-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="premios"
                      checked={funciones.premios}
                      onChange={() => handleToggleFuncion('premios')}
                      style={{ transform: "scale(1.5)" }}
                    />
                    <label className="form-check-label ms-2" htmlFor="premios">
                      {funciones.premios ? 'Activado' : 'Desactivado'}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center">
                  <div className="mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill={funciones.catalogo ? "#0d6efd" : "#6c757d"} className="bi bi-collection" viewBox="0 0 16 16">
                      <path d="M2.5 3.5a.5.5 0 0 1 0-1h11a.5.5 0 0 1 0 1zm2-2a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1zM1 6a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z"/>
                    </svg>
                  </div>
                  <h5 className="card-title">Catálogo</h5>
                  <p className="card-text text-muted small">
                    Catálogo de productos y servicios
                  </p>
                  <div className="form-check form-switch d-flex justify-content-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="catalogo"
                      checked={funciones.catalogo}
                      onChange={() => handleToggleFuncion('catalogo')}
                      style={{ transform: "scale(1.5)" }}
                    />
                    <label className="form-check-label ms-2" htmlFor="catalogo">
                      {funciones.catalogo ? 'Activado' : 'Desactivado'}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 text-center">
              <button
                className="btn btn-success btn-lg px-5"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner />
                    <span className="ms-2">Guardando...</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-check-circle me-2" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m3.646-4.646a.5.5 0 0 0-.708-.708L7.5 10.793 6.146 9.46a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0z"/>
                    </svg>
                    Guardar Configuración
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal para mensajes */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Información</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {message}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cerrar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
} 