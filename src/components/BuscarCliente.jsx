import { useState } from "react";
import { GET } from "../services/Fetch";
import CheckOnline from "../utils/CheckOnline";

export default function BuscarCliente({ titulo, setCliente, setMensaje, isLoading, setIsLoading }) {
    const [documento, setDocumento] = useState("");

    async function buscarCliente() {
        if (documento.length < 4) {
            setMensaje("Ingrese al menos 4 números");
            return;
        }
        setIsLoading(true);
        try {
            let response = await GET("clientes/buscarclientepordocumento", { busqueda: documento });
            if (!response) {
                setMensaje(CheckOnline());
            } else {
                switch (response.status) {
                    case 200:
                        let client = await response.json();
                        setCliente(client);
                        break;
                    case 204:
                        setMensaje("No se encontró ningún cliente, verifique el DNI");
                        setCliente(null);
                        break;
                    case 401:
                        setMensaje("Sus credenciales expiraron, por favor, vuelva a iniciar sesion.");
                        setCliente(null);
                        break;
                    case 500:
                        setMensaje("Hubo un problema en el servidor. Por favor, contacte con un administrador");
                        setCliente(null);
                        break;
                    default:
                        setMensaje("Hubo un problema. Por favor, contacte con un administrador");
                        setCliente(null);
                        break;
                }
            }
        } catch (error) {
            setMensaje("Hubo un problema al intentar obtener el cliente");
            setCliente(null);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <h2>{titulo}</h2>
            <br />
            <label htmlFor="documento" className="form-label">
                Documento del Cliente
            </label>
            <div className="d-flex mb-4">
                <input
                    type="text"
                    className="form-control w-75"
                    id="documento"
                    value={documento}
                    onChange={e => setDocumento(e.target.value)}
                />
                <button
                    style={{ width: "25%", minHeight: "2rem", maxHeight: "4rem" }}
                    className="btn btn-primary ms-2 center"
                    onClick={buscarCliente}
                    disabled={isLoading}
                >
                    Buscar Cliente
                </button>
            </div>
        </>
    );
}