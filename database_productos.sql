-- =====================================================
-- SCRIPT DE CREACIÓN DE TABLAS PARA PRODUCTOS
-- =====================================================

-- Tabla de Categorías de Productos
CREATE TABLE IF NOT EXISTS categorias_productos (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla de Productos (actualizada)
CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio_unitario DECIMAL(12,2) NOT NULL DEFAULT 0,
    stock_actual INT DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    categoria VARCHAR(100),
    codigo_producto VARCHAR(50) UNIQUE,
    unidad_medida ENUM('Unidad', 'Kg', 'Litro', 'Metro', 'Hora', 'Servicio') DEFAULT 'Unidad',
    activo BOOLEAN DEFAULT TRUE,
    disponible_para_facturacion BOOLEAN DEFAULT TRUE,
    disponible_para_pedidos BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_productos_activo (activo),
    INDEX idx_productos_categoria (categoria),
    INDEX idx_productos_codigo (codigo_producto),
    INDEX idx_productos_facturacion (disponible_para_facturacion),
    INDEX idx_productos_pedidos (disponible_para_pedidos)
);

-- Eliminar columna de puntos si existe
ALTER TABLE productos DROP COLUMN IF EXISTS PrecioPuntos;

-- Agregar columnas de costo y margen de ganancia
ALTER TABLE productos 
ADD COLUMN Costo DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN MargenGanancia DECIMAL(5,2) NOT NULL DEFAULT 0;

-- Tabla de Historial de Stock
CREATE TABLE IF NOT EXISTS historial_stock (
    id_historial INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NOT NULL,
    stock_anterior INT NOT NULL,
    stock_nuevo INT NOT NULL,
    tipo_movimiento ENUM('Entrada', 'Salida', 'Ajuste', 'Venta', 'Pedido') NOT NULL,
    cantidad_movida INT NOT NULL,
    motivo TEXT,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    usuario_responsable VARCHAR(100),
    
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE,
    INDEX idx_historial_producto (id_producto),
    INDEX idx_historial_fecha (fecha_movimiento),
    INDEX idx_historial_tipo (tipo_movimiento)
);

-- Tabla de categorías (si no existe)
CREATE TABLE IF NOT EXISTS categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla de familias
CREATE TABLE IF NOT EXISTS familias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    categoria_id INT NOT NULL,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Modificación de la tabla productos
ALTER TABLE productos 
ADD COLUMN familia_id INT NULL,
ADD CONSTRAINT fk_familia_id FOREIGN KEY (familia_id) REFERENCES familias(id);

-- Ejemplo de inserción de categorías
INSERT INTO categorias (nombre) VALUES ('Bebidas'), ('Snacks');

-- Ejemplo de inserción de familias
INSERT INTO familias (nombre, categoria_id) VALUES ('Coca Cola', 1), ('Pepsi', 1), ('Lay''s', 2);

-- Ejemplo de inserción de producto con familia
-- INSERT INTO productos (nombre, categoria_id, familia_id, ...) VALUES ('Coca Cola 500ml', 1, 1, ...);

-- =====================================================
-- INSERCIÓN DE DATOS DE EJEMPLO
-- =====================================================

-- Insertar categorías de ejemplo
INSERT INTO categorias_productos (nombre, descripcion) VALUES
('Insumos', 'Materias primas y productos básicos para elaboración'),
('Productos Terminados', 'Productos listos para la venta'),
('Servicios', 'Servicios prestados a clientes'),
('Equipamiento', 'Herramientas y equipos'),
('Otros', 'Otros productos diversos');

