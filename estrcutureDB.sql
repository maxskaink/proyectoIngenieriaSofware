drop table ProductosVenta;
drop table ProductosCompra;
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
    CONSTRAINT ckc_activado CHECK (activado IN (1,0)),
    CONSTRAINT AK_Producto_Nombre UNIQUE (nombre)
);

CREATE TABLE venta (
    codigoVenta NUMBER,
    medioPago VARCHAR2(50) NOT NULL,
    fecha DATE,
    precioTotalVenta NUMBER NOT NULL,
    CONSTRAINT pk_venta PRIMARY KEY (codigoVenta)
);

CREATE SEQUENCE SEQ_VENTA
    START WITH 1
    INCREMENT BY 1;

CREATE OR REPLACE TRIGGER TRG_VENTA BEFORE
    INSERT ON VENTA FOR EACH ROW
BEGIN
    SELECT
        SEQ_VENTA.NEXTVAL INTO :NEW.CODIGOVENTA
    FROM
        DUAL;
END;

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

CREATE SEQUENCE SEQ_COMPRA
    START WITH 1
    INCREMENT BY 1;

CREATE OR REPLACE TRIGGER TRG_COMPRA BEFORE
        INSERT ON COMPRA FOR EACH ROW
BEGIN
        SELECT
                SEQ_COMPRA.NEXTVAL INTO :NEW.CODIGOCOMPRA
        FROM
                DUAL;
END;

CREATE TABLE ProductosCompra(
    idProducto NUMBER NOT NULL,
    codigoCompra NUMBER NOT NULL,
    cantidad NUMBER NOT NULL,
    precioUnitario NUMBER NOT NULL,
    CONSTRAINT pk_proCom PRIMARY KEY (idProducto, codigoCompra),
    CONSTRAINT fk_proCom FOREIGN KEY (idProducto) REFERENCES Producto(idProducto),
    CONSTRAINT fk_comPro FOREIGN KEY (codigoCompra) REFERENCES compra(codigoCompra)
);

CREATE TABLE Caja(
    codigoCaja NUMBER NOT NULL,
    dineroTotal NUMBER NOT NULL,
    CONSTRAINT pk_Caja PRIMARY KEY (codigoCaja)
)
/* aqui se deberia de insertar el dinero base */
INSERT INTO Caja (codigoCaja, dineroTotal) VALUES (1, 1000000);


CREATE OR REPLACE PROCEDURE InsertarProductoEnVenta(
    idProducto IN NUMBER,
    codigoVenta IN NUMBER,
    cantidad IN NUMBER
)
IS
    precioProducto PRODUCTO.PrecioActual%TYPE;
    PRECIOACTUALCAja Caja.dineroTotal%TYPE;
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM Producto WHERE idProducto = idProducto;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'El código del producto no es válido');
    END IF;

    SELECT COUNT(*) INTO v_count FROM venta WHERE codigoVenta = codigoVenta;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'El código de venta no es válido');
    END IF;

    SELECT P.PrecioActual
    INTO precioProducto
    FROM PRODUCTO P
    WHERE P.idProducto = idProducto;

    SELECT C.dineroTotal
    into PRECIOACTUALCAja
    FROM Caja C
    WHERE C.codigoCaja = 1;

    -- Asegúrate de proporcionar los valores correctos para la inserción
    INSERT INTO ProductosVenta (idProducto, codigoVenta, cantidad, precioUnitario) 
    VALUES (idProducto, codigoVenta, cantidad, precioProducto);

    UPDATE Caja SET dineroTotal = PRECIOACTUALCAja + (precioProducto * cantidad)
    WHERE codigoCaja = 1;

    UPDATE PRODUCTO SET cantidadStock = cantidadStock - cantidad
    WHERE idProducto = idProducto;
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exceptions here
        DBMS_OUTPUT.PUT_LINE('An error occurred: ' || SQLERRM);
END InsertarProductoEnVenta;

CREATE OR REPLACE PROCEDURE InsertarProductoEnCompra(
    p_idProducto IN NUMBER,
    p_CODIGOCOMPRA IN NUMBER,
    p_cantidad IN NUMBER,
    p_precioUnitario IN NUMBER
)
IS
    PRECIOACTUALCAja Caja.dineroTotal%TYPE;
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM Producto WHERE idProducto = p_idProducto;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'El código del producto no es válido');
    END IF;

    SELECT COUNT(*) INTO v_count FROM COMPRA WHERE CODIGOCOMPRA = p_CODIGOCOMPRA;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'El código de compra no es válido');
    END IF;
    
    SELECT C.dineroTotal
    INTO PRECIOACTUALCAja
    FROM Caja C
    WHERE C.codigoCaja = 1;

    IF PRECIOACTUALCAja - (p_precioUnitario * p_cantidad) >= 0 THEN
        UPDATE Caja SET dineroTotal = PRECIOACTUALCAja - (p_precioUnitario * p_cantidad)
        WHERE codigoCaja = 1;
    ELSE
        RAISE_APPLICATION_ERROR(-20004, 'No hay suficiente dinero en la caja');
    END IF;

    INSERT INTO PRODUCTOSCOMPRA (idProducto, CODIGOCOMPRA, cantidad, precioUnitario)
    VALUES (p_idProducto, p_CODIGOCOMPRA, p_cantidad, p_precioUnitario);

    UPDATE PRODUCTO SET cantidadStock = cantidadStock + p_cantidad
    WHERE idProducto = p_idProducto;
    
    UPDATE compra set preciototalcompra = preciototalcompra + (p_precioUnitario * p_cantidad) 
    where codigoCompra = p_codigocompra;

EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('An error occurred: ' || SQLERRM);
END InsertarProductoEnCompra;


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
values ('Fritanga', 'Plato con diferentes carnes fritas', 18000, 1, 0);

insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Cholado', 'Postre a base de hielo raspado con frutas y leche condensada', 7000, 1, 0);


insert into PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) 
values ('Arepas de maíz pelao', 'Arepas hechas con maíz pelao', 5000, 1, 0);

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