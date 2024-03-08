CREATE TABLE Producto (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(20) NOT NULL,
    Descripcion VARCHAR2(100) NOT NULL,
    PrecioActual NUMBER NOT NULL,
    activado VARCHAR2(5) NOT NULL, -- Debería admitir 'True' o 'False',
    cantidadStock number not null,
    CONSTRAINT ckc_activado CHECK (activado IN ('True', 'False'))
);

CREATE TABLE venta (
    codigo NUMBER,
    id NUMBER NOT NULL,
    cantidad NUMBER NOT NULL,
    PrecioVenta NUMBER NOT NULL,
    medioPago VARCHAR2(50) NOT NULL,
    fecha DATE,
    CONSTRAINT pk_venta PRIMARY KEY (codigo, id, fecha),
    CONSTRAINT fk_producto_id FOREIGN KEY (id) REFERENCES Producto(id)
);

CREATE TABLE compra (
    codigo NUMBER,
    id NUMBER NOT NULL,
    fecha DATE,
    nombreProveedor VARCHAR2(255) NOT NULL,
    contacto VARCHAR2(50),
    cantidad NUMBER NOT NULL,
    direccion VARCHAR2(255),
    precioCompra NUMBER NOT NULL,
    CONSTRAINT pk_compra PRIMARY KEY (codigo, id, fecha),
    CONSTRAINT fk_producto_id FOREIGN KEY (id) REFERENCES Producto(id)
);

--Crear una estructura definida para la base de datos
-- Seguir con lo de actualizar los productos por id