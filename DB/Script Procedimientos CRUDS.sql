--INSERTAR PRODUCTO EN VENTA
--ESTEBAN SANTIAGO ESCANDON CAUSAYA
--ISABELA MOSQUERA FERNANDEZ
--JULIAN DAVID MENESES DAZA
--Isabela Sánchez Saavedra
--MIGUEL ANGEL CALAMBAS VIVAS 
CREATE OR REPLACE PROCEDURE InsertProductoVenta(
    p_idProducto IN NUMBER,
    p_codigoVenta IN NUMBER,
    p_cantidad IN NUMBER
)
IS
    precioProducto PRODUCTO.PrecioActual%TYPE;
    v_idsucursal PEDIDO.idsucursal%TYPE;
    capitalSucursal SUCURSAL.Capital%TYPE;
    v_count NUMBER;
BEGIN
    -- Iniciar la transacci�n con un SAVEPOINT
    SAVEPOINT inicio_transaccion;

    BEGIN
    
        -- Verificar si la venta existe
        SELECT COUNT(*) INTO v_count FROM Pedido WHERE CODIGOPEDIDO = p_codigoVenta;
        IF v_count = 0 THEN
            RAISE_APPLICATION_ERROR(-20003, 'El c�digo de venta no es v�lido');
        END IF;
        
        SELECT IDSUCURSAL INTO V_IDSUCURSAL  FROM PEDIDO WHERE CODIGOPEDIDO = p_codigoVenta;
        -- Verificar si el producto existe
        SELECT COUNT(*) INTO v_count FROM Producto WHERE idProducto = p_idProducto;
        IF v_count = 0 THEN
            RAISE_APPLICATION_ERROR(-20002, 'El c�digo del producto no es v�lido');
        END IF;
        
         -- Si el producto no existe en el inventario de la sucursal , crear una nueva entrada
        IF v_count = 0 THEN
            INSERT INTO InventarioSucursal (IDSUCURSAL, IDPRODUCTO, CANTIDAD)
            VALUES (V_IDSUCURSAL, p_idProducto, 0);
        END IF;
            
        -- Verificar si hay suficiente stock para la venta
        SELECT cantidad INTO v_count FROM InventarioSucursal WHERE idProducto = p_idProducto  AND IDSUCURSAL = V_IDSUCURSAL;
        IF (v_count - p_cantidad) < 0 THEN
            RAISE_APPLICATION_ERROR(-20004, 'No se pueden vender una cantidad inexistente');
        END IF;
        

        -- Obtener el precio actual del producto
        SELECT PrecioActual INTO precioProducto FROM Producto WHERE idProducto = p_idProducto;

        -- Obtener el capital de la sucursal
        SELECT Capital INTO capitalSucursal FROM Sucursal WHERE IDSUCURSAL = (SELECT IDSUCURSAL FROM Pedido WHERE CODIGOPEDIDO = p_codigoVenta);

        -- Insertar el producto en la t	abla ProductoVenta
        INSERT INTO ProductoVenta (codigoventa, idproducto, cantidad, preciounitario) 
        VALUES (p_codigoVenta, p_idProducto, p_cantidad, precioProducto);

        -- Actualizar el capital de la sucursal
        UPDATE Sucursal SET Capital = capitalSucursal + (precioProducto * p_cantidad) WHERE IDSUCURSAL = (SELECT IDSUCURSAL FROM Pedido WHERE CODIGOPEDIDO = p_codigoVenta);

        -- Actualizar el inventario de la sucursal en la tabla InventarioSucursal
        UPDATE InventarioSucursal
        SET cantidad = cantidad - p_cantidad
        WHERE IDSUCURSAL = V_IDSUCURSAL AND IDPRODUCTO = p_idProducto;
        
        -- Actualizar el precio total de la venta
        UPDATE Pedido SET PRECIOTOTAL = PRECIOTOTAL + (precioProducto * p_cantidad) WHERE CODIGOPEDIDO = p_codigoVenta;

        -- Confirmar la transacci�n
        COMMIT;
    EXCEPTION
        WHEN OTHERS THEN
            -- Manejar las excepciones aqu�
            DBMS_OUTPUT.PUT_LINE('Ocurri� un error: ' || SQLERRM);
            -- Deshacer la transacci�n hasta el SAVEPOINT
            ROLLBACK TO inicio_transaccion;
    END;
END InsertProductoVenta;
/
--INSERTAR PRODUCTO EN COMPRA
CREATE OR REPLACE PROCEDURE insertProductoCompra(
    p_CODIGOCOMPRA IN NUMBER,
    p_idProducto IN NUMBER,
    p_cantidad  IN NUMBER,
    p_idLote IN NUMBER

)
IS
    precioProducto PRODUCTO.PrecioActual%TYPE;
    capitalSucursal Sucursal.Capital%TYPE;
    v_idsucursal Compra.idsucursal%TYPE;
    v_count NUMBER;

