import { useEffect, useState } from "react";
import { GET, POST, PATCH, DELETE } from "../services/Fetch";
import { Modal, Button, Table, Form, Badge, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function ViewProductos() {
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState("");
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategoria, setFilterCategoria] = useState("");
  const navigate = useNavigate();

  // Estados para el formulario
  const [formProducto, setFormProducto] = useState({
    nombreProducto: "",
    descripcion: "",
    precioUnitario: 0,
    stockActual: 0,
    stockMinimo: 0,
    categoria: "",
    codigoProducto: "",
    unidadMedida: "Unidad",
    activo: true,
    precioPuntos: 0,
    disponibleParaFacturacion: true,
    disponibleParaPedidos: true
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setIsLoading(true);
    try {
      // Cargar productos
      const responseProductos = await GET("api/productos", {});
      if (responseProductos?.ok) {
        const dataProductos = await responseProductos.json();
        if (dataProductos.error === false) {
          setProductos(dataProductos.data || []);
        } else {
          console.error("Error al cargar productos:", dataProductos.message);
          // Usar datos de ejemplo como fallback
          setProductos([
            {
              idProducto: 1,
              nombreProducto: "Harina 0000",
              descripcion: "Harina de trigo 0000 para panadería",
              precioUnitario: 2.50,
              stockActual: 500,
              stockMinimo: 100,
              categoria: "Insumos",
              codigoProducto: "HAR001",
              unidadMedida: "Kg",
              activo: true,
              precioPuntos: 100,
              disponibleParaFacturacion: true,
              disponibleParaPedidos: true
            },
            {
              idProducto: 2,
              nombreProducto: "Aceite de Oliva",
              descripcion: "Aceite de oliva extra virgen",
              precioUnitario: 8.00,
              stockActual: 200,
              stockMinimo: 50,
              categoria: "Insumos",
              codigoProducto: "ACE001",
              unidadMedida: "Litro",
              activo: true,
              precioPuntos: 200,
              disponibleParaFacturacion: true,
              disponibleParaPedidos: true
            }
          ]);
        }
      } else if (responseProductos?.status === 401) {
        setMessage("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
        setShowModal(true);
        setIsLoading(false);
        return;
      } else {
        // Usar datos de ejemplo como fallback
        setProductos([
          {
            idProducto: 1,
            nombreProducto: "Harina 0000",
            descripcion: "Harina de trigo 0000 para panadería",
            precioUnitario: 2.50,
            stockActual: 500,
            stockMinimo: 100,
            categoria: "Insumos",
            codigoProducto: "HAR001",
            unidadMedida: "Kg",
            activo: true,
            precioPuntos: 100,
            disponibleParaFacturacion: true,
            disponibleParaPedidos: true
          }
        ]);
      }

      // Cargar categorías
      const responseCategorias = await GET("api/productos/categorias", {});
      if (responseCategorias?.ok) {
        const dataCategorias = await responseCategorias.json();
        if (dataCategorias.error === false) {
          setCategorias(dataCategorias.data || []);
        } else {
          // Categorías por defecto
          setCategorias([
            { id: 1, nombre: "Insumos" },
            { id: 2, nombre: "Productos Terminados" },
            { id: 3, nombre: "Servicios" },
            { id: 4, nombre: "Otros" }
          ]);
        }
      } else {
        setCategorias([
          { id: 1, nombre: "Insumos" },
          { id: 2, nombre: "Productos Terminados" },
          { id: 3, nombre: "Servicios" },
          { id: 4, nombre: "Otros" }
        ]);
      }

    } catch (error) {
      console.error("Error al cargar datos:", error);
      setMessage("Error al cargar los datos. Usando datos de ejemplo.");
      setShowModal(true);
      
      // Datos de ejemplo como fallback
      setProductos([
        {
          idProducto: 1,
          nombreProducto: "Harina 0000",
          descripcion: "Harina de trigo 0000 para panadería",
          precioUnitario: 2.50,
          stockActual: 500,
          stockMinimo: 100,
          categoria: "Insumos",
          codigoProducto: "HAR001",
          unidadMedida: "Kg",
          activo: true,
          precioPuntos: 100,
          disponibleParaFacturacion: true,
          disponibleParaPedidos: true
        }
      ]);
      
      setCategorias([
        { id: 1, nombre: "Insumos" },
        { id: 2, nombre: "Productos Terminados" },
        { id: 3, nombre: "Servicios" },
        { id: 4, nombre: "Otros" }
      ]);
    }
    setIsLoading(false);
  }

  function abrirFormulario(producto = null) {
    if (producto) {
      setFormProducto({
        nombreProducto: producto.nombreProducto,
        descripcion: producto.descripcion,
        precioUnitario: producto.precioUnitario,
        stockActual: producto.stockActual,
        stockMinimo: producto.stockMinimo,
        categoria: producto.categoria,
        codigoProducto: producto.codigoProducto,
        unidadMedida: producto.unidadMedida,
        activo: producto.activo,
        precioPuntos: producto.precioPuntos,
        disponibleParaFacturacion: producto.disponibleParaFacturacion,
        disponibleParaPedidos: producto.disponibleParaPedidos
      });
      setSelectedProducto(producto);
    } else {
      setFormProducto({
        nombreProducto: "",
        descripcion: "",
        precioUnitario: 0,
        stockActual: 0,
        stockMinimo: 0,
        categoria: "",
        codigoProducto: "",
        unidadMedida: "Unidad",
        activo: true,
        precioPuntos: 0,
        disponibleParaFacturacion: true,
        disponibleParaPedidos: true
      });
      setSelectedProducto(null);
    }
    setShowFormModal(true);
  }

  async function guardarProducto() {
    if (!formProducto.nombreProducto.trim()) {
      setMessage("El nombre del producto es obligatorio");
      setShowModal(true);
      return;
    }

    if (formProducto.precioUnitario <= 0) {
      setMessage("El precio unitario debe ser mayor a 0");
      setShowModal(true);
      return;
    }

    setIsLoading(true);
    try {
      let response;
      
      if (selectedProducto) {
        // Actualizar producto existente
        response = await PATCH(`api/productos/${selectedProducto.idProducto}`, formProducto);
      } else {
        // Crear nuevo producto
        response = await POST("api/productos", formProducto);
      }
      
      if (response?.ok) {
        const data = await response.json();
        if (data.error === false) {
          setMessage(selectedProducto ? "Producto actualizado exitosamente" : "Producto creado exitosamente");
          setShowFormModal(false);
          cargarDatos(); // Recargar datos
        } else {
          setMessage(data.message || "Error al guardar el producto");
          setShowModal(true);
        }
      } else if (response?.status === 401) {
        setMessage("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
        setShowModal(true);
      } else {
        setMessage("Error al guardar el producto");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error al guardar producto:", error);
      setMessage("Error al guardar el producto");
      setShowModal(true);
    }
    setIsLoading(false);
  }

  function confirmarEliminar(producto) {
    setSelectedProducto(producto);
    setShowDeleteModal(true);
  }

  async function eliminarProducto() {
    if (!selectedProducto) return;

    setIsLoading(true);
    try {
      const response = await DELETE(`api/productos/${selectedProducto.idProducto}`);
      
      if (response?.ok) {
        const data = await response.json();
        if (data.error === false) {
          setMessage("Producto eliminado exitosamente");
          setShowDeleteModal(false);
          cargarDatos(); // Recargar datos
        } else {
          setMessage(data.message || "Error al eliminar el producto");
          setShowModal(true);
        }
      } else if (response?.status === 401) {
        setMessage("Sus credenciales han expirado. Por favor, inicie sesión nuevamente.");
        setTimeout(() => {
          navigate("/");
        }, 3000);
        setShowModal(true);
      } else {
        setMessage("Error al eliminar el producto");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      setMessage("Error al eliminar el producto");
      setShowModal(true);
    }
    setIsLoading(false);
  }

  // Filtrar productos
  const productosFiltrados = productos.filter(producto => {
    const cumpleBusqueda = producto.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          producto.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const cumpleCategoria = !filterCategoria || producto.categoria === filterCategoria;
    
    return cumpleBusqueda && cumpleCategoria;
  });

  function obtenerColorStock(stockActual, stockMinimo) {
    if (stockActual <= stockMinimo) return "danger";
    if (stockActual <= stockMinimo * 1.5) return "warning";
    return "success";
  }

  function obtenerColorEstado(activo) {
    return activo ? "success" : "secondary";
  }

  return (
    <div className="container">
      <div className="card-rounded">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Gestión de Productos</h2>
          <Button variant="success" onClick={() => abrirFormulario()}>
            <i className="fas fa-plus me-2"></i>
            Nuevo Producto
          </Button>
        </div>

        {/* Filtros */}
        <div className="row mb-4">
          <div className="col-md-6">
            <InputGroup>
              <InputGroup.Text>
                <i className="fas fa-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className="col-md-3">
            <Form.Select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-3">
            <Button variant="outline-secondary" onClick={cargarDatos}>
              <i className="fas fa-refresh me-2"></i>
              Actualizar
            </Button>
          </div>
        </div>

        {/* Tabla de productos */}
        {isLoading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Disponible para</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((producto) => (
                  <tr key={producto.idProducto}>
                    <td>
                      <strong>{producto.codigoProducto}</strong>
                    </td>
                    <td>
                      <div>
                        <strong>{producto.nombreProducto}</strong>
                        <br />
                        <small className="text-muted">{producto.descripcion}</small>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info">{producto.categoria}</Badge>
                    </td>
                    <td>
                      <div>
                        <strong>${producto.precioUnitario.toFixed(2)}</strong>
                        <br />
                        <small className="text-muted">por {producto.unidadMedida}</small>
                        {producto.precioPuntos > 0 && (
                          <>
                            <br />
                            <small className="text-warning">{producto.precioPuntos} pts</small>
                          </>
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge bg={obtenerColorStock(producto.stockActual, producto.stockMinimo)}>
                        {producto.stockActual} / {producto.stockMinimo}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={obtenerColorEstado(producto.activo)}>
                        {producto.activo ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td>
                      <div>
                        {producto.disponibleParaFacturacion && (
                          <Badge bg="success" className="me-1">Facturación</Badge>
                        )}
                        {producto.disponibleParaPedidos && (
                          <Badge bg="primary">Pedidos</Badge>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => abrirFormulario(producto)}
                          title="Editar"
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => confirmarEliminar(producto)}
                          title="Eliminar"
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {productosFiltrados.length === 0 && !isLoading && (
          <div className="text-center py-4">
            <i className="fas fa-box fa-3x text-muted mb-3"></i>
            <p className="text-muted">No se encontraron productos</p>
          </div>
        )}
      </div>

      {/* Modal de mensajes */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de formulario */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedProducto ? "Editar Producto" : "Nuevo Producto"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Producto *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formProducto.nombreProducto}
                    onChange={(e) => setFormProducto({...formProducto, nombreProducto: e.target.value})}
                    placeholder="Ej: Harina 0000"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Código del Producto</Form.Label>
                  <Form.Control
                    type="text"
                    value={formProducto.codigoProducto}
                    onChange={(e) => setFormProducto({...formProducto, codigoProducto: e.target.value})}
                    placeholder="Ej: HAR001"
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formProducto.descripcion}
                onChange={(e) => setFormProducto({...formProducto, descripcion: e.target.value})}
                placeholder="Descripción detallada del producto"
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Categoría</Form.Label>
                  <Form.Select
                    value={formProducto.categoria}
                    onChange={(e) => setFormProducto({...formProducto, categoria: e.target.value})}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.map(cat => (
                      <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Unidad de Medida</Form.Label>
                  <Form.Select
                    value={formProducto.unidadMedida}
                    onChange={(e) => setFormProducto({...formProducto, unidadMedida: e.target.value})}
                  >
                    <option value="Unidad">Unidad</option>
                    <option value="Kg">Kilogramo</option>
                    <option value="Litro">Litro</option>
                    <option value="Metro">Metro</option>
                    <option value="Hora">Hora</option>
                    <option value="Servicio">Servicio</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Precio Unitario *</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    min="0"
                    value={formProducto.precioUnitario}
                    onChange={(e) => setFormProducto({...formProducto, precioUnitario: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Stock Actual</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={formProducto.stockActual}
                    onChange={(e) => setFormProducto({...formProducto, stockActual: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Stock Mínimo</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={formProducto.stockMinimo}
                    onChange={(e) => setFormProducto({...formProducto, stockMinimo: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Precio en Puntos</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={formProducto.precioPuntos}
                    onChange={(e) => setFormProducto({...formProducto, precioPuntos: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Producto Activo"
                    checked={formProducto.activo}
                    onChange={(e) => setFormProducto({...formProducto, activo: e.target.checked})}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Disponible para Facturación"
                    checked={formProducto.disponibleParaFacturacion}
                    onChange={(e) => setFormProducto({...formProducto, disponibleParaFacturacion: e.target.checked})}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Disponible para Pedidos"
                checked={formProducto.disponibleParaPedidos}
                onChange={(e) => setFormProducto({...formProducto, disponibleParaPedidos: e.target.checked})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFormModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={guardarProducto}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Guardando...
              </>
            ) : (
              selectedProducto ? "Actualizar" : "Crear"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación de eliminación */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Está seguro que desea eliminar el producto "{selectedProducto?.nombreProducto}"?
          <br />
          <small className="text-danger">Esta acción no se puede deshacer.</small>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={eliminarProducto}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
} 