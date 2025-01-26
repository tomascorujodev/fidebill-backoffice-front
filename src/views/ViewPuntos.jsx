import React, { useEffect, useState } from "react";
import { GET, POST } from "../Services/Fetch";
import Card from "../Components/Card";
import Button from "../Components/Button";
import "../assets/CSS/ViewPuntos.css";

export default function ViewPuntos() {
  const [documento, setDocumento] = useState("");
  const [cliente, setCliente] = useState(null);
  const [opcionPuntos, setOpcionPuntos] = useState(0);
  const [montoCompra, setMontoCompra] = useState(0);
  const [cantidadPuntos, setCantidadPuntos] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [fadeClass, setFadeClass] = useState("fade-out");
  const [effectId, setEffectId] = useState(null);
  useEffect(() => {
    setMontoCompra(0);
    setCantidadPuntos(0);
  }, [opcionPuntos]);

  useEffect(() => {
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
        }, 10000)
      );
    }
  }, [mensaje]);

  async function buscarCliente() {
    if (documento.length < 3) {
      setMensaje("Ingrese al menos 3 números");
      return;
    }
    try {
      let response = await GET("clientes/buscarclientepordocumento", { busqueda: documento });
      if (!response) {
        setMensaje("Ha ocurrido un error, verifique su conexión a internet");
      } else {
        switch (response.status) {
          case 200:
            let client = await response.json();
            setCliente(client);
            return;
          case 204:
            setMensaje("No se encontró ningún cliente, verifique el DNI");
            return;
          case 401:
            setMensaje("Sus credenciales expiraron, por favor, vuelva a iniciar sesion.");
            return;
          case 500:
            setMensaje("Hubo un problema en el servidor. Por favor, contacte con un administrador");
            return;
          default:
            setMensaje("Hubo un problema. Por favor, contacte con un administrador");
            return;
        }
      }
    } catch (error) {
      setMensaje("Hubo un problema al intentar obtener el cliente");
      setCliente(null);
    }
  }

  async function cargarPuntos() {
    if (montoCompra >= 30) {
      try {
        let response = await POST(`puntos/cargarcompra`, {
          IdCliente: cliente.idCliente,
          MontoCompra: Math.round(montoCompra),
        });
        if (!response) {
          setMensaje("Ha ocurrido un error, verifique su conexión a internet");
        } else {
          switch (response.status) {
            case 200:
              let client = await response.json();
              buscarCliente()
              setMensaje(client.message);
              return;
            case 204:
              setMensaje("No se encontró ningún cliente, verifique el DNI");
              return;
            case 401:
              setMensaje("Sus credenciales expiraron, por favor, vuelva a iniciar sesion.");
              return;
            case 500:
              setMensaje("Hubo un problema en el servidor. Por favor, contacte con un administrador");
              return;
            default:
              setMensaje("Hubo un problema. Por favor, contacte con un administrador");
              return;
          }
        }
      } catch (error) {
        setMensaje("Error al cargar los puntos.");
      }
    } else {
      setMensaje("El monto debe ser mayor.");
    }
  }

  const canjearPuntos = async () => {
    if (cantidadPuntos > 0 && cantidadPuntos <= cliente.puntos) {
      try {
        let response = await POST("puntos/cargarcanje", {
          IdCliente: cliente.idCliente,
          Puntos: cantidadPuntos,
        });
        if (response.error) {
          setMensaje("Error al realizar el canje.");
        }
        setDocumento(cliente.documento);
        buscarCliente();
        setMensaje(`Se canjearon ${cantidadPuntos} puntos correctamente.`);
        setMontoCompra(0);
        setCantidadPuntos(0);
      } catch (error) {
        setMensaje("Error al realizar el canje.");
      }
    } else {
      setMensaje("Cantidad de puntos no válida.");
    }
  };

  return (
    <div className="container mt-2">
      <div style={{ boxShadow: "rgb(0 0 0 / 40%) 0px 1rem 2rem" }} className="card p-4">
        <h2>Gestión de Puntos</h2>
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
            style={{ minHeight: "2rem", maxHeight: "4rem" }}
            className="btn btn-primary ms-2"
            onClick={buscarCliente}
          >
            Buscar Cliente
          </button>
        </div>
        {cliente && (
          <span>
            <h5 className="card-title mb-4">
              {cliente.nombre} {cliente.apellido}, DNI: {cliente.documento}
            </h5>
            <button
              className={`btn p-3 me-4 ${opcionPuntos === 1 ? "btn-success active" : "btn-outline-success"}`}
              onClick={() => {
                setOpcionPuntos(1);
              }}
            >
              Cargar Puntos
            </button>
            <button
              className={`btn p-3 ${opcionPuntos === 2 ? "btn-warning active" : "btn-outline-warning"}`}
              onClick={() => {
                setOpcionPuntos(2);
              }}
            >
              Canjear Puntos
            </button>
          </span>
        )}

        {mensaje && <div className={`alert alert-info mt-3 ${fadeClass}`}>{mensaje}</div>}
      </div>

      {opcionPuntos !== 0 && (
        <>
          {opcionPuntos === 1 && (
            <Card
              title={cliente.nombre + " " + cliente.apellido}
              subtitle={"Puntos disponibles: " + cliente.puntos}
              label={"Ingrese el monto de la compra"}
              setValue={setMontoCompra}
              value={montoCompra}
            >
              <Button text={"Cargar Compra"} onClick={cargarPuntos} />
            </Card>
          )}
          {opcionPuntos === 2 && (
            <Card
              title={cliente.nombre + " " + cliente.apellido}
              subtitle={"Puntos disponibles: " + cliente.puntos}
              label={"Ingrese los puntos a canjear"}
              setValue={setCantidadPuntos}
              value={cantidadPuntos}
            >
              <Button text={"Canjear Puntos"} className="btn-warning" onClick={canjearPuntos} />
            </Card>
          )}
        </>
      )}
    </div>
  );
}
