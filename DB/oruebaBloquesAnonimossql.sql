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
  v_clientes paquete_gestionContable.clientes_tabla;
  v_index PLS_INTEGER;
BEGIN
  v_clientes := paquete_gestionContable.principales_clientes_ultimo_mes;

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