BEGIN
    -- Iniciar la transacci�n con un SAVEPOINT
    SAVEPOINT inicio_transaccion;
    BEGIN
    
    SELECT IDSUCURSAL INTO V_IDSUCURSAL  FROM Compra WHERE CODIGOCOMPRA = p_CODIGOCOMPRA;
    -- Verificar si el producto existe
    SELECT COUNT(*) INTO v_count FROM Producto WHERE idProducto = p_idProducto;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20002, 'El c�digo del producto no es v�lido');
    END IF;

    -- Verificar si la compra existe
    SELECT COUNT(*) INTO v_count FROM COMPRA WHERE CODIGOCOMPRA = p_CODIGOCOMPRA;
    IF v_count = 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'El c�digo de compra no es v�lido');
    END IF;

    SELECT COUNT(*) INTO v_count FROM INVENTARIOSUCURSAL WHERE idProducto = p_idProducto;
        -- Si el producto no existe en el inventario de la sucursal , crear una nueva entrada
    IF v_count = 0 THEN
        INSERT INTO InventarioSucursal (IDSUCURSAL, IDPRODUCTO, CANTIDAD)
        VALUES (V_IDSUCURSAL, p_idProducto, 0);
    END IF;
    -- Obtener el capital de la sucursal
    SELECT Capital INTO capitalSucursal FROM Sucursal WHERE IDSUCURSAL = V_IDSUCURSAL;

    -- Obtener el precio actual del producto
    SELECT PrecioActual INTO precioProducto FROM Producto WHERE idProducto = p_idProducto;

    -- Verificar si hay suficiente capital en la sucursal
    IF capitalSucursal - (precioProducto * p_cantidad) < 0 THEN
        RAISE_APPLICATION_ERROR(-20004, 'No hay suficiente capital en la sucursal');
    END IF;

    -- Actualizar el capital en la sucursal
    UPDATE Sucursal SET Capital = Capital - (precioProducto * p_cantidad)
    WHERE IDSUCURSAL = V_IDSUCURSAL;

    -- Insertar el producto en la tabla ProductosCompra
    INSERT INTO ProductoCompra (idProducto, CODIGOCOMPRA, cantidad, idlote, precioUnitario)
    VALUES (p_idProducto, p_CODIGOCOMPRA, p_cantidad, p_idlote, precioProducto);


    -- Actualizar el precio total de la compra
    UPDATE Compra SET preciototal = preciototal + (precioProducto * p_cantidad) 
    WHERE CODIGOCOMPRA = p_CODIGOCOMPRA;

    -- Actualizar el inventario de la sucursal en la tabla InventarioSucursal
    UPDATE InventarioSucursal
    SET cantidad = cantidad + p_cantidad
    WHERE IDSUCURSAL = V_IDSUCURSAL AND IDPRODUCTO = p_idProducto;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('An error occurred: ' || SQLERRM);
        -- Deshacer la transacci�n hasta el SAVEPOINT
        ROLLBACK TO inicio_transaccion;    
    END;
END insertProductoCompra;
/
--CRUD COMPRA
--INSERTAR
CREATE OR REPLACE PROCEDURE insertCompra(
    p_nitProveedor in COMPRA.NIT%TYPE,
    p_idSucursal in COMPRA.IDSUCURSAL%TYPE
)
IS
    v_idSucursal COMPRA.IDSUCURSAL%TYPE;
BEGIN
    SELECT Sucursal.idsucursal
    INTO v_idSucursal
    FROM sucursal
    WHERE estado = 1 AND IDSUCURSAL = p_idSucursal;
    
    INSERT INTO COMPRA (NIT, IDSUCURSAL, FECHA, PRECIOTOTAL) VALUES(p_nitProveedor, v_idSucursal, SYSDATE, 0);
EXCEPTION 
    WHEN OTHERS THEN
        RAISE_APPLICATION_ERROR(-20001, 'Valide que si exista el proveedor y la sucursal');
END insertCompra;
/
--ACTUALIZAR
--Dado que se quiere guardar los datos de la compra que se realiz�
--No tiene sentido poder cambiar esta informacion ya que no hay una situacion
--Donde se necesite cambiar lo que es un hecho
--ELIMINAR
--Dado que se quiere guardar los datos de la compra que se realiz�
--No tiene sentido poder eliminar esta informacion ya que no hay una situacion
--Donde se necesite borrar lo que es un hecho y podria da�ar la integridad de la
--informacion

--CRUD PEDIDO

--INSERTAR

CREATE OR REPLACE PROCEDURE insertPedido(
    p_cedulaCliente in COMPRA.NIT%TYPE,
    p_idSucursal in COMPRA.IDSUCURSAL%TYPE,
    p_cedulaTrabajador in trabajador.CEDULATRABAJo%TYPE,
    p_estado in PEDIDO.ESTADO%TYPE
)
IS
    v_idSucursal COMPRA.IDSUCURSAL%TYPE;
    v_idTrabajador trabajador.CEDULATRABAJo%TYPE;
