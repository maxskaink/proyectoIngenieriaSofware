CREATE OR REPLACE PACKAGE paquete_gestionContable AS
  --Función que reciba como parámetro el id del cliente y devuelva el porcentaje de descuento total que se le puede hacer por fidelización
  FUNCTION descuentoCliente(p_clienteId CLIENTE.CEDULACLIENTE%type)
    RETURN number;
  --Procedimiento que reciba como parámetro el porcentaje que se le quiere subir o bajar el precio a todos los productos de una sucursal.
  PROCEDURE cambiarPreciosTodo(p_porcentajeCambio number);

    -- Crear un tipo de registro para almacenar los detalles de una compra
  TYPE compra_detalle IS RECORD (
    idProducto PRODUCTO.IDPRODUCTO%TYPE,
    nombreProducto PRODUCTO.NOMBRE%TYPE,
    fechaCompra PEDIDO.FECHA%TYPE,
    cantidad PRODUCTOVENTA.CANTIDAD%TYPE,
    precioUnitario PRODUCTOVENTA.PRECIOUNITARIO%TYPE
  );

  -- Crear un tipo de tabla para almacenar una lista de detalles de compra
  TYPE compras_tabla IS TABLE OF compra_detalle INDEX BY PLS_INTEGER;

  -- Procedimiento para generar un historial de compras para un cliente específico
  PROCEDURE historial_compras_cliente (
    p_cedulaCliente IN CLIENTE.CEDULACLIENTE%TYPE,
    p_historial OUT compras_tabla
  );

    -- Crear un tipo de registro para almacenar los detalles de un cliente
  TYPE cliente_detalle IS RECORD (
    cedulaCliente CLIENTE.CEDULACLIENTE%TYPE,
    nombreCliente CLIENTE.NOMBRE%TYPE,
    montoTotal NUMBER
  );

  -- Crear un tipo de tabla para almacenar una lista de detalles de clientes
  TYPE clientes_tabla IS TABLE OF cliente_detalle INDEX BY PLS_INTEGER;

  -- Función para identificar a los principales clientes basados en el monto total gastado en el último mes
  FUNCTION principales_clientes_ultimo_mes RETURN clientes_tabla;

  --  Crear un tipo de registro para almacenar los detalles de un producto en cierta sucursal
  TYPE producto_sucursal_detalle IS RECORD (
    idProducto PRODUCTO.IDPRODUCTO%TYPE,
    nombreProducto PRODUCTO.NOMBRE%TYPE,
    descripcionProducto PRODUCTO.DESCRIPCION%TYPE,
    precioActual PRODUCTO.PRECIOACTUAL%TYPE,
    activo PRODUCTO.ACTIVADO%TYPE,
    categoria PRODUCTO.CATEGORIA%TYPE,
    idSucursal SUCURSAL.IDSUCURSAL%TYPE,
    CANTIDAD INVENTARIOSUCURSAL.CANTIDAD%TYPE
  );

  -- Crear un tipo de tabla para almacenar una lista de detalles de compra
  TYPE producto_sucursal_tabla IS TABLE OF producto_sucursal_detalle INDEX BY PLS_INTEGER;

  -- Función para obtener los productos en inventario de una sucursal
  FUNCTION productos_inventario_sucursal(p_idSucursal SUCURSAL.IDSUCURSAL%TYPE)
    RETURN producto_sucursal_tabla;
  
  -- Crear un tipo de registro para almacenar los detalles de productos activos
  TYPE producto_detalle IS RECORD (
    idProducto PRODUCTO.IDPRODUCTO%TYPE,
    nombreProducto PRODUCTO.NOMBRE%TYPE,
    descripcionProducto PRODUCTO.DESCRIPCION%TYPE,
    precioActual PRODUCTO.PRECIOACTUAL%TYPE,
    activo PRODUCTO.ACTIVADO%TYPE,
    categoria PRODUCTO.CATEGORIA%TYPE
  );

  -- Crear un tipo de tabla para almacenar una lista de detalles de productos activos
  TYPE productos_tabla IS TABLE OF producto_detalle INDEX BY PLS_INTEGER;

  -- Función para obtener los productos activos
  FUNCTION productos_activos 
    RETURN productos_tabla;

  -- Función para obtener los detalles de un producto por su ID
  FUNCTION producto_by_id(p_idProducto PRODUCTO.IDPRODUCTO%TYPE)
    RETURN producto_detalle;

  -- Crear un tipo de tabla para almacenar una lista de categorias
  TYPE categorias_tabla IS TABLE OF PRODUCTO.CATEGORIA%TYPE INDEX BY PLS_INTEGER;

  -- Función para obtener las categorias de los productos
  FUNCTION categorias_productos
    RETURN categorias_tabla;
  
  -- Función para obtner el capital actual de cierta sucursal
  FUNCTION capital_sucursal(p_idSucursal SUCURSAL.IDSUCURSAL%TYPE)
    RETURN NUMBER;
END paquete_gestionContable;
/

