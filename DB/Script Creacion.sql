--ESTEBAN SANTIAGO ESCANDON CAUSAYA
--ISABELA MOSQUERA FERNANDEZ
--JULIAN DAVID MENESES DAZA
--Isabela Sánchez Saavedra
--MIGUEL ANGEL CALAMBAS VIVAS

---Previo
-- Primero, eliminamos tablas ya existentes

DROP TABLE Trabajador cascade constraints;
DROP TABLE ProductoCompra cascade constraints;
DROP TABLE ProductoVenta cascade constraints;
DROP TABLE InventarioSucursal cascade constraints;
DROP TABLE Pedido cascade constraints;
DROP TABLE Producto cascade constraints;
DROP TABLE Cliente cascade constraints;
DROP TABLE Compra cascade constraints;
DROP TABLE Sucursal cascade constraints;
DROP TABLE Lote cascade constraints;
DROP TABLE Proveedor cascade constraints;

-- Creamos las tablas

CREATE TABLE Producto (
    idProducto NUMBER PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    Descripcion VARCHAR2(100) NOT NULL,
    PrecioActual NUMBER NOT NULL,
    activado NUMBER NOT NULL, 
    categoria VARCHAR2(100) NOT NULL,
    CONSTRAINT ckc_activado CHECK (activado IN (1,0))
);

CREATE TABLE SUCURSAL(
    IDSUCURSAL NUMBER PRIMARY KEY,
    NOMBRE VARCHAR2(40) NOT NULL,
    TELEFONO VARCHAR2(20) NOT NULL,
    DIRECCION VARCHAR2(100) NOT NULL,
    CAPITAL NUMBER NOT NULL,
    ESTADO NUMBER(1) DEFAULT 1 NOT NULL,
    CONSTRAINT ckc_estado CHECK(ESTADO IN (0,1))
);

CREATE TABLE CLIENTE(
    CEDULACLIENTE NUMBER PRIMARY KEY,
    NOMBRE VARCHAR2(30) NOT NULL,
    CORREO VARCHAR2(30) NOT NULL,
    FECHANACIMIENTO DATE NOT NULL
);

CREATE TABLE PROVEEDOR(
    NIT NUMBER PRIMARY KEY,
    NOMBRE VARCHAR2(70) NOT NULL,
    TELEFONO VARCHAR2(20) NOT NULL,
    DIRECCION VARCHAR2(100) NOT NULL
);

CREATE TABLE LOTE(
    IDLOTE NUMBER PRIMARY KEY,
    FECHAPRODUCCION DATE NOT NULL,
    FECHAVENCIMIENTO DATE NOT NULL,
    CHECK(FECHAPRODUCCION<FECHAVENCIMIENTO)
);

CREATE TABLE TRABAJADOR (
    CEDULATRABAJO NUMBER PRIMARY KEY,
    IDSUCURSAL NUMBER NOT NULL,
    NOMBRE VARCHAR2(20) NOT NULL,
    CARGO VARCHAR2(20) NOT NULL,
    SALARIO NUMBER NOT NULL,
    ESTADO NUMBER(1) DEFAULT 1 NOT NULL,
    CONSTRAINT FK_SUCURSAL_ID FOREIGN KEY (IDSUCURSAL) REFERENCES SUCURSAL(IDSUCURSAL),
    CHECK(CARGO='Administrador' OR CARGO='Empleado'),
    CONSTRAINT ckc_estadoTR CHECK(ESTADO IN (0,1))

);

CREATE TABLE COMPRA (
    CODIGOCOMPRA NUMBER PRIMARY KEY,
    NIT NUMBER NOT NULL,
    IDSUCURSAL NUMBER NOT NULL,
    PRECIOTOTAL NUMBER NOT NULL,
    FECHA DATE NOT NULL,
    CONSTRAINT FK_SUCURSALID FOREIGN KEY (IDSUCURSAL) REFERENCES SUCURSAL(IDSUCURSAL),
    CONSTRAINT FK_NIT FOREIGN KEY (NIT) REFERENCES PROVEEDOR(NIT)
);