BEGIN
    SELECT Sucursal.idsucursal
    INTO v_idSucursal
    FROM sucursal
    WHERE estado = 1 AND IDSUCURSAL = p_idSucursal;
    
    SELECT Trabajador.cedulaTrabajo
    INTO v_idTrabajador
    FROM trabajador
    WHERE estado = 1 AND cedulatrabajo = p_cedulaTrabajador;
    
    IF(NOT (p_estado) IN ('Entregado', 'Pendiente')) THEN 
        RAISE_APPLICATION_ERROR(-20006, 'Ingrese un estado valido (Entregado o Pendiente)');
    END IF;
    
    INSERT INTO PEDIDO (CEDULACLIENTE, IDSUCURSAL, cedulatrabajor,FECHA, PRECIOTOTAL, ESTADO) 
    VALUES(p_cedulacliente, v_idSucursal, v_idtrabajador,SYSDATE, 0, p_estado);

END;
/
--ACTUALIZAR

CREATE OR REPLACE PROCEDURE updatePedido(
    p_codigoPedido Pedido.codigopedido%type,
    p_estado pedido.estado%type
)
IS
BEGIN
    
    IF(NOT (p_estado) IN ('Entregado', 'Pendiente')) THEN 
        RAISE_APPLICATION_ERROR(-20006, 'Ingrese un estado valido (Entregado o Pendiente)');
    END IF;
    
    UPDATE PEDIDO SET estado = p_estado 
    WHERE CODIGOPEDIDO = p_codigoPedido;
    
END;
/
--ELIMINAR
--Dado que se quiere guardar los datos de la compra que se realiz�
--No tiene sentido poder eliminar esta informacion ya que no hay una situacion
--Donde se necesite borrar lo que es un hecho y podria da�ar la integridad de la
--informacion

--CRUD PROVEEDOR
CREATE OR REPLACE PROCEDURE insertProveedor(
    p_NIT in PROVEEDOR.NIT%TYPE,
    p_Nombre in PROVEEDOR.Nombre%TYPE,
    p_Telefono in PROVEEDOR.Telefono%TYPE,
    p_Direccion in PROVEEDOR.Direccion%TYPE
)
IS
     v_contador  PROVEEDOR.NIT%TYPE;
    
BEGIN
    SELECT COUNT(*)
    INTO v_contador
    FROM proveedor
    WHERE NIT = p_NIT;
    
  IF v_contador > 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'El NIT ingresado ya est� registrado');
    ELSE
        INSERT INTO proveedor VALUES(p_NIT, p_Nombre, p_Telefono, p_Direccion);
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Proveedor insertado correctamente');
    END IF;
EXCEPTION
 WHEN OTHERS THEN
  DBMS_OUTPUT.PUT_LINE('Ocurrio un error al ingresar un nuevo proveedor');
END;
/
CREATE OR REPLACE PROCEDURE UpdateNombreProveedor(
    p_NIT in PROVEEDOR.NIT%TYPE,
    p_Nombre in PROVEEDOR.Nombre%TYPE
)
IS
     v_contador  PROVEEDOR.NIT%TYPE;
    
BEGIN
    SELECT COUNT(*)
    INTO v_contador
    FROM proveedor
    WHERE NIT = p_NIT;
    
  IF v_contador = 0 THEN
        RAISE_APPLICATION_ERROR(-20008, 'El NIT ingresado no existe');
    ELSE
        UPDATE PROVEEDOR SET Nombre = p_Nombre where NIT=p_Nit;
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Proveedor actualizado correctamente');
    END IF;
EXCEPTION
 WHEN OTHERS THEN
  DBMS_OUTPUT.PUT_LINE('Ocurrio un error al actualizar a un proveedor');
END;
/
CREATE OR REPLACE PROCEDURE UpdateTelefonoProveedor(
    p_NIT in PROVEEDOR.NIT%TYPE,
    p_Telefono in PROVEEDOR.Telefono%TYPE
)
IS
     v_contador  PROVEEDOR.NIT%TYPE;
    
BEGIN
    SELECT COUNT(*)
    INTO v_contador
    FROM proveedor
    WHERE NIT = p_NIT;
    
  IF v_contador = 0 THEN
        RAISE_APPLICATION_ERROR(-20008, 'El NIT ingresado no existe');
    ELSE
        UPDATE PROVEEDOR SET Telefono = p_Telefono where NIT=p_Nit;
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Proveedor actualizado correctamente');
    END IF;
EXCEPTION
 WHEN OTHERS THEN
  DBMS_OUTPUT.PUT_LINE('Ocurrio un error al actualizar a un proveedor');
END;
/
CREATE OR REPLACE PROCEDURE UpdateDireccionProveedor(
    p_NIT in PROVEEDOR.NIT%TYPE,
    p_Direccion in PROVEEDOR.Direccion%TYPE
)
IS
     v_contador  PROVEEDOR.NIT%TYPE;
    
BEGIN
    SELECT COUNT(*)
    INTO v_contador
    FROM proveedor
    WHERE NIT = p_NIT;
    
  IF v_contador = 0 THEN
        RAISE_APPLICATION_ERROR(-20008, 'El NIT ingresado no existe');
    ELSE
        UPDATE PROVEEDOR SET Direccion = p_Direccion where NIT=p_Nit;
        COMMIT;
        DBMS_OUTPUT.PUT_LINE('Proveedor actualizado correctamente');
    END IF;
