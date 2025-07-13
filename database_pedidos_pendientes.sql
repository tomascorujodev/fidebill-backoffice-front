-- =====================================================
-- SCRIPT DE CREACIÓN DE TABLAS PARA PEDIDOS PENDIENTES
-- =====================================================

-- Tabla de Proveedores
CREATE TABLE IF NOT EXISTS proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_proveedor VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    dias_espera_pago INT DEFAULT 30,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Sucursales
CREATE TABLE IF NOT EXISTS sucursales (
    id_sucursal INT AUTO_INCREMENT PRIMARY KEY,
    nombre_sucursal VARCHAR(100) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_unitario DECIMAL(10,2) DEFAULT 0,
    stock_actual INT DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Pedidos de Proveedores
CREATE TABLE IF NOT EXISTS pedidos_proveedores (
    id_pedido_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    id_proveedor INT NOT NULL,
    monto_total DECIMAL(12,2) NOT NULL,
    medio_pago ENUM('Efectivo', 'Transferencia', 'Cheque', 'Tarjeta') DEFAULT 'Efectivo',
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_estimada_ingreso DATE,
    id_sucursal INT,
    dias_espera_pago INT DEFAULT 30,
    estado ENUM('Sin enviar', 'Enviado', 'Ingresado', 'No ingresado') DEFAULT 'Sin enviar',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);

-- Tabla de Detalles de Pedidos de Proveedores
CREATE TABLE IF NOT EXISTS detalles_pedidos_proveedores (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido_proveedor INT NOT NULL,
    nombre_producto VARCHAR(100) NOT NULL,
    kilos DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    stock_deseado INT DEFAULT 0,
    subtotal DECIMAL(12,2) NOT NULL,
    
    FOREIGN KEY (id_pedido_proveedor) REFERENCES pedidos_proveedores(id_pedido_proveedor) ON DELETE CASCADE
);

-- Tabla de Pedidos de Clientes
CREATE TABLE IF NOT EXISTS pedidos_clientes (
    id_pedido_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_cliente VARCHAR(100) NOT NULL,
    fecha_pedido DATE NOT NULL,
    telefono VARCHAR(20),
    producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    pagado BOOLEAN DEFAULT FALSE,
    encargado VARCHAR(100),
    modo_pago ENUM('Efectivo', 'Tarjeta', 'Transferencia') DEFAULT 'Efectivo',
    medio_venta ENUM('Local', 'Delivery', 'WhatsApp') DEFAULT 'Local',
    estado ENUM('Pendiente', 'En proceso', 'Completado', 'Cancelado') DEFAULT 'Pendiente',
    monto_total DECIMAL(10,2) DEFAULT 0,
    fecha_entrega_estimada DATE,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Pagos Pendientes de Proveedores
CREATE TABLE IF NOT EXISTS pagos_pendientes_proveedores (
    id_pago_pendiente INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido_proveedor INT NOT NULL,
    numero_factura VARCHAR(50),
    monto_factura DECIMAL(12,2) NOT NULL,
    fecha_factura DATE,
    fecha_vencimiento_pago DATE NOT NULL,
    estado ENUM('Pendiente', 'Pagado', 'Vencido') DEFAULT 'Pendiente',
    fecha_pago DATE,
    medio_pago ENUM('Efectivo', 'Transferencia', 'Cheque', 'Tarjeta'),
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_pedido_proveedor) REFERENCES pedidos_proveedores(id_pedido_proveedor)
);

-- =====================================================
-- INSERCIÓN DE DATOS DE EJEMPLO
-- =====================================================

-- Insertar proveedores de ejemplo
INSERT INTO proveedores (nombre_proveedor, telefono, email, direccion, dias_espera_pago) VALUES
('Distribuidora Handler', '11-1234-5678', 'handler@email.com', 'Av. Corrientes 1234, CABA', 30),
('Carnes Premium S.A.', '11-9876-5432', 'carnes@premium.com', 'Ruta 9 Km 25, Pilar', 15),
('Lácteos del Sur', '11-5555-1234', 'lacteos@surdelsur.com', 'San Martín 567, La Plata', 20),
('Frutas y Verduras Frescas', '11-4444-5678', 'frutas@frescas.com', 'Belgrano 890, Rosario', 7);

-- Insertar sucursales de ejemplo
INSERT INTO sucursales (nombre_sucursal, direccion, telefono) VALUES
('Sucursal Centro', 'Av. 9 de Julio 1500, CABA', '11-4000-1000'),
('Sucursal Norte', 'Av. Santa Fe 2500, CABA', '11-4000-2000'),
('Sucursal Sur', 'Av. San Juan 1800, CABA', '11-4000-3000'),
('Sucursal Oeste', 'Av. Rivadavia 4500, CABA', '11-4000-4000');

-- Insertar productos de ejemplo
INSERT INTO productos (nombre_producto, descripcion, precio_unitario, stock_actual, stock_minimo) VALUES
('Harina 0000', 'Harina de trigo 0000 para panadería', 2.50, 500, 100),
('Aceite de Oliva', 'Aceite de oliva extra virgen', 8.00, 200, 50),
('Carne Vacuna', 'Carne vacuna de primera calidad', 12.00, 300, 100),
('Leche Entera', 'Leche entera pasteurizada', 1.80, 400, 80),
('Huevos', 'Huevos frescos de gallina', 0.50, 1000, 200),
('Queso Cremoso', 'Queso cremoso para pizza', 4.50, 150, 30);

-- Insertar pedidos de proveedores de ejemplo
INSERT INTO pedidos_proveedores (id_proveedor, monto_total, medio_pago, fecha_estimada_ingreso, id_sucursal, dias_espera_pago, estado) VALUES
(1, 650.00, 'Transferencia', '2024-02-15', 1, 30, 'Sin enviar'),
(2, 2400.00, 'Efectivo', '2024-02-10', 2, 15, 'Enviado'),
(3, 1200.00, 'Cheque', '2024-02-20', 1, 20, 'Sin enviar'),
(4, 800.00, 'Transferencia', '2024-02-12', 3, 7, 'Ingresado');

-- Insertar detalles de pedidos de proveedores
INSERT INTO detalles_pedidos_proveedores (id_pedido_proveedor, nombre_producto, kilos, precio_unitario, stock_deseado, subtotal) VALUES
(1, 'Harina 0000', 100.00, 2.50, 200, 250.00),
(1, 'Aceite de Oliva', 50.00, 8.00, 100, 400.00),
(2, 'Carne Vacuna', 200.00, 12.00, 300, 2400.00),
(3, 'Leche Entera', 300.00, 1.80, 400, 540.00),
(3, 'Queso Cremoso', 100.00, 4.50, 150, 450.00),
(4, 'Huevos', 1000.00, 0.50, 1000, 500.00),
(4, 'Frutas Variadas', 150.00, 2.00, 200, 300.00);

-- Insertar pedidos de clientes de ejemplo
INSERT INTO pedidos_clientes (nombre_cliente, fecha_pedido, telefono, producto, descripcion, pagado, encargado, modo_pago, medio_venta, estado, monto_total) VALUES
('María González', '2024-02-01', '11-1234-5678', 'Torta de Chocolate', 'Torta de chocolate con decoración especial para cumpleaños', TRUE, 'Juan Pérez', 'Tarjeta', 'WhatsApp', 'Pendiente', 2500.00),
('Carlos Rodríguez', '2024-02-02', '11-9876-5432', 'Pizza Familiar', 'Pizza familiar con extra queso y pepperoni', FALSE, 'Ana López', 'Efectivo', 'Local', 'Completado', 1800.00),
('Laura Martínez', '2024-02-03', '11-5555-1234', 'Catering Empresarial', 'Catering para 50 personas con variedad de sandwiches y bebidas', TRUE, 'María García', 'Transferencia', 'WhatsApp', 'En proceso', 15000.00),
('Roberto Silva', '2024-02-04', '11-4444-5678', 'Pastelitos', '2 docenas de pastelitos de membrillo y batata', FALSE, 'Carlos Ruiz', 'Efectivo', 'Delivery', 'Pendiente', 1200.00);

-- Insertar pagos pendientes de ejemplo
INSERT INTO pagos_pendientes_proveedores (id_pedido_proveedor, numero_factura, monto_factura, fecha_factura, fecha_vencimiento_pago, estado) VALUES
(1, 'FAC-001-2024', 650.00, '2024-02-01', '2024-03-03', 'Pendiente'),
(2, 'FAC-002-2024', 2400.00, '2024-02-05', '2024-02-20', 'Pendiente'),
(3, 'FAC-003-2024', 1200.00, '2024-02-03', '2024-02-23', 'Pendiente'),
(4, 'FAC-004-2024', 800.00, '2024-02-02', '2024-02-09', 'Pagado');

-- =====================================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS
-- =====================================================

-- Índices para pedidos_proveedores
CREATE INDEX idx_pedidos_proveedores_estado ON pedidos_proveedores(estado);
CREATE INDEX idx_pedidos_proveedores_fecha ON pedidos_proveedores(fecha_estimada_ingreso);
CREATE INDEX idx_pedidos_proveedores_proveedor ON pedidos_proveedores(id_proveedor);

-- Índices para pedidos_clientes
CREATE INDEX idx_pedidos_clientes_estado ON pedidos_clientes(estado);
CREATE INDEX idx_pedidos_clientes_fecha ON pedidos_clientes(fecha_pedido);
CREATE INDEX idx_pedidos_clientes_pagado ON pedidos_clientes(pagado);

-- Índices para pagos_pendientes_proveedores
CREATE INDEX idx_pagos_pendientes_estado ON pagos_pendientes_proveedores(estado);
CREATE INDEX idx_pagos_pendientes_vencimiento ON pagos_pendientes_proveedores(fecha_vencimiento_pago);

-- =====================================================
-- VISTAS ÚTILES PARA CONSULTAS FRECUENTES
-- =====================================================

-- Vista de pedidos de proveedores con información completa
CREATE VIEW v_pedidos_proveedores_completo AS
SELECT 
    pp.id_pedido_proveedor,
    p.nombre_proveedor,
    pp.monto_total,
    pp.medio_pago,
    pp.fecha_pedido,
    pp.fecha_estimada_ingreso,
    s.nombre_sucursal,
    pp.dias_espera_pago,
    pp.estado,
    DATEDIFF(pp.fecha_estimada_ingreso, CURDATE()) as dias_restantes
FROM pedidos_proveedores pp
JOIN proveedores p ON pp.id_proveedor = p.id_proveedor
LEFT JOIN sucursales s ON pp.id_sucursal = s.id_sucursal;

-- Vista de pagos pendientes con información del proveedor
CREATE VIEW v_pagos_pendientes_completo AS
SELECT 
    ppp.id_pago_pendiente,
    p.nombre_proveedor,
    ppp.numero_factura,
    ppp.monto_factura,
    ppp.fecha_factura,
    ppp.fecha_vencimiento_pago,
    ppp.estado,
    DATEDIFF(ppp.fecha_vencimiento_pago, CURDATE()) as dias_para_vencer
FROM pagos_pendientes_proveedores ppp
JOIN pedidos_proveedores pp ON ppp.id_pedido_proveedor = pp.id_pedido_proveedor
JOIN proveedores p ON pp.id_proveedor = p.id_proveedor;

-- Vista de productos con stock bajo
CREATE VIEW v_productos_stock_bajo AS
SELECT 
    id_producto,
    nombre_producto,
    stock_actual,
    stock_minimo,
    (stock_minimo - stock_actual) as faltante
FROM productos 
WHERE stock_actual <= stock_minimo AND activo = TRUE;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- =====================================================

-- Procedimiento para crear un pedido de proveedor
DELIMITER //
CREATE PROCEDURE sp_crear_pedido_proveedor(
    IN p_id_proveedor INT,
    IN p_monto_total DECIMAL(12,2),
    IN p_medio_pago VARCHAR(20),
    IN p_fecha_estimada_ingreso DATE,
    IN p_id_sucursal INT,
    IN p_dias_espera_pago INT,
    IN p_observaciones TEXT
)
BEGIN
    INSERT INTO pedidos_proveedores (
        id_proveedor, 
        monto_total, 
        medio_pago, 
        fecha_estimada_ingreso, 
        id_sucursal, 
        dias_espera_pago, 
        observaciones
    ) VALUES (
        p_id_proveedor,
        p_monto_total,
        p_medio_pago,
        p_fecha_estimada_ingreso,
        p_id_sucursal,
        p_dias_espera_pago,
        p_observaciones
    );
    
    SELECT LAST_INSERT_ID() as id_pedido_creado;
END //
DELIMITER ;

-- Procedimiento para actualizar estado de pedido
DELIMITER //
CREATE PROCEDURE sp_actualizar_estado_pedido(
    IN p_id_pedido INT,
    IN p_estado VARCHAR(20),
    IN p_tipo_pedido ENUM('proveedor', 'cliente')
)
BEGIN
    IF p_tipo_pedido = 'proveedor' THEN
        UPDATE pedidos_proveedores 
        SET estado = p_estado, 
            fecha_modificacion = CURRENT_TIMESTAMP 
        WHERE id_pedido_proveedor = p_id_pedido;
    ELSE
        UPDATE pedidos_clientes 
        SET estado = p_estado, 
            fecha_modificacion = CURRENT_TIMESTAMP 
        WHERE id_pedido_cliente = p_id_pedido;
    END IF;
END //
DELIMITER ;

-- Procedimiento para generar pagos pendientes automáticamente
DELIMITER //
CREATE PROCEDURE sp_generar_pagos_pendientes()
BEGIN
    INSERT INTO pagos_pendientes_proveedores (
        id_pedido_proveedor,
        numero_factura,
        monto_factura,
        fecha_factura,
        fecha_vencimiento_pago,
        estado
    )
    SELECT 
        pp.id_pedido_proveedor,
        CONCAT('FAC-', LPAD(pp.id_pedido_proveedor, 3, '0'), '-', YEAR(CURDATE())),
        pp.monto_total,
        pp.fecha_pedido,
        DATE_ADD(pp.fecha_pedido, INTERVAL pp.dias_espera_pago DAY),
        'Pendiente'
    FROM pedidos_proveedores pp
    WHERE pp.estado = 'Ingresado'
    AND NOT EXISTS (
        SELECT 1 FROM pagos_pendientes_proveedores ppp 
        WHERE ppp.id_pedido_proveedor = pp.id_pedido_proveedor
    );
END //
DELIMITER ;

-- =====================================================
-- TRIGGERS PARA MANTENER INTEGRIDAD
-- =====================================================

-- Trigger para actualizar fecha_modificacion automáticamente
DELIMITER //
CREATE TRIGGER tr_pedidos_proveedores_update 
BEFORE UPDATE ON pedidos_proveedores
FOR EACH ROW
BEGIN
    SET NEW.fecha_modificacion = CURRENT_TIMESTAMP;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER tr_pedidos_clientes_update 
BEFORE UPDATE ON pedidos_clientes
FOR EACH ROW
BEGIN
    SET NEW.fecha_modificacion = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger para calcular subtotal automáticamente en detalles
DELIMITER //
CREATE TRIGGER tr_detalles_pedidos_proveedores_insert 
BEFORE INSERT ON detalles_pedidos_proveedores
FOR EACH ROW
BEGIN
    SET NEW.subtotal = NEW.kilos * NEW.precio_unitario;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER tr_detalles_pedidos_proveedores_update 
BEFORE UPDATE ON detalles_pedidos_proveedores
FOR EACH ROW
BEGIN
    SET NEW.subtotal = NEW.kilos * NEW.precio_unitario;
END //
DELIMITER ;

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================

/*
ESTRUCTURA DE LA BASE DE DATOS PARA PEDIDOS PENDIENTES

TABLAS PRINCIPALES:
- proveedores: Información de proveedores
- sucursales: Sucursales de la empresa
- productos: Catálogo de productos
- pedidos_proveedores: Pedidos a proveedores
- detalles_pedidos_proveedores: Detalle de productos en cada pedido
- pedidos_clientes: Pedidos de clientes
- pagos_pendientes_proveedores: Control de pagos pendientes

CARACTERÍSTICAS:
- Control de estados de pedidos
- Cálculo automático de días restantes
- Gestión de pagos pendientes
- Índices optimizados para consultas frecuentes
- Vistas para consultas complejas
- Procedimientos almacenados para operaciones comunes
- Triggers para mantener integridad de datos

PARA USAR CON EL FRONTEND:
1. Ejecutar este script completo
2. Los datos de ejemplo permitirán probar la funcionalidad
3. Las vistas facilitarán las consultas desde el frontend
4. Los procedimientos almacenados optimizarán las operaciones
*/ 