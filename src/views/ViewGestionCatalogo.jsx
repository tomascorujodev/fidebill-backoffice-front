import React, { useState } from "react";
import "../assets/css/ViewPuntos.css";
import Button from "../components/Button";

export default function ViewGestionCatalogo() {
  // Datos simulados de canjes
  const [canjes, setCanjes] = useState([
    {
      id: 1,
      cliente: { nombre: "Ana", apellido: "García", documento: "30123456", telefono: "11-1234-5678", email: "ana@email.com" },
      producto: { nombre: "Auriculares Bluetooth" },
      fecha: "2024-06-01",
      estado: "Pendiente"
    },
    {
      id: 2,
      cliente: { nombre: "Luis", apellido: "Pérez", documento: "28987654", telefono: "11-9876-5432", email: "luis@email.com" },
      producto: { nombre: "Taza personalizada" },
      fecha: "2024-06-02",
      estado: "Pendiente"
    },
    {
      id: 3,
      cliente: { nombre: "María", apellido: "López", documento: "31234567", telefono: "11-5555-1234", email: "maria@email.com" },
      producto: { nombre: "Remera exclusiva" },
      fecha: "2024-06-03",
      estado: "Entregado"
    }
  ]);
  const [mensaje, setMensaje] = useState("");
  const [fadeClass, setFadeClass] = useState("fade-out");
  const [effectId, setEffectId] = useState(null);

  // Mensaje fade out
  React.useEffect(() => {
    if (effectId) {
      clearTimeout(effectId);
    }
    if (mensaje) {
      setFadeClass("fade-out");
      setEffectId(
        setTimeout(() => {
          setFadeClass("fade-out hide");
          setTimeout(() => {
            setMensaje("");
            setFadeClass("fade-out");
          }, 1000);
        }, 6000)
      );
    }
  }, [mensaje]);

  // Marcar canje como entregado
  const marcarEntregado = (id) => {
    setCanjes((prev) => prev.map(c => c.id === id ? { ...c, estado: "Entregado" } : c));
    setMensaje("Canje marcado como entregado.");
  };

  return (
    <div className="container mt-2">
      <div style={{ boxShadow: "rgb(0 0 0 / 40%) 0px 1rem 2rem" }} className="card-rounded">
        <h2>Gestión de Canjes de Catálogo</h2>
        <p className="mb-3">Visualizá los canjes realizados por los clientes desde la app y gestioná la entrega de productos.</p>
        {mensaje && <div className={`alert alert-info mt-3 ${fadeClass}`}>{mensaje}</div>}
        <div className="table-responsive mt-4">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Producto</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {canjes.length === 0 && (
                <tr><td colSpan={8} className="text-center">No hay canjes registrados.</td></tr>
              )}
              {canjes.map((canje) => (
                <tr key={canje.id} className={canje.estado === "Entregado" ? "table-success" : ""}>
                  <td>{canje.cliente.nombre} {canje.cliente.apellido}</td>
                  <td>{canje.cliente.documento}</td>
                  <td>{canje.cliente.telefono}</td>
                  <td>{canje.cliente.email}</td>
                  <td>{canje.producto.nombre}</td>
                  <td>{canje.fecha}</td>
                  <td><b>{canje.estado}</b></td>
                  <td>
                    {canje.estado === "Pendiente" && (
                      <Button text="Marcar como entregado" className="btn-success" onClick={() => marcarEntregado(canje.id)} />
                    )}
                    {canje.estado === "Entregado" && (
                      <span className="text-success">✔</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 