EXCEPTION
 WHEN OTHERS THEN
  DBMS_OUTPUT.PUT_LINE('Ocurrio un error al actualizar a un proveedor');
END;
/
--CRUD TRABAJADOR

CREATE OR REPLACE PROCEDURE insertarTrabajador(
    p_cedula NUMBER, 
    p_idSucursal NUMBER, 
    p_nombre VARCHAR2,
    p_cargo VARCHAR2,
    p_salario NUMBER
)
IS
    v_numSucursales NUMBER;
    v_cedula NUMBER;
BEGIN 
    SELECT COUNT(*) 
    INTO v_numSucursales
    FROM SUCURSAL
    WHERE idSucursal = p_idSucursal;
    
    SELECT COUNT(*) 
    INTO v_cedula
    FROM TRABAJADOR
    WHERE CEDULATRABAJO = p_cedula;

    IF v_numSucursales = 0 THEN
        RAISE_APPLICATION_ERROR(-20003, 'La sucursal no existe');
    END IF;
    IF v_cedula = 1 THEN
        RAISE_APPLICATION_ERROR(-20005, 'EL TRABAHJADOR YA EXISTE ');
    END IF;
    

    INSERT INTO TRABAJADOR VALUES (p_cedula, p_idSucursal, p_nombre, p_cargo, p_salario, 1);

END;
/

--Toma por parametro la cedula
CREATE OR REPLACE PROCEDURE deleteTrabajador(p_cedula TRABAJADOR.CEDULATRABAJO%type )
IS

v_count NUMBER;
BEGIN
--Busca el trabajador en la tabla 
SELECT COUNT(*)
INTO v_count 
FROM TRABAJADOR
WHERE TRABAJADOR.CEDULATRABAJO = p_cedula;

--Lanza la error en caso de que no se encuentre
if v_count = 0 then 
    RAISE_APPLICATION_ERROR(-20003, 'no se encontro el trabajador');
END IF;
--coloca en estado de "borrado" 
    UPDATE TRABAJADOR
    SET TRABAJADOR.ESTADO = 0
    WHERE TRABAJADOR.CEDULATRABAJO = p_cedula;    



END;
/
CREATE OR REPLACE PROCEDURE activateTrabajador(p_cedula TRABAJADOR.CEDULATRABAJO%type )
IS
v_count NUMBER;
BEGIN
--Busca el trabajador en la tabla 
SELECT COUNT(*)
INTO v_count 
FROM TRABAJADOR
WHERE TRABAJADOR.CEDULATRABAJO = p_cedula;

--Lanza la error en caso de que no se encuentre
if v_count = 0 then 
    RAISE_APPLICATION_ERROR(-20003, 'no se encontro el trabajador');
END IF;
--coloca en estado de "borrado" 
    UPDATE TRABAJADOR
    SET TRABAJADOR.ESTADO = 1
    WHERE TRABAJADOR.CEDULATRABAJO = p_cedula;    
END;
/
--SE ACTUALIZARA EL TRABAJADOR POR MEDIO DE SU CEDULATRABAJADOR Y EL DATO QUE QUIERA ACTUALIZAR
CREATE OR REPLACE PROCEDURE updateTrabajadorSucursal(
p_cedula TRABAJADOR.CEDULATRABAJO%type,
p_idSucursal TRABAJADOR.idSucursal%type
)
IS
    v_count NUMBER;
    v_id NUMBER;
BEGIN 

    SELECT COUNT(*)
    INTO v_count
    FROM TRABAJADOR 
    WHERE TRABAJADOR.CEDULATRABAJO = p_cedula AND TRABAJADOR.ESTADO = 1;
    
    SELECT COUNT(*)
    INTO v_id
    FROM SUCURSAL 
    WHERE SUCURSAL.IDSUCURSAL = p_idSucursal;
    
    if (v_count = 0 )  then 
        RAISE_APPLICATION_ERROR(-20003, 'no se encontro el trabajador');
    END IF;
    
    if ( v_id = 0 )  then 
        RAISE_APPLICATION_ERROR(-20002, 'EL ID DE LA SUCURSAL NO SE ENCUENTRA ');
    END IF;
    
    UPDATE TRABAJADOR
    SET TRABAJADOR.idSucursal = p_idSucursal
    WHERE TRABAJADOR.CEDULATRABAJO = p_cedula;    
    
    
END;
/
CREATE OR REPLACE PROCEDURE updateTrabajadorNombre(
p_cedula TRABAJADOR.CEDULATRABAJO%type,
p_nombre TRABAJADOR.nombre%type
)
IS
    v_count NUMBER;
BEGIN 

    SELECT COUNT(*)
    INTO v_count
    FROM TRABAJADOR 
    WHERE TRABAJADOR.CEDULATRABAJO = p_cedula AND TRABAJADOR.ESTADO = 1;
    
    if v_count = 0 then 
        RAISE_APPLICATION_ERROR(-20003, 'no se encontro el trabajador');
    END IF;
    
    UPDATE TRABAJADOR
    SET TRABAJADOR.nombre = p_nombre
    WHERE TRABAJADOR.CEDULATRABAJO = p_cedula;    
    
    
    
    