-- Insertar productos de ejemplo
INSERT INTO productos (
    nombre_producto, 
    descripcion, 
    precio_unitario, 
    stock_actual, 
    stock_minimo, 
    categoria, 
    codigo_producto, 
    unidad_medida, 
    disponible_para_facturacion,
    disponible_para_pedidos
) VALUES
('Harina 0000', 'Harina de trigo 0000 para panadería', 2.50, 500, 100, 'Insumos', 'HAR001', 'Kg', TRUE, TRUE),
('Aceite de Oliva', 'Aceite de oliva extra virgen', 8.00, 200, 50, 'Insumos', 'ACE001', 'Litro', TRUE, TRUE),
('Carne Vacuna', 'Carne vacuna de primera calidad', 12.00, 300, 100, 'Insumos', 'CAR001', 'Kg', TRUE, TRUE),
('Leche Entera', 'Leche entera pasteurizada', 1.80, 400, 80, 'Insumos', 'LEC001', 'Litro', TRUE, TRUE),
('Huevos', 'Huevos frescos de gallina', 0.50, 1000, 200, 'Insumos', 'HUE001', 'Unidad', TRUE, TRUE),
('Queso Cremoso', 'Queso cremoso para pizza', 4.50, 150, 30, 'Insumos', 'QUE001', 'Kg', TRUE, TRUE),
('Pan de Molde', 'Pan de molde integral', 3.20, 200, 50, 'Productos Terminados', 'PAN001', 'Unidad', TRUE, TRUE),
('Torta de Chocolate', 'Torta de chocolate casera', 25.00, 10, 5, 'Productos Terminados', 'TOR001', 'Unidad', TRUE, TRUE),
('Pizza Familiar', 'Pizza familiar con muzzarella', 18.00, 15, 8, 'Productos Terminados', 'PIZ001', 'Unidad', TRUE, TRUE),
('Servicio de Catering', 'Servicio de catering para eventos', 50.00, 0, 0, 'Servicios', 'CAT001', 'Hora', TRUE, FALSE),
('Mantenimiento de Equipos', 'Servicio de mantenimiento preventivo', 35.00, 0, 0, 'Servicios', 'MAN001', 'Hora', TRUE, FALSE),
('Horno Industrial', 'Horno industrial para panadería', 5000.00, 2, 1, 'Equipamiento', 'HOR001', 'Unidad', FALSE, TRUE);

-- =====================================================
-- PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Procedimiento para obtener todos los productos
DELIMITER //
CREATE PROCEDURE sp_obtener_productos()
BEGIN
    SELECT 
        id_producto,
        nombre_producto,
        descripcion,
        precio_unitario,
        stock_actual,
        stock_minimo,
        categoria,
        codigo_producto,
        unidad_medida,
        activo,
        disponible_para_facturacion,
        disponible_para_pedidos,
        fecha_creacion,
        fecha_modificacion
    FROM productos
    ORDER BY nombre_producto;
END //
DELIMITER ;

-- Procedimiento para obtener un producto por ID
DELIMITER //
CREATE PROCEDURE sp_obtener_producto_por_id(IN p_id_producto INT)
BEGIN
    SELECT 
        id_producto,
        nombre_producto,
        descripcion,
        precio_unitario,
        stock_actual,
        stock_minimo,
        categoria,
        codigo_producto,
        unidad_medida,
        activo,
        disponible_para_facturacion,
        disponible_para_pedidos,
        fecha_creacion,
        fecha_modificacion
    FROM productos
    WHERE id_producto = p_id_producto;
END //
DELIMITER ;

-- Procedimiento para crear un producto
DELIMITER //
CREATE PROCEDURE sp_crear_producto(
    IN p_nombre_producto VARCHAR(200),
    IN p_descripcion TEXT,
    IN p_precio_unitario DECIMAL(12,2),
    IN p_stock_actual INT,
    IN p_stock_minimo INT,
    IN p_categoria VARCHAR(100),
    IN p_codigo_producto VARCHAR(50),
    IN p_unidad_medida VARCHAR(20),
    IN p_disponible_para_facturacion BOOLEAN,
    IN p_disponible_para_pedidos BOOLEAN
)
BEGIN
    INSERT INTO productos (
        nombre_producto,
        descripcion,
        precio_unitario,
        stock_actual,
        stock_minimo,
        categoria,
        codigo_producto,
        unidad_medida,
        disponible_para_facturacion,
        disponible_para_pedidos
    ) VALUES (
        p_nombre_producto,
        p_descripcion,
        p_precio_unitario,
        p_stock_actual,
        p_stock_minimo,
        p_categoria,
        p_codigo_producto,
        p_unidad_medida,
        p_disponible_para_facturacion,
        p_disponible_para_pedidos
    );
    
    SELECT LAST_INSERT_ID() as id_producto;
END //
DELIMITER ;

