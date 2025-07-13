import { useEffect, useState } from "react";
import { GET, POST, PATCH, DELETE } from "../services/Fetch";
import { Modal, Button, Tabs, Tab } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ViewPedidosPendientes() {
  const [activeTab, setActiveTab] = useState("proveedores");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showPedidoModal, setShowPedidoModal] = useState(false);
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [message, setMessage] = useState("");
  const [pedidosProveedores, setPedidosProveedores] = useState([]);
  const [pedidosClientes, setPedidosClientes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [productos, setProductos] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const navigate = useNavigate();

  // Estados para formularios
  const [formPedidoProveedor, setFormPedidoProveedor] = useState({
    nombreProveedor: "",
    productos: [],
    montoTotal: 0,
    medioPago: "Efectivo",
    fechaEstimadaIngreso: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sucursal: "",
    diasEsperaPago: 30,
    estado: "Sin enviar"
  });

  const [formPedidoCliente, setFormPedidoCliente] = useState({
    nombreCliente: "",
    fechaPedido: new Date().toISOString().split('T')[0],
    telefono: "",
    producto: "",
    descripcion: "",
    pagado: false,
    encargado: "",
    modoPago: "Efectivo",
    medioVenta: "Local",
    estado: "Pendiente"
  });

  const [formProducto, setFormProducto] = useState({
    nombre: "",
    kilos: 0,
    precioUnitario: 0,
    stockDeseado: 0
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setIsLoading(true);
    try {
      // Datos de ejemplo para pedidos de proveedores
      const pedidosProveedoresEjemplo = [
        {
          id: 1,
          nombreProveedor: "Distribuidora Handler",
          productos: [
            { nombre: "Harina 0000", kilos: 100, precioUnitario: 2.5, stockDeseado: 200, subtotal: 250 },
            { nombre: "Aceite de Oliva", kilos: 50, precioUnitario: 8.0, stockDeseado: 100, subtotal: 400 }
          ],
          montoTotal: 650,
          medioPago: "Transferencia",
          fechaEstimadaIngreso: "2024-02-15",
          sucursal: "Sucursal Centro",
          diasEsperaPago: 30,
          estado: "Sin enviar"
        },
        {
          id: 2,
          nombreProveedor: "Carnes Premium",
          productos: [
            { nombre: "Carne Vacuna", kilos: 200, precioUnitario: 12.0, stockDeseado: 300, subtotal: 2400 }
          ],
          montoTotal: 2400,
          medioPago: "Efectivo",
          fechaEstimadaIngreso: "2024-02-10",
          sucursal: "Sucursal Norte",
          diasEsperaPago: 15,
          estado: "Enviado"
        }
      ];

      // Datos de ejemplo para pedidos de clientes
      const pedidosClientesEjemplo = [
        {
          id: 1,
          nombreCliente: "María González",
          fechaPedido: "2024-02-01",
          telefono: "11-1234-5678",
          producto: "Torta de Chocolate",
          descripcion: "Torta de chocolate con decoración especial para cumpleaños",
          pagado: true,
          encargado: "Juan Pérez",
          modoPago: "Tarjeta",
          medioVenta: "WhatsApp",
          estado: "Pendiente"
        },
        {
          id: 2,
          nombreCliente: "Carlos Rodríguez",
          fechaPedido: "2024-02-02",
          telefono: "11-9876-5432",
          producto: "Pizza Familiar",
          descripcion: "Pizza familiar con extra queso y pepperoni",
          pagado: false,
          encargado: "Ana López",
          modoPago: "Efectivo",
          medioVenta: "Local",
          estado: "Completado"
        }
      ];

      // Datos de ejemplo para sucursales
      const sucursalesEjemplo = [
        { id: 1, nombre: "Sucursal Centro" },
        { id: 2, nombre: "Sucursal Norte" },
        { id: 3, nombre: "Sucursal Sur" }
      ];

      setPedidosProveedores(pedidosProveedoresEjemplo);
      setPedidosClientes(pedidosClientesEjemplo);
      setSucursales(sucursalesEjemplo);

    } catch (error) {
      setMessage("Error al cargar los datos");
      setShowModal(true);
    }
    setIsLoading(false);
  }

  // Funciones para pedidos de proveedores
  function agregarProducto() {
    if (formProducto.nombre && formProducto.kilos > 0) {
      const nuevoProducto = {
        ...formProducto,
        id: Date.now(),
        subtotal: formProducto.kilos * formProducto.precioUnitario
      };
      
      setFormPedidoProveedor(prev => ({
        ...prev,
        productos: [...prev.productos, nuevoProducto],
        montoTotal: prev.montoTotal + nuevoProducto.subtotal
      }));
      
      setFormProducto({
        nombre: "",
        kilos: 0,
        precioUnitario: 0,
        stockDeseado: 0
      });
    }
  }

  function eliminarProducto(index) {
    const productoEliminado = formPedidoProveedor.productos[index];
    setFormPedidoProveedor(prev => ({
      ...prev,
      productos: prev.productos.filter((_, i) => i !== index),
      montoTotal: prev.montoTotal - productoEliminado.subtotal
    }));
  }

  async function crearPedidoProveedor() {
    if (!formPedidoProveedor.nombreProveedor || formPedidoProveedor.productos.length === 0) {
      setMessage("Complete todos los campos obligatorios");
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    try {
      // Simular creación exitosa
      const nuevoPedido = {
        ...formPedidoProveedor,
        id: Date.now()
      };
      
      setPedidosProveedores(prev => [...prev, nuevoPedido]);
      setMessage("Pedido de proveedor creado exitosamente");
      setFormPedidoProveedor({
        nombreProveedor: "",
        productos: [],
        montoTotal: 0,
        medioPago: "Efectivo",
        fechaEstimadaIngreso: "",
        sucursal: "",
        diasEsperaPago: 30,
        estado: "Sin enviar"
      });
      setShowPedidoModal(false);
    } catch (error) {
      setMessage("Error al crear el pedido");
    }
    setShowModal(true);
    setIsLoading(false);
  }

  async function actualizarEstadoPedido(id, nuevoEstado) {
    setIsLoading(true);
    try {
      // Simular actualización exitosa
      if (activeTab === "proveedores") {
        setPedidosProveedores(prev => 
          prev.map(pedido => 
            pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
          )
        );
      } else {
        setPedidosClientes(prev => 
          prev.map(pedido => 
            pedido.id === id ? { ...pedido, estado: nuevoEstado } : pedido
          )
        );
      }
      setMessage("Estado actualizado exitosamente");
    } catch (error) {
      setMessage("Error al actualizar el estado");
    }
    setShowModal(true);
    setIsLoading(false);
  }

  // Funciones para pedidos de clientes
  async function crearPedidoCliente() {
    if (!formPedidoCliente.nombreCliente || !formPedidoCliente.producto) {
      setMessage("Complete todos los campos obligatorios");
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    try {
      // Simular creación exitosa
      const nuevoPedido = {
        ...formPedidoCliente,
        id: Date.now()
      };
      
      setPedidosClientes(prev => [...prev, nuevoPedido]);
      setMessage("Pedido de cliente creado exitosamente");
      setFormPedidoCliente({
        nombreCliente: "",
        fechaPedido: "",
        telefono: "",
        producto: "",
        descripcion: "",
        pagado: false,
        encargado: "",
        modoPago: "Efectivo",
        medioVenta: "Local",
        estado: "Pendiente"
      });
      setShowPedidoModal(false);
    } catch (error) {
      setMessage("Error al crear el pedido");
    }
    setShowModal(true);
    setIsLoading(false);
  }

  function calcularDiasRestantes(fechaEstimada) {
    const hoy = new Date();
    const fecha = new Date(fechaEstimada);
    const diffTime = fecha - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function obtenerColorEstado(estado) {
    switch (estado) {
      case "Ingresado": return "success";
      case "Enviado": return "primary";
      case "Sin enviar": return "warning";
      case "No ingresado": return "danger";
      case "Pendiente": return "warning";
      case "Completado": return "success";
      case "Cancelado": return "danger";
      default: return "secondary";
    }
  }

  return (
    <div className="container">
      <div className="card-rounded">
        <h2 className="mb-4">Gestión de Pedidos Pendientes</h2>
        
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
          <Tab eventKey="proveedores" title="Pedidos de Proveedores">
            <div className="d-flex justify-content-between mb-3">
              <h4>Pedidos de Proveedores</h4>
              <Button variant="success" onClick={() => setShowPedidoModal(true)}>
                Crear Pedido de Proveedor
              </Button>
            </div>

            {isLoading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Proveedor</th>
                      <th>Productos</th>
                      <th>Monto Total</th>
                      <th>Fecha Estimada</th>
                      <th>Sucursal</th>
                      <th>Estado</th>
                      <th>Días Restantes</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosProveedores.map((pedido) => (
                      <tr key={pedido.id}>
                        <td>{pedido.nombreProveedor}</td>
                        <td>
                          <small>
                            {pedido.productos.map((prod, index) => (
                              <div key={index}>
                                {prod.nombre} - {prod.kilos}kg
                              </div>
                            ))}
                          </small>
                        </td>
                        <td>${pedido.montoTotal.toLocaleString()}</td>
                        <td>{new Date(pedido.fechaEstimadaIngreso).toLocaleDateString()}</td>
                        <td>{pedido.sucursal}</td>
                        <td>
                          <span className={`badge bg-${obtenerColorEstado(pedido.estado)}`}>
                            {pedido.estado}
                          </span>
                        </td>
                        <td>
                          {calcularDiasRestantes(pedido.fechaEstimadaIngreso)} días
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => {
                                setSelectedPedido(pedido);
                                setShowPagoModal(true);
                              }}
                            >
                              Ver Detalle
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-warning"
                              onClick={() => actualizarEstadoPedido(pedido.id, "Enviado")}
                            >
                              Marcar Enviado
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Tab>

          <Tab eventKey="clientes" title="Pedidos de Clientes">
            <div className="d-flex justify-content-between mb-3">
              <h4>Pedidos de Clientes</h4>
              <Button variant="success" onClick={() => setShowPedidoModal(true)}>
                Crear Pedido de Cliente
              </Button>
            </div>

            {isLoading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Fecha Pedido</th>
                      <th>Teléfono</th>
                      <th>Producto</th>
                      <th>Descripción</th>
                      <th>Pagado</th>
                      <th>Encargado</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosClientes.map((pedido) => (
                      <tr key={pedido.id}>
                        <td>{pedido.nombreCliente}</td>
                        <td>{new Date(pedido.fechaPedido).toLocaleDateString()}</td>
                        <td>{pedido.telefono}</td>
                        <td>{pedido.producto}</td>
                        <td>{pedido.descripcion}</td>
                        <td>
                          <span className={`badge bg-${pedido.pagado ? 'success' : 'danger'}`}>
                            {pedido.pagado ? 'Sí' : 'No'}
                          </span>
                        </td>
                        <td>{pedido.encargado}</td>
                        <td>
                          <span className={`badge bg-${obtenerColorEstado(pedido.estado)}`}>
                            {pedido.estado}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => {
                                setSelectedPedido(pedido);
                                setShowPagoModal(true);
                              }}
                            >
                              Ver Detalle
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() => actualizarEstadoPedido(pedido.id, "Completado")}
                            >
                              Completar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Tab>
        </Tabs>
      </div>

      {/* Modal para crear pedido de proveedor */}
      <Modal show={showPedidoModal && activeTab === "proveedores"} onHide={() => setShowPedidoModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Crear Pedido de Proveedor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Nombre del Proveedor *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formPedidoProveedor.nombreProveedor}
                  onChange={(e) => setFormPedidoProveedor(prev => ({...prev, nombreProveedor: e.target.value}))}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Medio de Pago</label>
                <select
                  className="form-select"
                  value={formPedidoProveedor.medioPago}
                  onChange={(e) => setFormPedidoProveedor(prev => ({...prev, medioPago: e.target.value}))}
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Cheque">Cheque</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Fecha Estimada de Ingreso</label>
                <input
                  type="date"
                  className="form-control"
                  value={formPedidoProveedor.fechaEstimadaIngreso}
                  onChange={(e) => setFormPedidoProveedor(prev => ({...prev, fechaEstimadaIngreso: e.target.value}))}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Sucursal</label>
                <select
                  className="form-select"
                  value={formPedidoProveedor.sucursal}
                  onChange={(e) => setFormPedidoProveedor(prev => ({...prev, sucursal: e.target.value}))}
                >
                  <option value="">Seleccionar sucursal</option>
                  {sucursales.map((sucursal) => (
                    <option key={sucursal.id} value={sucursal.nombre}>
                      {sucursal.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Días de Espera para Pago</label>
                <input
                  type="number"
                  className="form-control"
                  value={formPedidoProveedor.diasEsperaPago}
                  onChange={(e) => setFormPedidoProveedor(prev => ({...prev, diasEsperaPago: parseInt(e.target.value)}))}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Monto Total</label>
                <input
                  type="text"
                  className="form-control"
                  value={`$${formPedidoProveedor.montoTotal.toLocaleString()}`}
                  readOnly
                />
              </div>
            </div>
          </div>

          <hr />
          <h5>Agregar Productos</h5>
          <div className="row">
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">Producto</label>
                <input
                  type="text"
                  className="form-control"
                  value={formProducto.nombre}
                  onChange={(e) => setFormProducto(prev => ({...prev, nombre: e.target.value}))}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="mb-3">
                <label className="form-label">Kilos</label>
                <input
                  type="number"
                  className="form-control"
                  value={formProducto.kilos}
                  onChange={(e) => setFormProducto(prev => ({...prev, kilos: parseFloat(e.target.value)}))}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="mb-3">
                <label className="form-label">Precio/kg</label>
                <input
                  type="number"
                  className="form-control"
                  value={formProducto.precioUnitario}
                  onChange={(e) => setFormProducto(prev => ({...prev, precioUnitario: parseFloat(e.target.value)}))}
                />
              </div>
            </div>
            <div className="col-md-2">
              <div className="mb-3">
                <label className="form-label">Stock Deseado</label>
                <input
                  type="number"
                  className="form-control"
                  value={formProducto.stockDeseado}
                  onChange={(e) => setFormProducto(prev => ({...prev, stockDeseado: parseInt(e.target.value)}))}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="mb-3">
                <label className="form-label">&nbsp;</label>
                <Button variant="primary" onClick={agregarProducto} className="w-100">
                  Agregar Producto
                </Button>
              </div>
            </div>
          </div>

          {formPedidoProveedor.productos.length > 0 && (
            <div className="mt-3">
              <h6>Productos Agregados:</h6>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Kilos</th>
                      <th>Precio/kg</th>
                      <th>Stock Deseado</th>
                      <th>Subtotal</th>
                      <th>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formPedidoProveedor.productos.map((producto, index) => (
                      <tr key={producto.id}>
                        <td>{producto.nombre}</td>
                        <td>{producto.kilos}</td>
                        <td>${producto.precioUnitario}</td>
                        <td>{producto.stockDeseado}</td>
                        <td>${producto.subtotal}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => eliminarProducto(index)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPedidoModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={crearPedidoProveedor} disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear Pedido"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para crear pedido de cliente */}
      <Modal show={showPedidoModal && activeTab === "clientes"} onHide={() => setShowPedidoModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crear Pedido de Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Nombre del Cliente *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formPedidoCliente.nombreCliente}
                  onChange={(e) => setFormPedidoCliente(prev => ({...prev, nombreCliente: e.target.value}))}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formPedidoCliente.telefono}
                  onChange={(e) => setFormPedidoCliente(prev => ({...prev, telefono: e.target.value}))}
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Producto *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formPedidoCliente.producto}
                  onChange={(e) => setFormPedidoCliente(prev => ({...prev, producto: e.target.value}))}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label">Fecha de Pedido</label>
                <input
                  type="date"
                  className="form-control"
                  value={formPedidoCliente.fechaPedido}
                  onChange={(e) => setFormPedidoCliente(prev => ({...prev, fechaPedido: e.target.value}))}
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Descripción</label>
            <textarea
              className="form-control"
              rows="3"
              value={formPedidoCliente.descripcion}
              onChange={(e) => setFormPedidoCliente(prev => ({...prev, descripcion: e.target.value}))}
            />
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Encargado</label>
                <input
                  type="text"
                  className="form-control"
                  value={formPedidoCliente.encargado}
                  onChange={(e) => setFormPedidoCliente(prev => ({...prev, encargado: e.target.value}))}
                />
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Modo de Pago</label>
                <select
                  className="form-select"
                  value={formPedidoCliente.modoPago}
                  onChange={(e) => setFormPedidoCliente(prev => ({...prev, modoPago: e.target.value}))}
                >
                  <option value="Efectivo">Efectivo</option>
                  <option value="Tarjeta">Tarjeta</option>
                  <option value="Transferencia">Transferencia</option>
                </select>
              </div>
            </div>
            <div className="col-md-4">
              <div className="mb-3">
                <label className="form-label">Medio de Venta</label>
                <select
                  className="form-select"
                  value={formPedidoCliente.medioVenta}
                  onChange={(e) => setFormPedidoCliente(prev => ({...prev, medioVenta: e.target.value}))}
                >
                  <option value="Local">Local</option>
                  <option value="Delivery">Delivery</option>
                  <option value="WhatsApp">WhatsApp</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                checked={formPedidoCliente.pagado}
                onChange={(e) => setFormPedidoCliente(prev => ({...prev, pagado: e.target.checked}))}
              />
              <label className="form-check-label">
                Pagado
              </label>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPedidoModal(false)}>
            Cancelar
          </Button>
          <Button variant="success" onClick={crearPedidoCliente} disabled={isLoading}>
            {isLoading ? "Creando..." : "Crear Pedido"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para ver detalle de pedido */}
      <Modal show={showPagoModal} onHide={() => setShowPagoModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalle del Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPedido && (
            <div>
              {activeTab === "proveedores" ? (
                <div>
                  <h5>Pedido de Proveedor</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Proveedor:</strong> {selectedPedido.nombreProveedor}</p>
                      <p><strong>Monto Total:</strong> ${selectedPedido.montoTotal.toLocaleString()}</p>
                      <p><strong>Medio de Pago:</strong> {selectedPedido.medioPago}</p>
                      <p><strong>Estado:</strong> 
                        <span className={`badge bg-${obtenerColorEstado(selectedPedido.estado)} ms-2`}>
                          {selectedPedido.estado}
                        </span>
                      </p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Fecha Estimada:</strong> {new Date(selectedPedido.fechaEstimadaIngreso).toLocaleDateString()}</p>
                      <p><strong>Sucursal:</strong> {selectedPedido.sucursal}</p>
                      <p><strong>Días de Espera:</strong> {selectedPedido.diasEsperaPago}</p>
                      <p><strong>Días Restantes:</strong> {calcularDiasRestantes(selectedPedido.fechaEstimadaIngreso)} días</p>
                    </div>
                  </div>
                  
                  <h6>Productos:</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Kilos</th>
                          <th>Precio/kg</th>
                          <th>Stock Deseado</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPedido.productos.map((producto, index) => (
                          <tr key={index}>
                            <td>{producto.nombre}</td>
                            <td>{producto.kilos}</td>
                            <td>${producto.precioUnitario}</td>
                            <td>{producto.stockDeseado}</td>
                            <td>${producto.subtotal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div>
                  <h5>Pedido de Cliente</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Cliente:</strong> {selectedPedido.nombreCliente}</p>
                      <p><strong>Producto:</strong> {selectedPedido.producto}</p>
                      <p><strong>Teléfono:</strong> {selectedPedido.telefono}</p>
                      <p><strong>Encargado:</strong> {selectedPedido.encargado}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Fecha:</strong> {new Date(selectedPedido.fechaPedido).toLocaleDateString()}</p>
                      <p><strong>Modo de Pago:</strong> {selectedPedido.modoPago}</p>
                      <p><strong>Medio de Venta:</strong> {selectedPedido.medioVenta}</p>
                      <p><strong>Pagado:</strong> 
                        <span className={`badge bg-${selectedPedido.pagado ? 'success' : 'danger'} ms-2`}>
                          {selectedPedido.pagado ? 'Sí' : 'No'}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <strong>Descripción:</strong>
                    <p>{selectedPedido.descripcion}</p>
                  </div>
                  
                  <p><strong>Estado:</strong> 
                    <span className={`badge bg-${obtenerColorEstado(selectedPedido.estado)} ms-2`}>
                      {selectedPedido.estado}
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPagoModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de mensajes */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Aviso</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} 