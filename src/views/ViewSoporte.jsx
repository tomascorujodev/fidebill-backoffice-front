import React from "react";

export default function ViewSoporte() {
  return (
    <div className="container mt-4">
      <h2>Soporte</h2>
      <p className="lead text-justify">
        ¿Tenés alguna pregunta o necesitás ayuda con el sistema? Estamos acá para ayudarte. 
        Nuestro equipo de soporte y la documentación disponible están diseñados para resolver tus inquietudes de forma rápida y eficiente.
      </p>
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Documentación</h4>
          <p>
            Encontrá guías detalladas y respuestas a preguntas frecuentes en nuestra sección de documentación. 
            Aprende a gestionar puntos, realizar canjes, y aprovechar todas las funciones de la plataforma.
          </p>
          <button className="btn btn-primary btn-block">Ir a la Documentación</button>
        </div>
        <div className="col-md-6">
          <h4>Contacto</h4>
          <p>
            ¿Tenés algún inconveniente? Ponete en contacto con nuestro equipo de soporte. 
            Estamos disponibles para resolver cualquier problema o consulta que tengas.
          </p>
          <button className="btn btn-secondary btn-block">Contactanos</button>
        </div>
      </div>
      <div className="alert alert-info mt-4">
        Recuerda que también puedes enviarnos un correo a tomascorujodev@gmail.com o escribirnos al +54 223 312 2315.
      </div>
    </div>
  );
}