END;
/
CREATE OR REPLACE PROCEDURE updateTrabajadorSalario(
p_cedula TRABAJADOR.CEDULATRABAJO%type,
p_sueldo TRABAJADOR.SALARIO%TYPE
)
IS
    v_count NUMBER;
BEGIN 

    SELECT COUNT(*)
    INTO v_count
    FROM TRABAJADOR 
    WHERE TRABAJADOR.CEDULATRABAJO = p_cedula AND TRABAJADOR.ESTADO = 1;
    
    if v_count = 0 then 
        RAISE_APPLICATION_ERROR(-20003, 'no se encontro el trabajador');
    END IF;
    
    UPDATE TRABAJADOR
    SET TRABAJADOR.SALARIO = p_sueldo  
    WHERE TRABAJADOR.CEDULATRABAJO = p_cedula;    
    
    
END;
/
CREATE OR REPLACE PROCEDURE updateTrabajadorCargo(
p_cedula TRABAJADOR.CEDULATRABAJO%type,
p_cargo TRABAJADOR.CARGO%TYPE
)
IS
    v_count NUMBER;
BEGIN 

    SELECT COUNT(*)
    INTO v_count
    FROM TRABAJADOR 
    WHERE TRABAJADOR.CEDULATRABAJO = p_cedula AND TRABAJADOR.ESTADO = 1;
    
    if v_count = 0 then 
        RAISE_APPLICATION_ERROR(-20003, 'no se encontro el trabajador');
    END IF;
    
    UPDATE TRABAJADOR
    SET TRABAJADOR.CARGO = p_cargo  
    WHERE TRABAJADOR.CEDULATRABAJO = p_cedula;    
    
    
END;
/
-- CRUD SUCURSAL

--INSERTAR SUCURSAL
CREATE OR REPLACE PROCEDURE insertSucursal(
    p_idSucursal NUMBER, 
    p_nombre VARCHAR2, 
    p_telefono VARCHAR2,
    p_capital NUMBER,
    p_direccion VARCHAR2
)
IS
    v_numSucursales NUMBER;
BEGIN 
    SELECT COUNT(*) 
    INTO v_numSucursales
    FROM SUCURSAL
    WHERE idSucursal = p_idSucursal;

    IF v_numSucursales = 1 THEN
        RAISE_APPLICATION_ERROR(-20003, 'La sucursal ya existe');
    END IF;

    INSERT INTO SUCURSAL VALUES (p_idSucursal, p_nombre, p_telefono, p_direccion, p_capital,1);

END;
/
--ELIMINAR SUCURSAL
--Toma por parametro el id de la sucursal
CREATE OR REPLACE PROCEDURE deleteSucursal(p_idSucursal SUCURSAL.IDSUCURSAL%type )
IS
v_count NUMBER;
BEGIN
--Busca el la sucursal en la tabla 
SELECT COUNT(*)
INTO v_count 
FROM SUCURSAL
WHERE SUCURSAL.IDSUCURSAL = p_idSucursal;

--Lanza la error en caso de que no se encuentre
if v_count = 0 then 
    RAISE_APPLICATION_ERROR(-20003, 'no se encontro la Sucursal');
END IF;
--coloca en estado de "borrado" 
    UPDATE SUCURSAL
    SET SUCURSAL.ESTADO = 0
    WHERE SUCURSAL.IDSUCURSAL = p_idSucursal;    
END;
/
--ACTIVAR SUCURSAL
CREATE OR REPLACE PROCEDURE activateSucursal(p_idSucursal SUCURSAL.IDSUCURSAL%type )
IS
v_count NUMBER;
BEGIN
--Busca el la sucursal en la tabla 
SELECT COUNT(*)
INTO v_count 
FROM SUCURSAL
WHERE SUCURSAL.IDSUCURSAL = p_idSucursal;

--Lanza la error en caso de que no se encuentre
if v_count = 0 then 
    RAISE_APPLICATION_ERROR(-20003, 'no se encontro la Sucursal');
END IF;
--coloca en estado de "borrado" 
    UPDATE SUCURSAL
    SET SUCURSAL.ESTADO = 1
    WHERE SUCURSAL.IDSUCURSAL = p_idSucursal;    
END;
/
--ACTUALIZAR TEL�FONO SUCURSAL
CREATE OR REPLACE PROCEDURE updateSucursalTelefono(
p_idSucursal SUCURSAL.IDSUCURSAL%type,
p_telefono SUCURSAL.TELEFONO%TYPE
)
IS
    v_count NUMBER;
    v_id NUMBER;
BEGIN 

    SELECT COUNT(*)
    INTO v_count
    FROM SUCURSAL
    WHERE SUCURSAL.IDSUCURSAL = p_idSucursal AND SUCURSAL.ESTADO = 1;
    
 
    
    if (v_count = 0 )  then 
        RAISE_APPLICATION_ERROR(-20003, 'no se encontro la sucursal');
    END IF;
        
    UPDATE SUCURSAL
    SET SUCURSAL.telefono = p_telefono
    WHERE SUCURSAL.IDSUCURSAL = p_idSucursal;    