CREATE TABLE PRODUCTOCOMPRA (
    CODIGOCOMPRA NUMBER NOT NULL,
    IDPRODUCTO NUMBER NOT NULL,
    CANTIDAD NUMBER,
    IDLOTE NUMBER NOT NULL,
    PRECIOUNITARIO NUMBER,
    CONSTRAINT PK_PCOMPRA PRIMARY KEY (CODIGOCOMPRA, IDPRODUCTO),
    CONSTRAINT FK_COMPRA FOREIGN KEY (CODIGOCOMPRA) REFERENCES COMPRA(CODIGOCOMPRA),
    CONSTRAINT FK_PROCOMP FOREIGN KEY (IDPRODUCTO) REFERENCES PRODUCTO(IDPRODUCTO),
    CONSTRAINT FK_LOTE_ID FOREIGN KEY (IDLOTE) REFERENCES LOTE(IDLOTE)
);

CREATE TABLE INVENTARIOSUCURSAL(
    IDSUCURSAL NUMBER NOT NULL,
    IDPRODUCTO NUMBER NOT NULL,
    CANTIDAD NUMBER NOT NULL,
    CONSTRAINT PK_INVENTARIO PRIMARY KEY (IDSUCURSAL, IDPRODUCTO),
    CONSTRAINT FK_SUCURSAL FOREIGN KEY (IDSUCURSAL) REFERENCES SUCURSAL(IDSUCURSAL),
    CONSTRAINT FK_PRODUCTO FOREIGN KEY (IDPRODUCTO) REFERENCES PRODUCTO(IDPRODUCTO)
);

CREATE TABLE PEDIDO(
    CODIGOPEDIDO NUMBER NOT NULL,
    IDSUCURSAL NUMBER NOT NULL,
    CEDULACLIENTE NUMBER NOT NULL,
    CEDULATRABAJOR NUMBER NOT NULL,
    FECHA DATE NOT NULL,
    PRECIOTOTAL NUMBER NOT NULL,
    ESTADO VARCHAR2(20) NOT NULL,
    CONSTRAINT PK_PEDIDO PRIMARY KEY (CODIGOPEDIDO),
    CONSTRAINT FK_SUCURSALP FOREIGN KEY (IDSUCURSAL) REFERENCES SUCURSAL(IDSUCURSAL),
    CONSTRAINT FK_CLIENTE FOREIGN KEY (CEDULACLIENTE) REFERENCES CLIENTE(CEDULACLIENTE)
);
CREATE TABLE productoventa (
    codigoventa NUMBER NOT NULL,
    idproducto NUMBER NOT NULL,
    cantidad NUMBER NOT NULL,
    preciounitario NUMBER NOT NULL,
    CONSTRAINT pk_productoventa PRIMARY KEY (codigoventa,idproducto),
    CONSTRAINT fk_productoventapedido FOREIGN KEY (codigoventa) REFERENCES pedido(codigopedido),
    CONSTRAINT fk_productoventaproducto FOREIGN KEY (idproducto) REFERENCES producto(idproducto)
);


DROP SEQUENCE SEQ_PEDIDO;
-- Ahora, crea las secuencias
CREATE SEQUENCE SEQ_PEDIDO
    START WITH 1
    INCREMENT BY 1;
/

DROP SEQUENCE SEQ_COMPRA;
CREATE SEQUENCE SEQ_COMPRA
    START WITH 1
    INCREMENT BY 1;
/

DROP SEQUENCE SEQ_PRODUCTO;
CREATE SEQUENCE SEQ_PRODUCTO
  START WITH 1
  INCREMENT BY 1;
/

DROP SEQUENCE SEQ_SUCURSAL;
CREATE SEQUENCE SEQ_SUCURSAL
  START WITH 1
  INCREMENT BY 1;
