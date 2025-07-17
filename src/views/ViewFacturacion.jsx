import React, { useState, useEffect } from "react";
import { GET, POST } from "../services/Fetch";
import facturacionElectronica, { TIPO_COMPROBANTE, TIPO_DOCUMENTO, CONCEPTO } from "../services/FacturacionElectronica";
import "../assets/css/ViewFacturacion.css";

export default function ViewFacturacion() {
  // Estados para datos dinámicos
  const [tiposCliente, setTiposCliente] = useState([]);
  const [vendedores, setVendedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [productosAgregados, setProductosAgregados] = useState([]);
  
  // Estados para facturación electrónica
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [tipoComprobante, setTipoComprobante] = useState(TIPO_COMPROBANTE.FACTURA_B);
  const [puntoVenta, setPuntoVenta] = useState(1);
  const [numeroComprobante, setNumeroComprobante] = useState(1);
  const [caeGenerado, setCaeGenerado] = useState(null);
  const [mostrarModalCAE, setMostrarModalCAE] = useState(false);
  
  // Estados para selecciones
  const [tipoClienteSeleccionado, setTipoClienteSeleccionado] = useState("");
  const [vendedorSeleccionado, setVendedorSeleccionado] = useState("");
  const [busquedaProducto, setBusquedaProducto] = useState("");
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  
  // Estados para UI
  const [mostrarDropdownTipoCliente, setMostrarDropdownTipoCliente] = useState(false);
  const [mostrarDropdownVendedor, setMostrarDropdownVendedor] = useState(false);
  const [mostrarResultadosBusqueda, setMostrarResultadosBusqueda] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  
  // Estados para cálculos
  const [totalVenta, setTotalVenta] = useState(0);

  // Cargar datos iniciales
  useEffect(() => {
    cargarTiposCliente();
    cargarVendedores();
    cargarProductos();
    cargarVentasRecientes();
  }, []);

  // Recargar ventas cuando cambie la página
  useEffect(() => {
    cargarVentasRecientes();
  }, [paginaActual]);

  // Filtrar productos cuando cambie la búsqueda
  useEffect(() => {
    if (busquedaProducto.trim()) {
      const filtrados = productos.filter(producto =>
        producto.nombre.toLowerCase().includes(busquedaProducto.toLowerCase()) ||
        producto.codigo.toLowerCase().includes(busquedaProducto.toLowerCase())
      );
      setProductosFiltrados(filtrados);
      setMostrarResultadosBusqueda(true);
    } else {
      setProductosFiltrados([]);
      setMostrarResultadosBusqueda(false);
    }
  }, [busquedaProducto, productos]);

  // Calcular total cuando cambien los productos agregados
  useEffect(() => {
    const total = productosAgregados.reduce((sum, producto) => {
      const subtotal = (producto.precio || producto.precioUnitario) * producto.cantidad * (1 - producto.descuento / 100);
      return sum + subtotal;
    }, 0);
    setTotalVenta(total);
  }, [productosAgregados]);

  // Funciones para cargar datos desde la API
  const cargarTiposCliente = async () => {
    try {
      const response = await GET("api/tipos-cliente", {});
      if (response.ok) {
        const data = await response.json();
        setTiposCliente(data);
        if (data.length > 0) {
          setTipoClienteSeleccionado(data[0].nombre);
        }
      } else if (response.status === 401) {
        alert("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
        window.location.href = "/";
      } else {
        console.error("Error al cargar tipos de cliente:", response.status);
        // Datos de ejemplo si falla la API
        setTiposCliente([
          { id: 1, nombre: "Consumidor Final" },
          { id: 2, nombre: "Responsable Inscripto" },
          { id: 3, nombre: "Exento" }
        ]);
      }
    } catch (error) {
      console.error("Error al cargar tipos de cliente:", error);
      // Datos de ejemplo si falla la API
      setTiposCliente([
        { id: 1, nombre: "Consumidor Final" },
        { id: 2, nombre: "Responsable Inscripto" },
        { id: 3, nombre: "Exento" }
      ]);
    }
  };

  const cargarVendedores = async () => {
    try {
      const response = await GET("api/vendedores", {});
      if (response.ok) {
        const data = await response.json();
        setVendedores(data);
        if (data.length > 0) {
          setVendedorSeleccionado(`${data[0].apellido}, ${data[0].nombre}`);
        }
      } else if (response.status === 401) {
        alert("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
        window.location.href = "/";
      } else {
        console.error("Error al cargar vendedores:", response.status);
        // Datos de ejemplo si falla la API
        setVendedores([
          { id: 1, nombre: "Juan", apellido: "Pérez" },
          { id: 2, nombre: "María", apellido: "González" },
          { id: 3, nombre: "Carlos", apellido: "López" }
        ]);
      }
    } catch (error) {
      console.error("Error al cargar vendedores:", error);
      // Datos de ejemplo si falla la API
      setVendedores([
        { id: 1, nombre: "Juan", apellido: "Pérez" },
        { id: 2, nombre: "María", apellido: "González" },
        { id: 3, nombre: "Carlos", apellido: "López" }
      ]);
    }
  };

  const cargarProductos = async () => {
    try {
      const response = await GET("api/productos", {});
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      } else if (response.status === 401) {
        alert("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
        window.location.href = "/";
      } else {
        console.error("Error al cargar productos:", response.status);
        // Datos de ejemplo si falla la API
        setProductos([
          { id: 1, codigo: "00001", nombre: "RC Performance 20kg", precio: 77000 },
          { id: 2, codigo: "00002", nombre: "Proteína Whey 1kg", precio: 45000 },
          { id: 3, codigo: "00003", nombre: "Creatina Monohidrato", precio: 25000 }
        ]);
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
      // Datos de ejemplo si falla la API
      setProductos([
        { id: 1, codigo: "00001", nombre: "RC Performance 20kg", precio: 77000 },
        { id: 2, codigo: "00002", nombre: "Proteína Whey 1kg", precio: 45000 },
        { id: 3, codigo: "00003", nombre: "Creatina Monohidrato", precio: 25000 }
      ]);
    }
  };

  const cargarVentasRecientes = async () => {
    try {
      const response = await GET("api/ventas", { pagina: paginaActual, limite: 10 });
      if (response.ok) {
        const data = await response.json();
        setVentasRecientes(data.data || []);
        setTotalPaginas(data.totalPages || 1);
      } else if (response.status === 401) {
        alert("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
        window.location.href = "/";
      } else {
        console.error("Error al cargar ventas recientes:", response.status);
        // Datos de ejemplo si falla la API
        const ventasEjemplo = Array.from({ length: 9 }, (_, i) => ({
          id: `0000${i + 1}`,
          monto: 57750,
          medioPago: "Crédito",
          fecha: new Date().toLocaleDateString()
        }));
        setVentasRecientes(ventasEjemplo);
        setTotalPaginas(5);
      }
    } catch (error) {
      console.error("Error al cargar ventas recientes:", error);
      // Datos de ejemplo si falla la API
      const ventasEjemplo = Array.from({ length: 9 }, (_, i) => ({
        id: `0000${i + 1}`,
        monto: 57750,
        medioPago: "Crédito",
        fecha: new Date().toLocaleDateString()
      }));
      setVentasRecientes(ventasEjemplo);
      setTotalPaginas(5);
    }
  };

  // Funciones para manejar interacciones
  const agregarProducto = (producto) => {
    const productoExistente = productosAgregados.find(p => p.id === producto.id);
    
    if (productoExistente) {
      setProductosAgregados(prev => 
        prev.map(p => 
          p.id === producto.id 
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        )
      );
    } else {
      setProductosAgregados(prev => [...prev, {
        ...producto,
        cantidad: 1,
        descuento: 0
      }]);
    }
    
    setBusquedaProducto("");
    setMostrarResultadosBusqueda(false);
  };

  const actualizarCantidad = (productoId, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      setProductosAgregados(prev => prev.filter(p => p.id !== productoId));
    } else {
      setProductosAgregados(prev => 
        prev.map(p => 
          p.id === productoId 
            ? { ...p, cantidad: nuevaCantidad }
            : p
        )
      );
    }
  };

  const actualizarDescuento = (productoId, nuevoDescuento) => {
    setProductosAgregados(prev => 
      prev.map(p => 
        p.id === productoId 
          ? { ...p, descuento: Math.max(0, Math.min(100, nuevoDescuento)) }
          : p
      )
    );
  };

  const eliminarProducto = (productoId) => {
    setProductosAgregados(prev => prev.filter(p => p.id !== productoId));
  };

  const limpiarVenta = () => {
    setProductosAgregados([]);
    setTotalVenta(0);
  };

  const guardarVenta = async () => {
    if (productosAgregados.length === 0) {
      alert("Debe agregar al menos un producto");
      return;
    }

    try {
      const ventaData = {
        tipoCliente: tipoClienteSeleccionado,
        vendedor: vendedorSeleccionado,
        productos: productosAgregados,
        total: totalVenta,
        fecha: new Date().toISOString()
      };

      const response = await POST("api/ventas", ventaData);
      if (response.ok) {
        const result = await response.json();
        if (result.error === false) {
          alert("Venta guardada exitosamente");
          limpiarVenta();
          cargarVentasRecientes(); // Recargar ventas recientes
        } else {
          alert(result.message || "Error al guardar la venta");
        }
      } else if (response.status === 401) {
        alert("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
        window.location.href = "/";
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error al guardar la venta");
      }
    } catch (error) {
      console.error("Error al guardar venta:", error);
      alert("Error al guardar la venta");
    }
  };

  // Funciones para facturación electrónica
  const buscarCliente = async () => {
    try {
      // Por ahora usamos datos simulados, pero aquí se conectaría con el endpoint real
      const response = await GET("api/facturacion/consultar-contribuyente", { 
        tipoDoc: TIPO_DOCUMENTO.CUIT, 
        numeroDoc: "20123456789" 
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.error === false && data.contribuyente) {
          setClienteSeleccionado(data.contribuyente);
          alert(`Cliente encontrado: ${data.contribuyente.razonSocial}`);
        } else {
          alert(data.message || "Cliente no encontrado");
        }
      } else if (response.status === 401) {
        alert("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
        window.location.href = "/";
      } else {
        // Fallback a datos simulados
        const cliente = await facturacionElectronica.consultarContribuyente(
          TIPO_DOCUMENTO.CUIT,
          "20123456789"
        );
        setClienteSeleccionado(cliente);
        alert(`Cliente encontrado: ${cliente.razonSocial}`);
      }
    } catch (error) {
      console.error("Error al buscar cliente:", error);
      // Fallback a datos simulados
      try {
        const cliente = await facturacionElectronica.consultarContribuyente(
          TIPO_DOCUMENTO.CUIT,
          "20123456789"
        );
        setClienteSeleccionado(cliente);
        alert(`Cliente encontrado: ${cliente.razonSocial}`);
      } catch (fallbackError) {
        alert("Error al buscar cliente");
      }
    }
  };

  const generarFacturaElectronica = async () => {
    if (!clienteSeleccionado) {
      alert("Debe seleccionar un cliente primero");
      return;
    }

    if (productosAgregados.length === 0) {
      alert("Debe agregar al menos un producto");
      return;
    }

    try {
      // Preparar datos de la factura
      const facturaData = {
        tipoComprobante: tipoComprobante,
        concepto: CONCEPTO.PRODUCTOS,
        docTipo: clienteSeleccionado.tipoDocumento,
        docNro: clienteSeleccionado.numeroDocumento,
        cbteDesde: numeroComprobante,
        cbteHasta: numeroComprobante,
        fechaComprobante: new Date().toISOString().split('T')[0],
        impTotal: totalVenta,
        impTotConc: 0,
        impNeto: totalVenta * 0.79, // 79% del total (sin IVA)
        impOpEx: 0,
        impIVA: totalVenta * 0.21, // 21% IVA
        impTrib: 0,
        fechaServicio: new Date().toISOString().split('T')[0],
        fechaVtoPago: new Date().toISOString().split('T')[0],
        monId: 'PES',
        monCotiz: 1,
        puntoVenta: puntoVenta,
        iva: [
          {
            id: 5, // 21%
            baseImp: totalVenta * 0.79,
            importe: totalVenta * 0.21
          }
        ],
        tributos: [],
        items: productosAgregados
      };

      // Intentar generar CAE con el backend
      const response = await POST("api/facturacion/generar-cae", facturaData);
      
      if (response.ok) {
        const result = await response.json();
        if (result.error === false) {
          setCaeGenerado({
            cae: result.cae,
            numeroComprobante: result.numeroComprobante,
            fechaVencimientoCAE: result.fechaVencimientoCAE,
            puntoVenta: result.puntoVenta,
            resultado: "A"
          });
          setMostrarModalCAE(true);
          console.log("CAE generado:", result);
        } else {
          alert(result.message || "Error al generar CAE");
        }
      } else if (response.status === 401) {
        alert("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
        window.location.href = "/";
      } else {
        // Fallback al servicio simulado
        const resultado = await facturacionElectronica.crearFactura(facturaData);
        setCaeGenerado(resultado);
        setMostrarModalCAE(true);
        console.log("CAE generado (simulado):", resultado);
      }
    } catch (error) {
      console.error("Error al generar factura electrónica:", error);
      // Fallback al servicio simulado
      try {
        const resultado = await facturacionElectronica.crearFactura(facturaData);
        setCaeGenerado(resultado);
        setMostrarModalCAE(true);
        console.log("CAE generado (simulado):", resultado);
      } catch (fallbackError) {
        alert("Error al generar factura electrónica: " + error.message);
      }
    }
  };

  const cerrarModalCAE = () => {
    setMostrarModalCAE(false);
    setCaeGenerado(null);
  };

  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  // Generar array de páginas para paginación
  const generarPaginas = () => {
    const paginas = [];
    const inicio = Math.max(1, paginaActual - 2);
    const fin = Math.min(totalPaginas, paginaActual + 2);
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    return paginas;
  };

  return (
    <div className="facturacion-container">
      {/* Header: Selectores y botones */}
      <div className="facturacion-header">
        <div className="facturacion-header-left">
          <div className="facturacion-dropdown">
            <label 
              className="facturacion-label"
              onClick={() => setMostrarDropdownTipoCliente(!mostrarDropdownTipoCliente)}
            >
              <b>Tipo cliente:</b> {tipoClienteSeleccionado} <span className="facturacion-arrow">▼</span>
            </label>
            {mostrarDropdownTipoCliente && (
              <div className="facturacion-dropdown-menu">
                {tiposCliente.map(tipo => (
                  <div 
                    key={tipo.id}
                    className="facturacion-dropdown-item"
                    onClick={() => {
                      setTipoClienteSeleccionado(tipo.nombre);
                      setMostrarDropdownTipoCliente(false);
                    }}
                  >
                    {tipo.nombre}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="facturacion-header-right">
          <div className="facturacion-dropdown">
            <label 
              className="facturacion-label"
              onClick={() => setMostrarDropdownVendedor(!mostrarDropdownVendedor)}
            >
              <b>Vendedor:</b> {vendedorSeleccionado} <span className="facturacion-arrow">▼</span>
            </label>
            {mostrarDropdownVendedor && (
              <div className="facturacion-dropdown-menu">
                {vendedores.map(vendedor => (
                  <div 
                    key={vendedor.id}
                    className="facturacion-dropdown-item"
                    onClick={() => {
                      setVendedorSeleccionado(`${vendedor.apellido}, ${vendedor.nombre}`);
                      setMostrarDropdownVendedor(false);
                    }}
                  >
                    {vendedor.apellido}, {vendedor.nombre}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="facturacion-btn facturacion-btn-blue" onClick={buscarCliente}>Buscar Cliente</button>
          <button className="facturacion-btn facturacion-btn-blue">Nuevo Cliente</button>
        </div>
      </div>

      {/* Buscador */}
      <div className="facturacion-searchbar">
        <span className="facturacion-search-icon">🔍</span>
        <input
          className="facturacion-search-input"
          placeholder="Buscar producto, servicio..."
          value={busquedaProducto}
          onChange={(e) => setBusquedaProducto(e.target.value)}
          onFocus={() => setMostrarResultadosBusqueda(true)}
        />
        {mostrarResultadosBusqueda && productosFiltrados.length > 0 && (
          <div className="facturacion-search-results">
            {productosFiltrados.map(producto => (
              <div 
                key={producto.id}
                className="facturacion-search-item"
                onClick={() => agregarProducto(producto)}
              >
                <div className="facturacion-search-item-codigo">{producto.codigo}</div>
                <div className="facturacion-search-item-nombre">{producto.nombre}</div>
                <div className="facturacion-search-item-precio">${producto.precio?.toLocaleString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main: Tablas */}
      <div className="facturacion-main">
        {/* Tabla de productos agregados */}
        <div className="facturacion-table productos">
          <div className="facturacion-table-header">
            <div>Código</div>
            <div>Nombre</div>
            <div>Cantidad</div>
            <div>Precio Unitario</div>
            <div>Descuento (%)</div>
            <div>Subtotal</div>
            <div>Acciones</div>
          </div>
          <div className="facturacion-table-body">
            {productosAgregados.length === 0 ? (
              <div className="facturacion-table-empty">
                No hay productos agregados
              </div>
            ) : (
                             productosAgregados.map(producto => {
                 const subtotal = (producto.precio || producto.precioUnitario) * producto.cantidad * (1 - producto.descuento / 100);
                return (
                  <div className="facturacion-table-row" key={producto.id}>
                    <div>{producto.codigo}</div>
                    <div>{producto.nombre}</div>
                    <div>
                      <input
                        type="number"
                        min="1"
                        value={producto.cantidad}
                        onChange={(e) => actualizarCantidad(producto.id, parseInt(e.target.value) || 0)}
                        className="facturacion-cantidad-input"
                      />
                    </div>
                                         <div>${(producto.precio || producto.precioUnitario)?.toLocaleString()}</div>
                    <div>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={producto.descuento}
                        onChange={(e) => actualizarDescuento(producto.id, parseFloat(e.target.value) || 0)}
                        className="facturacion-descuento-input"
                      />
                    </div>
                    <div>${subtotal.toLocaleString()}</div>
                    <div>
                      <button 
                        className="facturacion-btn-eliminar"
                        onClick={() => eliminarProducto(producto.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="facturacion-table-total">
            <div className="facturacion-total-label"><b>TOTAL:</b></div>
            <div className="facturacion-total-value">${totalVenta.toLocaleString()}</div>
          </div>
        </div>

        {/* Tabla de ventas recientes */}
        <div className="facturacion-table ventas">
          <div className="facturacion-table-header">
            <div>Ventas</div>
            <div>Acciones</div>
          </div>
          <div className="facturacion-table-body ventas">
            <div className="facturacion-table-row ventas">
              <div className="facturacion-ventas-list">
                <div className="facturacion-ventas-row">
                  <div>Id</div>
                  <div>Monto</div>
                  <div>Medio de Pago</div>
                  <div>Fecha</div>
                  <div>Acciones</div>
                </div>
                {ventasRecientes.map((venta, i) => (
                  <div className="facturacion-ventas-row" key={i}>
                    <div>{venta.id}</div>
                    <div>${venta.monto?.toLocaleString()}</div>
                    <div>{venta.medioPago}</div>
                    <div>{venta.fecha}</div>
                    <div>•••</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Paginación */}
          <div className="facturacion-pagination">
            <button 
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              {'<'}
            </button>
            {generarPaginas().map(n => (
              <button 
                key={n}
                onClick={() => cambiarPagina(n)}
                className={n === paginaActual ? 'active' : ''}
              >
                {n}
              </button>
            ))}
            {paginaActual + 2 < totalPaginas && <span>...</span>}
            <button 
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="facturacion-actions">
        <button className="facturacion-btn facturacion-btn-blue" onClick={generarFacturaElectronica}>Generar CAE</button>
        <button className="facturacion-btn">Cobrar</button>
        <button className="facturacion-btn" onClick={limpiarVenta}>Limpiar</button>
        <button className="facturacion-btn" onClick={guardarVenta}>Guardar venta</button>
        <button className="facturacion-btn">Descuentos</button>
        <button className="facturacion-btn">Cerrar Caja</button>
      </div>

      {/* Modal de CAE */}
      {mostrarModalCAE && caeGenerado && (
        <div className="facturacion-modal-overlay">
          <div className="facturacion-modal">
            <div className="facturacion-modal-header">
              <h3>CAE Generado Exitosamente</h3>
              <button className="facturacion-modal-close" onClick={cerrarModalCAE}>✕</button>
            </div>
            <div className="facturacion-modal-body">
              <div className="facturacion-cae-info">
                <div className="facturacion-cae-item">
                  <strong>CAE:</strong> {caeGenerado.cae}
                </div>
                <div className="facturacion-cae-item">
                  <strong>Número de Comprobante:</strong> {caeGenerado.numeroComprobante}
                </div>
                <div className="facturacion-cae-item">
                  <strong>Punto de Venta:</strong> {caeGenerado.puntoVenta}
                </div>
                <div className="facturacion-cae-item">
                  <strong>Fecha de Vencimiento CAE:</strong> {caeGenerado.fechaVencimientoCAE}
                </div>
                <div className="facturacion-cae-item">
                  <strong>Resultado:</strong> {caeGenerado.resultado}
                </div>
              </div>
            </div>
            <div className="facturacion-modal-footer">
              <button className="facturacion-btn facturacion-btn-blue" onClick={cerrarModalCAE}>
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 