END;
/
--ACTUALIZAR NOMBRE SUCURSAL
CREATE OR REPLACE PROCEDURE updateSucursalNombre(
p_idSucursal SUCURSAL.IDSUCURSAL%type,
p_nombre SUCURSAL.nombre%type
)
IS
    v_count NUMBER;
BEGIN 

    SELECT COUNT(*)
    INTO v_count
    FROM SUCURSAL 
    WHERE SUCURSAL.IDSUCURSAL = p_idSucursal AND SUCURSAL.ESTADO = 1;
    
    if v_count = 0 then 
        RAISE_APPLICATION_ERROR(-20003, 'no se encontro la sucursal');
    END IF;
    
    UPDATE SUCURSAL
    SET SUCURSAL.nombre = p_nombre
    WHERE SUCURSAL.IDSUCURSAL = p_idSucursal;    
      
END;
/
--ACTUALIZAR CAPITAL SUCURSAL
CREATE OR REPLACE PROCEDURE updateSucursalCapital (
p_idSucursal SUCURSAL.IDSUCURSAL%type,
p_capital SUCURSAL.capital%type
)
IS
    v_count NUMBER;
BEGIN 

    SELECT COUNT(*)
    INTO v_count
    FROM SUCURSAL 
    WHERE SUCURSAL.IDSUCURSAL = p_idSucursal AND SUCURSAL.ESTADO = 1;
    
    if v_count = 0 then 
        RAISE_APPLICATION_ERROR(-20003, 'no se encontro la sucursal');
    END IF;
    
    UPDATE SUCURSAL
    SET SUCURSAL.capital = p_capital
    WHERE SUCURSAL.IDSUCURSAL = p_idSucursal;    
      
END;
/
--ACTUALIZAR DIRECCION SUCURSAL
CREATE OR REPLACE PROCEDURE updateSucursalDireccion (
p_idSucursal SUCURSAL.IDSUCURSAL%type,
p_direccion SUCURSAL.direccion%type
)
IS
    v_count NUMBER;
BEGIN 

    SELECT COUNT(*)
    INTO v_count
    FROM SUCURSAL 
    WHERE SUCURSAL.IDSUCURSAL = p_idSucursal AND SUCURSAL.ESTADO = 1;
    
    if v_count = 0 then 
        RAISE_APPLICATION_ERROR(-20003, 'no se encontro la sucursal');
    END IF;
    
    UPDATE SUCURSAL
    SET SUCURSAL.direccion = p_direccion
    WHERE SUCURSAL.IDSUCURSAL = p_idSucursal;    
      
END;
/
--CRUD PRODUCTO
--obtener productos


--INSERTAR
CREATE OR REPLACE PROCEDURE insertProducto(
    p_nombre        IN  producto.nombre%TYPE,
    p_descripcion   IN  producto.descripcion%TYPE,
    p_precioActual  IN  producto.precioActual%TYPE,
    p_categoria     IN  producto.categoria%TYPE
)
IS
    v_contador    NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO v_contador
    FROM producto
    WHERE nombre = p_nombre AND activado = 1;
    
    IF v_contador > 0 THEN
        RAISE_APPLICATION_ERROR(-20111, 'Ya existe un producto activo con el mismo nombre');
    END IF;

    INSERT INTO PRODUCTO (nombre, descripcion, precioActual, activado, categoria)
    VALUES (p_nombre, p_descripcion, p_precioActual, 1, p_categoria);
    DBMS_OUTPUT.PUT_LINE('Producto insertado correctamente');
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocurri� un error al insertar el producto: ' || SQLERRM);
END;
/
--ACTUALIZAR
CREATE OR REPLACE PROCEDURE updateProducto(
    p_idProducto    IN  producto.idProducto%TYPE,
    p_nombre        IN  producto.nombre%TYPE,
    p_descripcion   IN  producto.descripcion%TYPE,
    p_precioActual  IN  producto.precioActual%TYPE,
    p_categoria     IN  producto.categoria%TYPE
)
IS
    v_contador  NUMBER;
    v_estado    NUMBER;
BEGIN
    SELECT COUNT(*)
    INTO v_contador
    FROM producto
    WHERE (nombre LIKE p_nombre) AND (activado = 1) AND ( NOT (PRODUCTO.IDPRODUCTO=p_idProducto));
    
    IF v_contador > 0 THEN
        RAISE_APPLICATION_ERROR(-20111, 'Ya existe un producto activo con el mismo nombre');
    END IF;

    SELECT activado INTO v_estado FROM producto WHERE idProducto = p_idProducto;
    
    IF v_estado IS NOT NULL THEN
        IF v_estado = 0 THEN
            DBMS_OUTPUT.PUT_LINE('No se puede actualizar. El producto est� desactivado.');
        ELSE
            UPDATE PRODUCTO
            SET nombre = p_nombre,
                descripcion = p_descripcion,
                precioActual = p_precioActual,
                categoria = p_categoria
            WHERE idProducto = p_idProducto;
            DBMS_OUTPUT.PUT_LINE('Producto actualizado correctamente.');
        END IF;
    ELSE
        DBMS_OUTPUT.PUT_LINE('No se puede actualizar. El producto no existe.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocurri� un error al actualizar el producto: ' || SQLERRM);