-- Procedimiento para actualizar un producto
DELIMITER //
CREATE PROCEDURE sp_actualizar_producto(
    IN p_id_producto INT,
    IN p_nombre_producto VARCHAR(200),
    IN p_descripcion TEXT,
    IN p_precio_unitario DECIMAL(12,2),
    IN p_stock_actual INT,
    IN p_stock_minimo INT,
    IN p_categoria VARCHAR(100),
    IN p_codigo_producto VARCHAR(50),
    IN p_unidad_medida VARCHAR(20),
    IN p_activo BOOLEAN,
    IN p_disponible_para_facturacion BOOLEAN,
    IN p_disponible_para_pedidos BOOLEAN
)
BEGIN
    UPDATE productos SET
        nombre_producto = p_nombre_producto,
        descripcion = p_descripcion,
        precio_unitario = p_precio_unitario,
        stock_actual = p_stock_actual,
        stock_minimo = p_stock_minimo,
        categoria = p_categoria,
        codigo_producto = p_codigo_producto,
        unidad_medida = p_unidad_medida,
        activo = p_activo,
        disponible_para_facturacion = p_disponible_para_facturacion,
        disponible_para_pedidos = p_disponible_para_pedidos,
        fecha_modificacion = CURRENT_TIMESTAMP
    WHERE id_producto = p_id_producto;
    
    SELECT ROW_COUNT() as filas_afectadas;
END //
DELIMITER ;

-- Procedimiento para eliminar un producto
DELIMITER //
CREATE PROCEDURE sp_eliminar_producto(IN p_id_producto INT)
BEGIN
    DELETE FROM productos WHERE id_producto = p_id_producto;
    SELECT ROW_COUNT() as filas_afectadas;
END //
DELIMITER ;

-- Procedimiento para actualizar stock
DELIMITER //
CREATE PROCEDURE sp_actualizar_stock(
    IN p_id_producto INT,
    IN p_nuevo_stock INT,
    IN p_tipo_movimiento VARCHAR(20),
    IN p_cantidad_movida INT,
    IN p_motivo TEXT,
    IN p_usuario_responsable VARCHAR(100)
)
BEGIN
    DECLARE stock_anterior INT;
    
    -- Obtener stock anterior
    SELECT stock_actual INTO stock_anterior
    FROM productos
    WHERE id_producto = p_id_producto;
    
    -- Actualizar stock
    UPDATE productos 
    SET stock_actual = p_nuevo_stock,
        fecha_modificacion = CURRENT_TIMESTAMP
    WHERE id_producto = p_id_producto;
    
    -- Registrar en historial
    INSERT INTO historial_stock (
        id_producto,
        stock_anterior,
        stock_nuevo,
        tipo_movimiento,
        cantidad_movida,
        motivo,
        usuario_responsable
    ) VALUES (
        p_id_producto,
        stock_anterior,
        p_nuevo_stock,
        p_tipo_movimiento,
        p_cantidad_movida,
        p_motivo,
        p_usuario_responsable
    );
    
    SELECT ROW_COUNT() as filas_afectadas;
END //
DELIMITER ;

-- Procedimiento para buscar productos
DELIMITER //
CREATE PROCEDURE sp_buscar_productos(IN p_termino VARCHAR(200))
BEGIN
    SELECT 
        id_producto,
        nombre_producto,
        descripcion,
        precio_unitario,
        stock_actual,
        stock_minimo,
        categoria,
        codigo_producto,
        unidad_medida,
        activo,
        disponible_para_facturacion,
        disponible_para_pedidos
    FROM productos
    WHERE activo = TRUE
    AND (
        nombre_producto LIKE CONCAT('%', p_termino, '%')
        OR descripcion LIKE CONCAT('%', p_termino, '%')
        OR codigo_producto LIKE CONCAT('%', p_termino, '%')
        OR categoria LIKE CONCAT('%', p_termino, '%')
    )
    ORDER BY nombre_producto;
END //
DELIMITER ;

-- Procedimiento para obtener categorías
DELIMITER //
CREATE PROCEDURE sp_obtener_categorias()
BEGIN
    SELECT 
        id_categoria,
        nombre,
        descripcion,
        activo,
        fecha_creacion
    FROM categorias_productos
    WHERE activo = TRUE
    ORDER BY nombre;
END //
DELIMITER ;

-- Procedimiento para crear categoría
DELIMITER //
CREATE PROCEDURE sp_crear_categoria(
    IN p_nombre VARCHAR(100),
    IN p_descripcion TEXT
)
BEGIN
    INSERT INTO categorias_productos (nombre, descripcion)
    VALUES (p_nombre, p_descripcion);
    
    SELECT LAST_INSERT_ID() as id_categoria;
END //
DELIMITER ;

-- Procedimiento para obtener productos por categoría
DELIMITER //
CREATE PROCEDURE sp_obtener_productos_por_categoria(IN p_categoria VARCHAR(100))
BEGIN
    SELECT 
        id_producto,
        nombre_producto,
        descripcion,
        precio_unitario,
        stock_actual,
        stock_minimo,
        categoria,
        codigo_producto,
        unidad_medida,
        activo,
        disponible_para_facturacion,
        disponible_para_pedidos
    FROM productos
    WHERE categoria = p_categoria
    AND activo = TRUE
    ORDER BY nombre_producto;
