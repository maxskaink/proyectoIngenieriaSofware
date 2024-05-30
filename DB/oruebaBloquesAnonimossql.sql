set serveroutput on;
DECLARE
    P_HISTORIAL PAQUETE_GESTIONCONTABLE.COMPRAS_TABLA; -- Variable para almacenar el resultado

BEGIN
    PAQUETE_GESTIONCONTABLE.HISTORIAL_COMPRAS_CLIENTE(1059234957,P_HISTORIAL);

    IF P_HISTORIAL.COUNT > 0 THEN
        -- Imprimir la información del historial de compras
        FOR i IN P_HISTORIAL.FIRST..P_HISTORIAL.LAST LOOP
            DBMS_OUTPUT.PUT('Id producto ' || i || ': ' || P_HISTORIAL(i).idProducto);
            DBMS_OUTPUT.PUT('nombre ' || i || ': ' || P_HISTORIAL(i).nombreProducto);
            DBMS_OUTPUT.PUT('fecha ' || i || ': ' || P_HISTORIAL(i).fechaCompra);
            DBMS_OUTPUT.PUT('cantidad ' || i || ': ' || P_HISTORIAL(i).cantidad);
            DBMS_OUTPUT.PUT_LINE('precio unitario ' || i || ': ' || P_HISTORIAL(i).precioUnitario);
            
            -- Agrega aquí cualquier otra información que desees mostrar
        END LOOP;
    ELSE
        DBMS_OUTPUT.PUT_LINE('No resultados');
    END IF;
END;
/
DECLARE
  v_clientes paquete_gestionContable.clientesCore_tabla;
  v_index PLS_INTEGER;
BEGIN
  v_clientes := paquete_gestionContable.principales_clientes_ultimo_mes();

  v_index := v_clientes.FIRST;
  WHILE v_index IS NOT NULL LOOP
    DBMS_OUTPUT.PUT_LINE('Cliente ' || v_index || ': ' || v_clientes(v_index).cedulaCliente || ', ' || v_clientes(v_index).nombreCliente || ', ' || v_clientes(v_index).montoTotal);
    v_index := v_clientes.NEXT(v_index);
  END LOOP;
END;
/
set SERVEROUT on;
DECLARE
  -- Declarar variables para los parámetros
  v_nitProveedor COMPRA.NIT%TYPE := 987654321;  -- Reemplaza con un valor válido
  v_idSucursal COMPRA.IDSUCURSAL%TYPE := 1;  -- Reemplaza con un valor válido

  -- Declarar la tabla de productos
  v_productos TRANSACCIONES.PRODUCTOS_TABLA;

BEGIN
  -- Inicializar la tabla de productos
  v_productos := TRANSACCIONES.PRODUCTOS_TABLA();

  v_productos(1).idProducto := 2;  -- Reemplaza con un valor válido
  v_productos(1).cantidad := 10;  -- Reemplaza con un valor válido
  v_productos(1).precioUnitario := 100;  -- Reemplaza con un valor válido
  v_productos(1).idLote := 1;  -- Reemplaza con un valor válido

  -- Llamar al procedimiento
  TRANSACCIONES.insertCompra(v_nitProveedor, v_idSucursal, v_productos);
END;



--Pruebas cursores paqueteGestionContable
set SERVEROUT on;
DECLARE
  v_producto paquete_gestionContable.c_productos%ROWTYPE;
BEGIN
  OPEN paquete_gestionContable.c_productos(1); 
  LOOP
    FETCH paquete_gestionContable.c_productos INTO v_producto;
    EXIT WHEN paquete_gestionContable.c_productos%NOTFOUND;
    DBMS_OUTPUT.PUT_LINE('ID Producto: ' || v_producto.idProducto || ', ID Sucursal: ' || v_producto.idSucursal || ', Cantidad: ' || v_producto.cantidad);
  END LOOP;
  CLOSE paquete_gestionContable.c_productos;
END;

DECLARE
  v_compra paquete_gestionContable.c_compras%ROWTYPE;
