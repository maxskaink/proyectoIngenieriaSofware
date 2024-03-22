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