END //
DELIMITER ;

-- Procedimiento para obtener productos para facturación
DELIMITER //
CREATE PROCEDURE sp_obtener_productos_para_facturacion()
BEGIN
    SELECT 
        id_producto,
        nombre_producto,
        codigo_producto,
        precio_unitario,
        unidad_medida,
        stock_actual,
        disponible_para_facturacion,
        disponible_para_pedidos
    FROM productos
    WHERE activo = TRUE
    AND disponible_para_facturacion = TRUE
    ORDER BY nombre_producto;
END //
DELIMITER ;

-- Procedimiento para obtener productos para pedidos
DELIMITER //
CREATE PROCEDURE sp_obtener_productos_para_pedidos()
BEGIN
    SELECT 
        id_producto,
        nombre_producto,
        codigo_producto,
        precio_unitario,
        unidad_medida,
        stock_actual,
        disponible_para_facturacion,
        disponible_para_pedidos
    FROM productos
    WHERE activo = TRUE
    AND disponible_para_pedidos = TRUE
    ORDER BY nombre_producto;
END //
DELIMITER ;

-- =====================================================
-- VISTAS ÚTILES
-- =====================================================

-- Vista de productos con stock bajo
CREATE VIEW v_productos_stock_bajo AS
SELECT 
    id_producto,
    nombre_producto,
    codigo_producto,
    stock_actual,
    stock_minimo,
    categoria,
    (stock_minimo - stock_actual) as stock_faltante
FROM productos
WHERE activo = TRUE
AND stock_actual <= stock_minimo
ORDER BY (stock_minimo - stock_actual) DESC;

-- Vista de productos para facturación
CREATE VIEW v_productos_facturacion AS
SELECT 
    id_producto,
    nombre_producto,
    codigo_producto,
    precio_unitario,
    unidad_medida,
    stock_actual,
    categoria
FROM productos
WHERE activo = TRUE
AND disponible_para_facturacion = TRUE
ORDER BY nombre_producto;

-- Vista de productos para pedidos
CREATE VIEW v_productos_pedidos AS
SELECT 
    id_producto,
    nombre_producto,
    codigo_producto,
    precio_unitario,
    unidad_medida,
    stock_actual,
    categoria
FROM productos
WHERE activo = TRUE
AND disponible_para_pedidos = TRUE
ORDER BY nombre_producto;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger para actualizar fecha_modificacion en productos
DELIMITER //
CREATE TRIGGER tr_productos_update
BEFORE UPDATE ON productos
FOR EACH ROW
BEGIN
    SET NEW.fecha_modificacion = CURRENT_TIMESTAMP;
END //
DELIMITER ;

-- Trigger para validar stock mínimo
DELIMITER //
CREATE TRIGGER tr_productos_stock_check
BEFORE UPDATE ON productos
FOR EACH ROW
BEGIN
    IF NEW.stock_actual < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El stock no puede ser negativo';
    END IF;
END //
DELIMITER ;

-- =====================================================
-- ÍNDICES ADICIONALES
-- =====================================================

-- Índices para optimizar consultas frecuentes
CREATE INDEX idx_productos_nombre ON productos(nombre_producto);
CREATE INDEX idx_productos_precio ON productos(precio_unitario);
CREATE INDEX idx_productos_stock ON productos(stock_actual);
CREATE INDEX idx_productos_fecha_creacion ON productos(fecha_creacion);

-- Índices para historial de stock
CREATE INDEX idx_historial_producto_fecha ON historial_stock(id_producto, fecha_movimiento);
CREATE INDEX idx_historial_tipo_fecha ON historial_stock(tipo_movimiento, fecha_movimiento);

-- =====================================================
-- RESUMEN DE LA ESTRUCTURA
-- =====================================================

/*
ESTRUCTURA DE LA BASE DE DATOS PARA PRODUCTOS

TABLAS PRINCIPALES:
- categorias_productos: Categorías de productos
- productos: Productos principales
- historial_stock: Historial de movimientos de stock

FUNCIONALIDADES:
- Gestión completa de productos (CRUD)
- Categorización de productos
- Control de stock con historial
- Productos disponibles para facturación y pedidos
- Precios en pesos y puntos
- Búsqueda y filtrado avanzado

INTEGRACIÓN:
- Compatible con sistema de facturación
- Compatible con sistema de pedidos
- Compatible con sistema de puntos/beneficios
*/ 