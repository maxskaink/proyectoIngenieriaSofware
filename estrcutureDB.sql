drop table compra;
drop table venta;
drop table PRODUCTO;

CREATE TABLE Producto (
    idProducto NUMBER PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    Descripcion VARCHAR2(100) NOT NULL,
    PrecioActual NUMBER NOT NULL,
    activado NUMBER NOT NULL, 
    cantidadStock number not null,
    CONSTRAINT ckc_activado CHECK (activado IN (1,0))
);

CREATE TABLE venta (
    codigoVenta NUMBER,
    medioPago VARCHAR2(50) NOT NULL,
    fecha DATE,
    precioTotalVenta NUMBER NOT NULL,
    CONSTRAINT pk_venta PRIMARY KEY (codigoVenta)
);

CREATE TABLE ProductosVenta(
    idProducto NUMBER NOT NULL,
    codigoVenta NUMBER NOT NULL,
    cantidad NUMBER NOT NULL,
    precioUnitario NUMBER NOT NULL,
    CONSTRAINT pk_proVen PRIMARY KEY (idProducto, codigoVenta),
    CONSTRAINT fk_proVen FOREIGN KEY (idProducto) REFERENCES Producto(idProducto),
    CONSTRAINT fk_venPro FOREIGN KEY (codigoVenta) REFERENCES venta(codigoVenta)
);

CREATE TABLE compra (
    codigoCompra NUMBER,
    fecha DATE,
    nombreProveedor VARCHAR2(255) NOT NULL,
    contacto VARCHAR2(50),
    direccion VARCHAR2(255),
    precioTotalCompra NUMBER NOT NULL,
    CONSTRAINT pk_compra PRIMARY KEY (codigoCompra)
);

CREATE TABLE ProductosCompra(
    idProducto NUMBER NOT NULL,
    codigoCompra NUMBER NOT NULL,
    cantidad NUMBER NOT NULL,
    precioUnitario NUMBER NOT NULL,
    CONSTRAINT pk_proCom PRIMARY KEY (idProducto, codigoCompra),
    CONSTRAINT fk_proCom FOREIGN KEY (idProducto) REFERENCES Producto(idProducto),
    CONSTRAINT fk_comPro FOREIGN KEY (codigoCompra) REFERENCES compra(codigoCompra)
);

/* Para que la id del producto se genere automaticamente */
CREATE SEQUENCE SEQ_PRODUCTO
  START WITH 1
  INCREMENT BY 1;

CREATE OR REPLACE TRIGGER TRG_PRODUCTO BEFORE
    INSERT ON PRODUCTO FOR EACH ROW
BEGIN
    SELECT
        SEQ_PRODUCTO.NEXTVAL INTO :NEW.IDPRODUCTO
    FROM
        DUAL;
END;

insert into PRODUCTO ( nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('pollito frito segunda versi=', 'Pollo clasico de toda la vida', 40000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Empanadas de pipián', 'Deliciosas empanadas rellenas de pipián', 5000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Arroz atollado', 'Plato típico de arroz con cerdo, pollo y chorizo', 15000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Tamales', 'Tamales de maíz rellenos de cerdo', 8000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Cuy asado', 'Plato tradicional de cuy asado', 25000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Champús', 'Bebida típica a base de maíz, piña y lulo', 6000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Fritanga', 'Plato con diferentes carnes fritas', 18000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Cholado', 'Postre a base de hielo raspado con frutas y leche condensada', 7000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Carnes asadas', 'Diferentes cortes de carne asada', 20000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Arepas de maíz pelao', 'Arepas hechas con maíz pelao', 5000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Champusillo', 'Bebida típica a base de maíz, piña y lulo', 4000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Aborrajados', 'Plátanos maduros rellenos de queso y fritos', 6000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Sancocho de gallina', 'Sopa tradicional de gallina con verduras', 12000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Champús', 'Bebida típica a base de maíz, piña y lulo', 6000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Arroz con pollo', 'Plato de arroz con pollo y verduras', 14000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Chontaduro', 'Fruta típica de la región', 3000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Bollo de mazorca', 'Bollo hecho con mazorca de maíz', 4000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Canelazo', 'Bebida caliente a base de aguardiente y panela', 5000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Champusillo', 'Bebida típica a base de maíz, piña y lulo', 4000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Carnes asadas', 'Diferentes cortes de carne asada', 20000, 1, 0);