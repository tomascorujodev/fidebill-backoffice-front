-- =====================================================
-- SCRIPT DE BASE DE DATOS PARA FACTURACIÓN ELECTRÓNICA
-- Sistema Fidebill - Integración con AFIP/ARCA
-- =====================================================

-- Crear base de datos (descomentar si es necesario)
-- CREATE DATABASE fidebill_facturacion;
-- USE fidebill_facturacion;

-- =====================================================
-- TABLA DE CONFIGURACIÓN DEL SISTEMA
-- =====================================================
CREATE TABLE configuracion_sistema (
    id INT PRIMARY KEY AUTO_INCREMENT,
    clave VARCHAR(100) NOT NULL UNIQUE,
    valor TEXT,
    descripcion VARCHAR(255),
    tipo_dato ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA DE CERTIFICADOS DIGITALES
-- =====================================================
CREATE TABLE certificados_digitales (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    cuit VARCHAR(11) NOT NULL,
    certificado_pem LONGTEXT NOT NULL,
    clave_privada_pem LONGTEXT NOT NULL,
    passphrase VARCHAR(255),
    ambiente ENUM('testing', 'production') DEFAULT 'testing',
    fecha_vencimiento DATE NOT NULL,
    estado ENUM('activo', 'inactivo', 'expirado') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cuit (cuit),
    INDEX idx_ambiente (ambiente),
    INDEX idx_estado (estado)
);

-- =====================================================
-- TABLA DE TICKETS DE ACCESO (WSAA)
-- =====================================================
CREATE TABLE tickets_acceso (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cuit VARCHAR(11) NOT NULL,
    servicio VARCHAR(50) NOT NULL,
    token TEXT NOT NULL,
    sign TEXT NOT NULL,
    fecha_generacion TIMESTAMP NOT NULL,
    fecha_expiracion TIMESTAMP NOT NULL,
    ambiente ENUM('testing', 'production') DEFAULT 'testing',
    estado ENUM('activo', 'expirado') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cuit_servicio (cuit, servicio),
    INDEX idx_fecha_expiracion (fecha_expiracion),
    INDEX idx_estado (estado)
);

-- =====================================================
-- TABLA DE TIPOS DE CLIENTE
-- =====================================================
CREATE TABLE tipos_cliente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA DE CLIENTES
-- =====================================================
CREATE TABLE clientes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_documento INT NOT NULL,
    numero_documento VARCHAR(20) NOT NULL,
    razon_social VARCHAR(255) NOT NULL,
    nombre_fantasia VARCHAR(255),
    condicion_iva VARCHAR(100),
    domicilio_fiscal TEXT,
    email VARCHAR(255),
    telefono VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_documento (tipo_documento, numero_documento),
    INDEX idx_razon_social (razon_social),
    INDEX idx_activo (activo)
);

-- =====================================================
-- TABLA DE VENDEDORES
-- =====================================================
CREATE TABLE vendedores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    telefono VARCHAR(50),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre_apellido (nombre, apellido),
    INDEX idx_activo (activo)
);

-- =====================================================
-- TABLA DE PRODUCTOS
-- =====================================================
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(15,2) NOT NULL,
    precio_con_iva DECIMAL(15,2) NOT NULL,
    stock INT DEFAULT 0,
    categoria VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo (codigo),
    INDEX idx_nombre (nombre),
    INDEX idx_activo (activo)
);

-- =====================================================
-- TABLA DE PUNTOS DE VENTA
-- =====================================================
CREATE TABLE puntos_venta (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero INT NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_numero (numero),
    INDEX idx_activo (activo)
);

