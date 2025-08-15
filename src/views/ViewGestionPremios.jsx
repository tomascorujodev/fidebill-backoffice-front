import React, { useState } from "react";
import "../assets/css/ViewPuntos.css";
import Button from "../components/Button";

export default function ViewGestionPremios() {
  // Datos simulados de premios reclamados
  const [premiosReclamados, setPremiosReclamados] = useState([
    {
      id: 1,
      cliente: { nombre: "Ana", apellido: "García", documento: "30123456", telefono: "11-1234-5678", email: "ana@email.com" },
      premio: { nombre: "Auriculares Premium", sellosNecesarios: 5 },
      sellosCanjeados: 5,
      saldoAnterior: 8,
      saldoActual: 3,
      fecha: "2024-06-01",
      estado: "Pendiente"
    },
    {
      id: 2,
      cliente: { nombre: "Luis", apellido: "Pérez", documento: "28987654", telefono: "11-9876-5432", email: "luis@email.com" },
      premio: { nombre: "Taza Personalizada", sellosNecesarios: 3 },
      sellosCanjeados: 3,
      saldoAnterior: 6,
      saldoActual: 3,
      fecha: "2024-06-02",
      estado: "Pendiente"
    },
    {
      id: 3,
      cliente: { nombre: "María", apellido: "López", documento: "31234567", telefono: "11-5555-1234", email: "maria@email.com" },
      premio: { nombre: "Remera Exclusiva", sellosNecesarios: 4 },
      sellosCanjeados: 4,
      saldoAnterior: 7,
      saldoActual: 3,
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

  // Marcar premio como entregado
  const marcarEntregado = (id) => {
    setPremiosReclamados((prev) => prev.map(p => p.id === id ? { ...p, estado: "Entregado" } : p));
    setMensaje("Premio marcado como entregado.");
  };

  return (
    <div className="container mt-2">
      <div style={{ boxShadow: "rgb(0 0 0 / 40%) 0px 1rem 2rem" }} className="card-rounded">
        <h2>Gestión de Premios Reclamados</h2>
        <p className="mb-3">Visualizá los premios reclamados por los clientes desde la app y gestioná la entrega.</p>
        {mensaje && <div className={`alert alert-info mt-3 ${fadeClass}`}>{mensaje}</div>}
        <div className="table-responsive mt-4">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Documento</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Premio</th>
                <th>Sellos Canjeados</th>
                <th>Saldo Anterior</th>
                <th>Saldo Actual</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {premiosReclamados.length === 0 && (
                <tr><td colSpan={11} className="text-center">No hay premios reclamados.</td></tr>
              )}
              {premiosReclamados.map((premio) => (
                <tr key={premio.id} className={premio.estado === "Entregado" ? "table-success" : ""}>
                  <td>{premio.cliente.nombre} {premio.cliente.apellido}</td>
                  <td>{premio.cliente.documento}</td>
                  <td>{premio.cliente.telefono}</td>
                  <td>{premio.cliente.email}</td>
                  <td>{premio.premio.nombre}</td>
                  <td><b>{premio.sellosCanjeados}</b></td>
                  <td>{premio.saldoAnterior}</td>
                  <td>{premio.saldoActual}</td>
                  <td>{premio.fecha}</td>
                  <td><b>{premio.estado}</b></td>
                  <td>
                    {premio.estado === "Pendiente" && (
                      <Button text="Marcar como entregado" className="btn-success" onClick={() => marcarEntregado(premio.id)} />
                    )}
                    {premio.estado === "Entregado" && (
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