import React, { useState } from 'react';


export default function Puntos() {
    const [documento, setDocumento] = useState('');
    const [cliente, setCliente] = useState(null);
    const [cantidadPuntos, setCantidadPuntos] = useState(0);
    const [mensaje, setMensaje] = useState('');

    const buscarCliente = async () => {
        try {
            const response = await axios.get(`/api/clientes/${documento}`);
            setCliente(response.data);
            setMensaje('');
        } catch (error) {
            setMensaje('Cliente no encontrado.');
            setCliente(null);
        }
    };

    const cargarPuntos = async () => {
        if (cliente && cantidadPuntos > 0) {
            try {
                await axios.put(`/api/clientes/${cliente.id}/puntos`, {
                    puntos: cliente.puntos + cantidadPuntos,
                });
                setMensaje(`Se cargaron ${cantidadPuntos} puntos correctamente.`);
                setCliente({ ...cliente, puntos: cliente.puntos + cantidadPuntos });
                setCantidadPuntos(0);
            } catch (error) {
                setMensaje('Error al cargar los puntos.');
            }
        } else {
            setMensaje('Cantidad de puntos no válida.');
        }
    };

    const canjearPuntos = async () => {
        if (cliente && cantidadPuntos > 0 && cantidadPuntos <= cliente.puntos) {
            try {
                const response = await axios.post('/api/canjes', {
                    cliente_id: cliente.id,
                    puntos_utilizados: cantidadPuntos,
                    descripcion: `Canje de ${cantidadPuntos} puntos`,
                });
                setMensaje(`Canje realizado con éxito. ID del canje: ${response.data.id}`);
                setCliente({ ...cliente, puntos: cliente.puntos - cantidadPuntos });
                setCantidadPuntos(0);
            } catch (error) {
                setMensaje('Error al realizar el canje.');
            }
        } else {
            setMensaje('Cantidad de puntos no válida.');
        }
    };

    return (

        <div className="container mt-2">
            <h2>Gestión de Puntos</h2>
            <div className="mb-3">
                <label htmlFor="documento" className="form-label">
                    Documento del Cliente
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="documento"
                    value={documento}
                    onChange={(e) => setDocumento(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={buscarCliente}>
                    Buscar Cliente
                </button>
            </div>

            {cliente && (
                <div className="card mt-4">
                    <div className="card-body">
                        <h5 className="card-title">
                            {cliente.nombre} {cliente.apellido}
                        </h5>
                        <p className="card-text">Puntos disponibles: {cliente.puntos}</p>

                        <div className="mb-3">
                            <label htmlFor="cantidadPuntos" className="form-label">
                                Cantidad de Puntos
                            </label>
                            <input
                                type="number"
                                className="form-control"
                                id="cantidadPuntos"
                                value={cantidadPuntos}
                                onChange={(e) => setCantidadPuntos(parseInt(e.target.value, 10) || 0)}
                            />
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-success" onClick={cargarPuntos}>
                                Cargar Puntos
                            </button>
                            <button className="btn btn-warning" onClick={canjearPuntos}>
                                Canjear Puntos
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mensaje && <div className="alert alert-info mt-3">{mensaje}</div>}
        </div>

    );
}