END;
/
CREATE OR REPLACE PROCEDURE actualizarNombreProducto(
    p_idProducto IN NUMBER,
    p_nombre IN VARCHAR2
)
IS
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM Producto WHERE idProducto = p_idProducto;
    
    IF v_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: El producto con el ID especificado no existe.');
    ELSE
        UPDATE Producto SET nombre = p_nombre 
        WHERE idProducto = p_idProducto;
        DBMS_OUTPUT.PUT_LINE('Nombre del producto actualizado correctamente.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error al actualizar el nombre del producto: ' || SQLERRM);
END;
/
CREATE OR REPLACE PROCEDURE actualizarPrecioProducto(
    p_idProducto IN NUMBER,
    p_precio IN NUMBER
)
IS
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM Producto WHERE idProducto = p_idProducto;
    
    IF v_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: El producto con el ID especificado no existe.');
    ELSE
        UPDATE Producto SET precioActual = p_precio 
        WHERE idProducto = p_idProducto;
        DBMS_OUTPUT.PUT_LINE('Precio del producto actualizado correctamente.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error al actualizar el precio del producto: ' || SQLERRM);
END;
/
CREATE OR REPLACE PROCEDURE actualizarDescripcionProducto(
    p_idProducto IN NUMBER,
    p_descripcion IN VARCHAR2
)
IS
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM Producto WHERE idProducto = p_idProducto;
    
    IF v_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: El producto con el ID especificado no existe.');
    ELSE
        UPDATE Producto SET descripcion = p_descripcion 
        WHERE idProducto = p_idProducto;
        DBMS_OUTPUT.PUT_LINE('Descripci�n del producto actualizada correctamente.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error al actualizar la descripci�n del producto: ' || SQLERRM);
END;
/
--DESACTIVAR Y ACTIVAR
CREATE OR REPLACE PROCEDURE desactivarProducto(
    p_idProducto IN  producto.idProducto%TYPE
)
IS
    v_estado    producto.activado%TYPE;
BEGIN
    SELECT activado INTO v_estado FROM producto WHERE idProducto = p_idProducto;
    IF v_estado IS NOT NULL THEN
        IF v_estado = 0 THEN
            DBMS_OUTPUT.PUT_LINE('El producto ya est� desactivado.');
        ELSE
            UPDATE Producto SET activado = 0 WHERE idProducto = p_idProducto;
            DBMS_OUTPUT.PUT_LINE('Producto desactivado correctamente.');
        END IF;
    END IF;
    
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20113, 'El producto que quiere desactivar no existe');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocurri� un error al desactivar el producto: ' || SQLERRM);
END;
/
CREATE OR REPLACE PROCEDURE activarProducto(
    p_idProducto IN  producto.idProducto%TYPE
)
IS
    v_estado    producto.activado%TYPE;
BEGIN
    SELECT activado INTO v_estado FROM producto WHERE idProducto = p_idProducto;
    IF v_estado IS NOT NULL THEN
        IF v_estado = 1 THEN
            DBMS_OUTPUT.PUT_LINE('El producto ya est� activado.');
        ELSE
            UPDATE Producto SET activado = 1 WHERE idProducto = p_idProducto;
            DBMS_OUTPUT.PUT_LINE('Producto activado correctamente.');
        END IF;
    END IF;
EXCEPTION
    WHEN NO_DATA_FOUND THEN
        RAISE_APPLICATION_ERROR(-20113, 'El producto que quiere activar no existe');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocurri� un error al desactivar el producto: ' || SQLERRM);
END;
/
--CRUD CLIENTE
--INSERTAR
CREATE OR REPLACE PROCEDURE insertarCliente(
    p_cedulaCliente     IN cliente.cedulaCliente%TYPE,
    p_nombre            IN cliente.nombre%TYPE,
    p_correo            IN cliente.correo%TYPE,
    p_fechaNacimiento   IN cliente.fechaNacimiento%TYPE
)
IS
BEGIN
    INSERT INTO cliente (CEDULACLIENTE, NOMBRE, CORREO, FECHANACIMIENTO) 
    VALUES (p_cedulaCliente, p_nombre, p_correo, p_fechaNacimiento);
    DBMS_OUTPUT.PUT_LINE('Cliente insertado correctamente.');
EXCEPTION
    WHEN DUP_VAL_ON_INDEX THEN
        DBMS_OUTPUT.PUT_LINE('Error: La c�dula del cliente ya existe.');
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error al insertar el cliente: ' || SQLERRM);
END;
/
--ACTUALIZAR (no se puede modificar ni c�dula ni fecha de nacimiento)
CREATE OR REPLACE PROCEDURE actualizarCliente(
    p_cedulaCliente     IN cliente.cedulaCliente%TYPE,
    p_nombre            IN cliente.nombre%TYPE,
    p_correo            IN cliente.correo%TYPE
)
IS
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM cliente WHERE cedulaCliente = p_cedulaCliente;    
    IF v_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: El cliente con la c�dula especificada no existe.');
    ELSE
        UPDATE CLIENTE SET NOMBRE = p_nombre, CORREO = p_correo 
        WHERE CEDULACLIENTE = p_cedulaCliente;
        DBMS_OUTPUT.PUT_LINE('Cliente actualizado correctamente.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error al actualizar el cliente: ' || SQLERRM);