-- =====================================================
-- TABLA DE FACTURAS
-- =====================================================
CREATE TABLE facturas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    numero_comprobante INT NOT NULL,
    punto_venta INT NOT NULL,
    tipo_comprobante INT NOT NULL,
    cuit_emisor VARCHAR(11) NOT NULL,
    cliente_id INT NOT NULL,
    vendedor_id INT,
    fecha_comprobante DATE NOT NULL,
    fecha_servicio DATE NOT NULL,
    fecha_vencimiento_pago DATE NOT NULL,
    concepto INT NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL,
    total_iva DECIMAL(15,2) NOT NULL,
    total_tributos DECIMAL(15,2) DEFAULT 0,
    total_final DECIMAL(15,2) NOT NULL,
    moneda VARCHAR(3) DEFAULT 'PES',
    cotizacion_moneda DECIMAL(10,4) DEFAULT 1,
    estado ENUM('borrador', 'pendiente_cae', 'autorizada', 'rechazada', 'anulada') DEFAULT 'borrador',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (vendedor_id) REFERENCES vendedores(id),
    UNIQUE KEY uk_comprobante (punto_venta, numero_comprobante, tipo_comprobante),
    INDEX idx_fecha_comprobante (fecha_comprobante),
    INDEX idx_estado (estado),
    INDEX idx_cuit_emisor (cuit_emisor)
);

-- =====================================================
-- TABLA DE DETALLES DE FACTURA
-- =====================================================
CREATE TABLE factura_detalles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    factura_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(15,2) NOT NULL,
    descuento_porcentaje DECIMAL(5,2) DEFAULT 0,
    subtotal DECIMAL(15,2) NOT NULL,
    iva_porcentaje DECIMAL(5,2) DEFAULT 21,
    iva_monto DECIMAL(15,2) NOT NULL,
    total_linea DECIMAL(15,2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    INDEX idx_factura_id (factura_id)
);

-- =====================================================
-- TABLA DE CAE (CÓDIGOS DE AUTORIZACIÓN ELECTRÓNICO)
-- =====================================================
CREATE TABLE cae (
    id INT PRIMARY KEY AUTO_INCREMENT,
    factura_id INT NOT NULL,
    cae VARCHAR(14) NOT NULL,
    fecha_vencimiento_cae DATE NOT NULL,
    resultado VARCHAR(10) NOT NULL,
    observaciones TEXT,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (factura_id) REFERENCES facturas(id),
    UNIQUE KEY uk_cae (cae),
    INDEX idx_factura_id (factura_id),
    INDEX idx_fecha_vencimiento (fecha_vencimiento_cae)
);

-- =====================================================
-- TABLA DE IVA DE FACTURAS
-- =====================================================
CREATE TABLE factura_iva (
    id INT PRIMARY KEY AUTO_INCREMENT,
    factura_id INT NOT NULL,
    tipo_iva INT NOT NULL,
    base_imponible DECIMAL(15,2) NOT NULL,
    importe DECIMAL(15,2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE CASCADE,
    INDEX idx_factura_id (factura_id)
);

-- =====================================================
-- TABLA DE TRIBUTOS DE FACTURAS
-- =====================================================
CREATE TABLE factura_tributos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    factura_id INT NOT NULL,
    tipo_tributo INT NOT NULL,
    descripcion VARCHAR(255),
    base_imponible DECIMAL(15,2) NOT NULL,
    alicuota DECIMAL(5,2) NOT NULL,
    importe DECIMAL(15,2) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (factura_id) REFERENCES facturas(id) ON DELETE CASCADE,
    INDEX idx_factura_id (factura_id)
);

-- =====================================================
-- TABLA DE LOGS DE TRANSACCIONES AFIP
-- =====================================================
CREATE TABLE logs_afip (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_operacion ENUM('wsaa_login', 'wsfe_solicitar_cae', 'wsfe_consultar', 'error') NOT NULL,
    cuit VARCHAR(11) NOT NULL,
    request_data LONGTEXT,
    response_data LONGTEXT,
    estado ENUM('exitoso', 'error', 'pendiente') NOT NULL,
    mensaje_error TEXT,
    fecha_operacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_tipo_operacion (tipo_operacion),
    INDEX idx_cuit (cuit),
    INDEX idx_fecha_operacion (fecha_operacion),
    INDEX idx_estado (estado)
);