BEGIN
  OPEN paquete_gestionContable.c_compras(987654); 
  LOOP
    FETCH paquete_gestionContable.c_compras INTO v_compra;
    EXIT WHEN paquete_gestionContable.c_compras%NOTFOUND;
    DBMS_OUTPUT.PUT_LINE('Código Compra: ' || v_compra.CODIGOCOMPRA || ', NIT: ' || v_compra.NIT || ', Fecha: ' || v_compra.FECHA || ', Precio Total: ' || v_compra.PRECIOTOTAL);
  END LOOP;
  CLOSE paquete_gestionContable.c_compras;
END;

DECLARE
  v_cliente paquete_gestionContable.c_clientes%ROWTYPE;
BEGIN
  OPEN paquete_gestionContable.c_clientes(TO_DATE('2000-01-01', 'YYYY-MM-DD'))
  LOOP
    FETCH paquete_gestionContable.c_clientes INTO v_cliente;
    EXIT WHEN paquete_gestionContable.c_clientes%NOTFOUND;
    DBMS_OUTPUT.PUT_LINE('Cédula Cliente: ' || v_cliente.cedulaCliente || ', Nombre: ' || v_cliente.NOMBRE || ', Fecha Nacimiento: ' || v_cliente.FECHANACIMIENTO);
  END LOOP;
  CLOSE paquete_gestionContable.c_clientes;
END;

-- PRUEBA FUNCIONALIDADES
set SERVEROUT on;

-- calcular el descuento del cliente
DECLARE
  v_descuento number;
BEGIN
  v_descuento := paquete_gestionContable.descuentoCliente(1059234957);
  DBMS_OUTPUT.PUT_LINE('Descuento: ' || v_descuento);
END;

--Cambiar precio todo, sube o baja el precio de los productos con cierto porcentaje

BEGIN
  paquete_gestionContable.cambiarPreciosTodo(0.1);
END;

-- Obtiene el historial de compras de cierto cliente

DECLARE
  v_historial paquete_gestionContable.compras_tabla;
BEGIN
  paquete_gestionContable.historial_compras_cliente( 1059234957, v_historial);
  FOR i IN 1..v_historial.COUNT LOOP
    DBMS_OUTPUT.PUT_LINE('Producto: ' || v_historial(i).nombreProducto || ', Fecha: ' || v_historial(i).fechaCompra);
  END LOOP;
END;

--Obtiene la cantidad de productos en cada sucursal

DECLARE
  v_productos paquete_gestionContable.producto_sucursal_tabla;
BEGIN
  v_productos := paquete_gestionContable.productos_inventario_sucursal(1);
  FOR i IN 1..v_productos.COUNT LOOP
    DBMS_OUTPUT.PUT_LINE('Producto: ' || v_productos(i).nombreProducto || ', Cantidad: ' || v_productos(i).cantidad);
  END LOOP;
END;

-- Obtenemos un producto por su Id

DECLARE
  v_producto paquete_gestionContable.producto_detalle;
BEGIN
  v_producto := paquete_gestionContable.producto_by_id(1);
  DBMS_OUTPUT.PUT_LINE('Producto: ' || v_producto.nombreProducto);
END;

--Obtenemos la capital que hay en una sucursal por su Id

DECLARE
  v_capital SUCURSAL.CAPITAL%TYPE;
BEGIN
  v_capital := paquete_gestionContable.capital_sucursal(1);
  DBMS_OUTPUT.PUT_LINE('Capital: ' || v_capital);
END;

--Obtenemos las categorias de los productos
DECLARE
  v_categorias paquete_gestionContable.categorias_tabla;
BEGIN
  v_categorias := paquete_gestionContable.categorias_productos;
  FOR i IN 1..v_categorias.COUNT LOOP
    DBMS_OUTPUT.PUT_LINE('Categoría: ' || v_categorias(i));
  END LOOP;
END;

BEGIN
  insertTrabajador(
    123789, 
    1, 
    'Manuela catillo',
    'Administrador',
    1500000
  );
END;
set SERVEROUT on;
BEGIN 
  updatePedido(
    62,
    'Entregado'
  );
END;