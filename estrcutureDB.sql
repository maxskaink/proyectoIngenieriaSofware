drop table PRODUCTO;
--Antiguo PRODUCTO id-nombre-descripcion-precio-cantidadStock
-- Se debe usar el usuario BDDII y la contraseña oracle para que funcione normalmente

CREATE TABLE Producto (
    idProducto NUMBER PRIMARY KEY,
    nombre VARCHAR2(20) NOT NULL,
    Descripcion VARCHAR2(100) NOT NULL,
    PrecioActual NUMBER NOT NULL,
    activado NUMBER NOT NULL, 
    cantidadStock number not null,
    CONSTRAINT ckc_activado CHECK (activado IN (1,0))
);

CREATE TABLE venta (
    codigo NUMBER,
    idProducto NUMBER NOT NULL,
    cantidad NUMBER NOT NULL,
    PrecioVenta NUMBER NOT NULL,
    medioPago VARCHAR2(50) NOT NULL,
    fecha DATE,
    CONSTRAINT pk_venta PRIMARY KEY (codigo, idProducto, fecha),
    CONSTRAINT fk_producto_id FOREIGN KEY (idProducto) REFERENCES Producto(idProducto)
);

CREATE TABLE compra (
    codigo NUMBER,
    idProducto NUMBER NOT NULL,
    fecha DATE,
    nombreProveedor VARCHAR2(255) NOT NULL,
    contacto VARCHAR2(50),
    cantidad NUMBER NOT NULL,
    direccion VARCHAR2(255),
    precioCompra NUMBER NOT NULL,
    CONSTRAINT pk_compra PRIMARY KEY (codigo, idProducto, fecha),
    CONSTRAINT fk_proComp FOREIGN KEY (idProducto) REFERENCES Producto(idProducto)
);

describe producto;

insert into PRODUCTO (idProducto, nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values (1, 'pollito frito', 'Pollo clasico de toda la vida', 40000, 1, 0);



select * from PRODUCTO;
delete from producto where idProducto = 2;

UPDATE PRODUCTO
SET nombre = 'carne frita', 
    DESCRIPCION = 'nueva descripcion', 
    PrecioActual = 666, 
    activado = 1, 
    CANTIDADSTOCK = 0
WHERE idProducto = 1;