CREATE OR REPLACE PACKAGE BODY paquete_gestionContable AS
  --Función que reciba como parámetro el id del cliente y devuelva el porcentaje de descuento total que se le puede hacer por fidelización
  FUNCTION descuentoCliente(p_clienteId CLIENTE.CEDULACLIENTE%type)
    RETURN number
  IS
    v_fechaNacimiento date;
  BEGIN
    select FECHANACIMIENTO 
    into v_fechaNacimiento
    from CLIENTE 
    where CEDULACLIENTE = p_clienteId;
    
    IF (to_char(v_fechaNacimiento, 'DD/MM') like to_char(SYSDATE, 'DD/MM') ) THEN 
      RETURN 0.15;
    ELSE 
      RETURN  0;
    END IF;
  END descuentoCliente;
    
  --Procedimiento que reciba como parámetro el porcentaje que se le quiere subir o bajar el precio a todos los productos de una sucursal.
  PROCEDURE cambiarPreciosTodo(p_porcentajeCambio number) IS
  BEGIN 
    UPDATE Producto  set PrecioActual = PrecioActual*(1-p_porcentajeCambio);
  END cambiarPreciosTodo;

  -- Procedimiento para generar un historial de compras para un cliente específico
  PROCEDURE historial_compras_cliente (
    p_cedulaCliente IN CLIENTE.CEDULACLIENTE%TYPE,
    p_historial OUT compras_tabla
  ) AS
    v_historial compras_tabla;
    v_index PLS_INTEGER := 0;
  BEGIN
    FOR v_compra IN (
      SELECT
        pv.idproducto,
        p.nombre,
        pe.fecha,
        pv.cantidad,
        pv.preciounitario
      FROM
        productoventa pv
        JOIN pedido pe ON pv.codigoventa = pe.codigopedido
        JOIN producto p ON pv.idproducto = p.idproducto
      WHERE
        pe.cedulacliente = p_cedulaCliente
      ORDER BY
        pe.fecha
    ) LOOP
      v_index := v_index + 1;
      v_historial(v_index).idProducto := v_compra.idproducto;
      v_historial(v_index).nombreProducto := v_compra.nombre;
      v_historial(v_index).fechaCompra := v_compra.fecha;
      v_historial(v_index).cantidad := v_compra.cantidad;
      v_historial(v_index).precioUnitario := v_compra.preciounitario;
    END LOOP;

    p_historial := v_historial;
  END historial_compras_cliente;

  FUNCTION principales_clientes_ultimo_mes RETURN clientes_tabla AS
    v_clientes clientes_tabla;
    v_index PLS_INTEGER := 0;
  BEGIN
    FOR v_cliente IN (
      SELECT
        c.cedulacliente,
        c.nombre,
        SUM(pv.preciounitario * pv.cantidad) AS montoTotal
      FROM
        cliente c
        JOIN pedido pe ON c.cedulacliente = pe.cedulacliente
        JOIN productoventa pv ON pe.codigopedido = pv.codigoventa
      WHERE
        pe.fecha BETWEEN ADD_MONTHS(SYSDATE, -1) AND SYSDATE
      GROUP BY
        c.cedulacliente,
        c.nombre
      ORDER BY
        montoTotal DESC
    ) LOOP
      v_index := v_index + 1;
      v_clientes(v_index).cedulaCliente := v_cliente.cedulacliente;
      v_clientes(v_index).nombreCliente := v_cliente.nombre;
      v_clientes(v_index).montoTotal := v_cliente.montoTotal;
    END LOOP;

    RETURN v_clientes;
  END principales_clientes_ultimo_mes;

  FUNCTION productos_inventario_sucursal(p_idSucursal SUCURSAL.IDSUCURSAL%TYPE) 
  RETURN producto_sucursal_tabla
  IS
    v_productos producto_sucursal_tabla;
    v_index PLS_INTEGER := 0;
  BEGIN
    FOR v_producto IN (
      SELECT 
        * 
      FROM 
        productos_inventario 
      WHERE 
        idSucursal = p_idSucursal OR 
        nvl(idSucursal, 0) = 0
    ) LOOP
      v_index := v_index + 1;
      v_productos(v_index).idProducto := v_producto.idproducto;
      v_productos(v_index).nombreProducto := v_producto.nombre;
      v_productos(v_index).descripcionProducto := v_producto.descripcion;
      v_productos(v_index).precioActual := v_producto.precioactual;
      v_productos(v_index).activo := v_producto.activado;
      v_productos(v_index).categoria := v_producto.categoria;
      v_productos(v_index).idSucursal := v_producto.idsucursal;
      v_productos(v_index).cantidad := v_producto.cantidad;
    END LOOP;

    RETURN v_productos;
  END productos_inventario_sucursal;

  FUNCTION productos_activos
   RETURN productos_tabla
  IS
    v_productos productos_tabla;
    v_index PLS_INTEGER := 0;
  BEGIN
    FOR v_producto IN (
      SELECT 
        *
      FROM
        producto
      WHERE
        activado = 1
    ) LOOP
      v_index := v_index + 1;
      v_productos(v_index).idProducto := v_producto.idproducto;
      v_productos(v_index).nombreProducto := v_producto.nombre;
      v_productos(v_index).descripcionProducto := v_producto.descripcion;
      v_productos(v_index).precioActual := v_producto.precioactual;
      v_productos(v_index).activo := 1;
      v_productos(v_index).categoria := v_producto.categoria;
    END LOOP;

    RETURN v_productos;
  END productos_activos;

  FUNCTION producto_by_id(p_idProducto PRODUCTO.IDPRODUCTO%TYPE)
    RETURN producto_detalle
  IS
    v_producto producto_detalle;
  BEGIN
    SELECT
      *
    INTO
      v_producto
    FROM
      producto
    WHERE
      idproducto = p_idProducto;

    RETURN v_producto;
  END producto_by_id;
  
  FUNCTION categorias_productos
    RETURN categorias_tabla
  IS
    v_categorias categorias_tabla;
    v_index PLS_INTEGER := 0;
  BEGIN
    FOR v_categoria IN (
      SELECT DISTINCT
        categoria
      FROM
        producto
    ) LOOP
      v_index := v_index + 1;
      v_categorias(v_index) := v_categoria.categoria;
    END LOOP;

    RETURN v_categorias;
  END categorias_productos;

END paquete_gestionContable;

--Hacer triger de pedido para calcular el descuento si la compra se realizo en el cumple del cliente
