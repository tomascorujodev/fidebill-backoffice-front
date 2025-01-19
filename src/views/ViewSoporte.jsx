import React from "react";

export default function ViewSoporte() {
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Sección de Soporte</h2>
      <p className="lead text-justify">
        ¿Tienes alguna pregunta o necesitas ayuda con el sistema? Estamos aquí para ayudarte. 
        Nuestro equipo de soporte y la documentación disponible están diseñados para resolver tus inquietudes de forma rápida y eficiente.
      </p>
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Documentación</h4>
          <p>
            Encuentra guías detalladas y respuestas a preguntas frecuentes en nuestra sección de documentación. 
            Aprende a gestionar puntos, realizar canjes, y aprovechar todas las funciones de la plataforma.
          </p>
          <button className="btn btn-primary btn-block">Ir a la Documentación</button>
        </div>
        <div className="col-md-6">
          <h4>Contacto</h4>
          <p>
            ¿No encuentras lo que necesitas? Ponte en contacto con nuestro equipo de soporte. 
            Estamos disponibles para resolver cualquier problema o consulta que tengas.
          </p>
          <button className="btn btn-secondary btn-block">Contáctanos</button>
        </div>
      </div>
      <div className="alert alert-info mt-4">
        Recuerda que también puedes enviarnos un correo a soporte@ejemplo.com o llamarnos al +54 123 456 7890.
      </div>
    </div>
  );
}