/
DROP SEQUENCE SEQ_LOTE;
CREATE SEQUENCE SEQ_LOTE
  START WITH 1
  INCREMENT BY 1;
/

DROP SEQUENCE SEQ_TRABAJADOR;
CREATE SEQUENCE SEQ_TRABAJADOR
  START WITH 1
  INCREMENT BY 1;
/
-- Luego, crea los triggers
---Previo

-- Luego, crea los triggers

CREATE OR REPLACE TRIGGER TRG_LOTE BEFORE
    INSERT ON LOTE FOR EACH ROW
BEGIN
    SELECT
        SEQ_LOTE.NEXTVAL INTO :NEW.IDLOTE
    FROM
        DUAL;
END;
/
CREATE OR REPLACE TRIGGER TRG_VENTA BEFORE
    INSERT ON PEDIDO FOR EACH ROW
BEGIN
    SELECT
        SEQ_PEDIDO.NEXTVAL INTO :NEW.CODIGOPEDIDO
    FROM
        DUAL;
END;
/
CREATE OR REPLACE TRIGGER TRG_SUCURSAL BEFORE
    INSERT ON SUCURSAL FOR EACH ROW
BEGIN
    SELECT
        SEQ_SUCURSAL.NEXTVAL INTO :NEW.IDSUCURSAL
    FROM
        DUAL;
END;
/

CREATE OR REPLACE TRIGGER TRG_COMPRA BEFORE
        INSERT ON COMPRA FOR EACH ROW
BEGIN
        SELECT
                SEQ_COMPRA.NEXTVAL INTO :NEW.CODIGOCOMPRA
        FROM
                DUAL;
END;
/

CREATE OR REPLACE TRIGGER TRG_TRABAJADOR BEFORE
        INSERT ON TRABAJADOR FOR EACH ROW
BEGIN
    SELECT
        SEQ_TRABAJADOR.NEXTVAL INTO :NEW.CEDULATRABAJO
    FROM
        DUAL;
END;
/



CREATE OR REPLACE TRIGGER TRG_PRODUCTO_INSERT BEFORE
    INSERT OR UPDATE ON PRODUCTO FOR EACH ROW
DECLARE
  PRAGMA AUTONOMOUS_TRANSACTION;
    v_count NUMBER;
BEGIN
   IF :NEW.activado = 1 THEN
      IF INSERTING THEN
        SELECT
            SEQ_PRODUCTO.NEXTVAL INTO :NEW.IDPRODUCTO
        FROM
            DUAL;
      END IF;
        SELECT COUNT(*) INTO v_count FROM PRODUCTO 
        WHERE (nombre LIKE :NEW.nombre) AND (activado = 1) AND ( NOT (PRODUCTO.IDPRODUCTO=:NEW.IDPRODUCTO));
        IF v_count > 0 THEN
            RAISE_APPLICATION_ERROR(-20001, 'El nombre del producto ya existe y está activado');
        END IF;
    END IF;
END;
/

--VISTAS

CREATE OR REPLACE VIEW productos_inventario AS
SELECT 
    PRODUCTO.IDPRODUCTO,
    PRODUCTO.NOMBRE,
    PRODUCTO.DESCRIPCION,
    PRODUCTO.PRECIOACTUAL,
    PRODUCTO.ACTIVADO,
    PRODUCTO.CATEGORIA,
    SUCURSAL.IDSUCURSAL,
    NVL(INVENTARIOSUCURSAL.CANTIDAD, 0) AS CANTIDAD
FROM 
    PRODUCTO 
CROSS JOIN SUCURSAL
LEFT JOIN INVENTARIOSUCURSAL ON PRODUCTO.IDPRODUCTO = INVENTARIOSUCURSAL.IDPRODUCTO AND SUCURSAL.IDSUCURSAL = INVENTARIOSUCURSAL.IDSUCURSAL
WHERE PRODUCTO.ACTIVADO = 1;