END; 
/
CREATE OR REPLACE PROCEDURE actualizarNombreCliente(
    p_cedulaCliente IN NUMBER,
    p_nombre IN VARCHAR2
)
IS
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM CLIENTE WHERE CEDULACLIENTE = p_cedulaCliente;
    
    IF v_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: El cliente con la c�dula especificada no existe.');
    ELSE
        UPDATE CLIENTE SET NOMBRE = p_nombre 
        WHERE CEDULACLIENTE = p_cedulaCliente;
        DBMS_OUTPUT.PUT_LINE('Nombre del cliente actualizado correctamente.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error al actualizar el nombre del cliente: ' || SQLERRM);
END;
/
CREATE OR REPLACE PROCEDURE actualizarCorreoCliente(
    p_cedulaCliente IN NUMBER,
    p_correo IN VARCHAR2
)
IS
    v_count NUMBER;
BEGIN
    SELECT COUNT(*) INTO v_count FROM CLIENTE WHERE CEDULACLIENTE = p_cedulaCliente;
    
    IF v_count = 0 THEN
        DBMS_OUTPUT.PUT_LINE('Error: El cliente con la c�dula especificada no existe.');
    ELSE
        UPDATE CLIENTE SET CORREO = p_correo 
        WHERE CEDULACLIENTE = p_cedulaCliente;
        DBMS_OUTPUT.PUT_LINE('Correo del cliente actualizado correctamente.');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Error al actualizar el correo del cliente: ' || SQLERRM);
END;
/
--ELIMINAR
--Para la tabla cliente, no se tendr� en cuenta el crud de eliminaci�n, ya que no
--es relevante para la el contexto del discurso. Nunca nos importa si el cliente est�
--desactivado o no. Siempre lo tenemos en cuenta para promociones.

--CRUD LOTE:
--INSERTAR:
CREATE OR REPLACE PROCEDURE insertLote(
    p_ID                         IN  lote.idLote%TYPE,
    p_FechaProduccion            IN  VARCHAR2,
    p_FechaVencimiento           IN  VARCHAR2
)
IS
    v_contador    NUMBER;
    v_FechaProduccion DATE;
    v_FechaVencimiento DATE;
BEGIN
    SELECT COUNT(*)
    INTO v_contador
    FROM lote
    WHERE idLote = p_ID;
     v_FechaProduccion:= TO_DATE(p_FechaProduccion,'DD-MM-YYYY');
     v_FechaVencimiento:= TO_DATE(p_FechaVencimiento,'DD-MM-YYYY');
    IF v_contador > 0 THEN
        RAISE_APPLICATION_ERROR(-20111, 'Ya existe el lote ingresado');
    ELSE
    IF v_FechaProduccion>=v_fechavencimiento OR v_fechaproduccion>=SYSDATE THEN
     RAISE_APPLICATION_ERROR(-20112, 'La fecha de produccion no puede ser posterior a la de vencimiento,ni a la actual');
     End IF;
      IF(v_fechavencimiento<=SYSDATE) THEN 
      RAISE_APPLICATION_ERROR(-20113, 'La fecha de vencimiento no puede ser posterior a la actual,ya que el producto estaria vencido');
      ELSE
       INSERT INTO LOTE VALUES (p_id, v_fechaproduccion, v_fechavencimiento);
        DBMS_OUTPUT.PUT_LINE('Lote insertado correctamente');
      END IF;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        DBMS_OUTPUT.PUT_LINE('Ocurri� un error al insertar el lote�pl: ' || SQLERRM);
END;
/
--ACTUALIZAR
--Para la tabla Lote, no se tendr� en cuenta el crud de actualizaci�m, debido a
--que el atributo de id no se debe actualizar ya que es clave primaria y al actualizarlo
--se perder�an o se confundir�an los registros.Las fechas de vencimiento y producci�n por su 
--parte no se deben actualizar porque puede comprometer la integridad de los datos,adem�s 
-- que ser�a incorrecto modificarlos ya que estos atributos son inherentes al producto, 
--y el cambiarlos aumentar�a el riesgo de distribuir productos caducados.

--ELIMINAR
--Para la tabla Lote, no se tendr� en cuenta el crud de eliminaci�n, ya que al estar
--en producto compra el lote se vuelve un dato que se debe conservar en el tiempo y por 
--esta raz�n,no lo eliminamos.

--CRUD INVENTARIO SUCURSAL:
--Para la tabla de inventarioSucursal no se har� ning�n crud ya que 
--los cambios de los datos se har�n autom�ticamente de la transacciones
--de compra y venta.Tambi�n se hace para mantener un registro hist�rico
--preciso y como medida de seguridad  para evitar modificaciones no 
--autorizadas o accidentales en datos cr�ticos del inventario.