-- =====================================================
-- TABLA DE CONFIGURACIÓN DE IVA
-- =====================================================
CREATE TABLE configuracion_iva (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo INT NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    alicuota DECIMAL(5,2) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABLA DE CONFIGURACIÓN DE TRIBUTOS
-- =====================================================
CREATE TABLE configuracion_tributos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo INT NOT NULL UNIQUE,
    descripcion VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INSERCIÓN DE DATOS INICIALES
-- =====================================================

-- Configuración del sistema
INSERT INTO configuracion_sistema (clave, valor, descripcion, tipo_dato) VALUES
('ambiente_afip', 'testing', 'Ambiente de AFIP (testing/production)', 'string'),
('cuit_emisor', '20123456789', 'CUIT del emisor de facturas', 'string'),
('punto_venta_default', '1', 'Punto de venta por defecto', 'number'),
('moneda_default', 'PES', 'Moneda por defecto', 'string'),
('cotizacion_default', '1', 'Cotización de moneda por defecto', 'number');

-- Tipos de cliente
INSERT INTO tipos_cliente (codigo, nombre, descripcion) VALUES
('CF', 'Consumidor Final', 'Cliente consumidor final'),
('RI', 'Responsable Inscripto', 'Cliente responsable inscripto'),
('EX', 'Exento', 'Cliente exento de IVA'),
('MT', 'Monotributista', 'Cliente monotributista');

-- Vendedores de ejemplo
INSERT INTO vendedores (nombre, apellido, email, telefono) VALUES
('Juan', 'Pérez', 'juan.perez@empresa.com', '11-1234-5678'),
('María', 'González', 'maria.gonzalez@empresa.com', '11-2345-6789'),
('Carlos', 'López', 'carlos.lopez@empresa.com', '11-3456-7890');

-- Puntos de venta
INSERT INTO puntos_venta (numero, descripcion) VALUES
(1, 'Punto de Venta Principal'),
(2, 'Punto de Venta Secundario'),
(3, 'Punto de Venta Online');

-- Configuración de IVA
INSERT INTO configuracion_iva (codigo, descripcion, alicuota) VALUES
(1, 'No Gravado', 0.00),
(2, 'Exento', 0.00),
(3, '0%', 0.00),
(4, '10.5%', 10.50),
(5, '21%', 21.00),
(6, '27%', 27.00);

-- Configuración de tributos
INSERT INTO configuracion_tributos (codigo, descripcion) VALUES
(1, 'Impuestos Nacionales'),
(2, 'Impuestos Provinciales'),
(3, 'Impuestos Municipales'),
(4, 'Percepciones de IVA'),
(5, 'Percepciones de IIBB'),
(6, 'Percepciones Municipales'),
(7, 'Impuestos Internos'),
(99, 'Otros');

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de facturas con información completa
CREATE VIEW v_facturas_completas AS
SELECT 
    f.id,
    f.numero_comprobante,
    f.punto_venta,
    f.tipo_comprobante,
    f.cuit_emisor,
    c.razon_social as cliente_razon_social,
    c.numero_documento as cliente_documento,
    CONCAT(v.nombre, ' ', v.apellido) as vendedor_nombre,
    f.fecha_comprobante,
    f.fecha_servicio,
    f.fecha_vencimiento_pago,
    f.subtotal,
    f.total_iva,
    f.total_tributos,
    f.total_final,
    f.estado,
    cae.cae,
    cae.fecha_vencimiento_cae,
    cae.resultado as cae_resultado
FROM facturas f
LEFT JOIN clientes c ON f.cliente_id = c.id
LEFT JOIN vendedores v ON f.vendedor_id = v.id
LEFT JOIN cae ON f.id = cae.factura_id;

-- Vista de productos con stock
CREATE VIEW v_productos_stock AS
SELECT 
    p.id,
    p.codigo,
    p.nombre,
    p.descripcion,
    p.precio,
    p.precio_con_iva,
    p.stock,
    p.categoria,
    p.activo,
    CASE 
        WHEN p.stock > 0 THEN 'Disponible'
        WHEN p.stock = 0 THEN 'Sin Stock'
        ELSE 'Agotado'
    END as estado_stock
FROM productos p;

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS ÚTILES
-- =====================================================

DELIMITER //

-- Procedimiento para obtener el siguiente número de comprobante
CREATE PROCEDURE sp_obtener_siguiente_comprobante(
    IN p_punto_venta INT,
    IN p_tipo_comprobante INT,
    OUT p_siguiente_numero INT
)
BEGIN
    SELECT COALESCE(MAX(numero_comprobante), 0) + 1 
    INTO p_siguiente_numero
    FROM facturas 
    WHERE punto_venta = p_punto_venta 
    AND tipo_comprobante = p_tipo_comprobante;
END //

-- Procedimiento para limpiar tickets expirados
CREATE PROCEDURE sp_limpiar_tickets_expirados()
BEGIN
    UPDATE tickets_acceso 
    SET estado = 'expirado' 
    WHERE fecha_expiracion < NOW() 
    AND estado = 'activo';
END //

-- Procedimiento para obtener estadísticas de facturación
CREATE PROCEDURE sp_estadisticas_facturacion(
    IN p_fecha_desde DATE,
    IN p_fecha_hasta DATE
)
BEGIN
    SELECT 
        COUNT(*) as total_facturas,
        SUM(total_final) as monto_total,
        AVG(total_final) as promedio_factura,
        COUNT(CASE WHEN estado = 'autorizada' THEN 1 END) as facturas_autorizadas,
        COUNT(CASE WHEN estado = 'rechazada' THEN 1 END) as facturas_rechazadas
    FROM facturas 
    WHERE fecha_comprobante BETWEEN p_fecha_desde AND p_fecha_hasta;
END //

DELIMITER ;

-- =====================================================
-- TRIGGERS ÚTILES
-- =====================================================

DELIMITER //

-- Trigger para actualizar stock al crear factura
CREATE TRIGGER tr_actualizar_stock_factura
AFTER INSERT ON factura_detalles
FOR EACH ROW
BEGIN
    UPDATE productos 
    SET stock = stock - NEW.cantidad 
    WHERE id = NEW.producto_id;
END //

-- Trigger para actualizar fecha_modificacion
CREATE TRIGGER tr_actualizar_fecha_modificacion_facturas
BEFORE UPDATE ON facturas
FOR EACH ROW
BEGIN
    SET NEW.fecha_modificacion = CURRENT_TIMESTAMP;
END //

DELIMITER ;

-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para búsquedas frecuentes
CREATE INDEX idx_facturas_fecha_estado ON facturas(fecha_comprobante, estado);
CREATE INDEX idx_facturas_cliente_fecha ON facturas(cliente_id, fecha_comprobante);
CREATE INDEX idx_productos_categoria_activo ON productos(categoria, activo);
CREATE INDEX idx_clientes_tipo_documento ON clientes(tipo_documento, numero_documento);

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================

/*
ESTRUCTURA DE LA BASE DE DATOS COMPLETADA

Esta base de datos incluye:

1. Configuración del sistema
2. Gestión de certificados digitales
3. Cache de tickets de acceso WSAA
4. Gestión de clientes y vendedores
5. Catálogo de productos
6. Sistema completo de facturación
7. Gestión de CAE
8. Logs de transacciones AFIP
9. Configuración de IVA y tributos
10. Vistas y procedimientos útiles
11. Triggers para automatización
12. Índices para optimización

Para usar en producción:
1. Ajustar los tipos de datos según necesidades
2. Configurar backup automático
3. Establecer políticas de retención de logs
4. Configurar usuarios y permisos
5. Optimizar índices según uso real
*/ 