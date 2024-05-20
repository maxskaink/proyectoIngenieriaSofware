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
  TYPE clienteCore_detalle IS RECORD (
    cedulaCliente CLIENTE.CEDULACLIENTE%TYPE,
    nombreCliente CLIENTE.NOMBRE%TYPE,
    montoTotal NUMBER
  );

  -- Crear un tipo de tabla para almacenar una lista de detalles de clientes
  TYPE clientesCore_tabla IS TABLE OF clienteCore_detalle INDEX BY PLS_INTEGER;

  -- Función para identificar a los principales clientes basados en el monto total gastado en el último mes
  FUNCTION principales_clientes_ultimo_mes RETURN clientesCore_tabla;

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

  -- Crear un tipo de tabla para almacenar una lista de detalles de un producto en un sucursal
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
  
  -- Función para obtener el capital total de una sucursal
  FUNCTION capital_sucursal(p_idSucursal SUCURSAL.IDSUCURSAL%TYPE)
    RETURN SUCURSAL.CAPITAL%TYPE;

  -- Crear un tipo de registro para almacenar los detalles de un proveedor
  TYPE proveedor_detalle IS RECORD (
    nit PROVEEDOR.NIT%TYPE,
    nombreProveedor PROVEEDOR.NOMBRE%TYPE,
    telefonoProveedor PROVEEDOR.TELEFONO%TYPE,
    direccionProveedor PROVEEDOR.DIRECCION%TYPE
  );

  -- Crear un tipo de tabla para almacenar una lista de detalles de proveedores
  TYPE proveedores_tabla IS TABLE OF proveedor_detalle INDEX BY PLS_INTEGER;

  -- Función para obtener los proveedores
  FUNCTION proveedores
    RETURN proveedores_tabla;

  -- Crear un tipo de registro para almacenar los detalles de un cliente
  TYPE cliente_detalle IS RECORD (
    cedulaCliente CLIENTE.CEDULACLIENTE%TYPE,
    nombreCliente CLIENTE.NOMBRE%TYPE,
    correoCliente CLIENTE.CORREO%TYPE,
    fechaNacCliente CLIENTE.FECHANACIMIENTO%TYPE
  );

  -- Crear un tipo de tabla para almacenar una lista de detalles de clientes
  TYPE clientes_tabla IS TABLE OF cliente_detalle INDEX BY PLS_INTEGER;

  -- Función para obtener los clientes
  FUNCTION clientes
    RETURN clientes_tabla;

  -- Crear un tipo de registro para almacenar los detalles de una sucursal
  TYPE sucursal_detalle IS RECORD (
    idSucursal SUCURSAL.IDSUCURSAL%TYPE,
    nombreSucursal SUCURSAL.NOMBRE%TYPE,
    telefonoSucursal SUCURSAL.TELEFONO%TYPE,
    capitalSucursal SUCURSAL.CAPITAL%TYPE,
    direccionSucursal SUCURSAL.DIRECCION%TYPE,
    estadoSucursal SUCURSAL.ESTADO%TYPE
  );

  -- Crear un tipo de tabla para almacenar una lista de detalles de sucursales
  TYPE sucursales_tabla IS TABLE OF sucursal_detalle INDEX BY PLS_INTEGER;

  -- Función para obtener las sucursales
  FUNCTION sucursales
    RETURN sucursales_tabla;

  -- Crear un tipo de registro para almacenar los detalles de un Lote
  TYPE lote_detalle IS RECORD (
    idLote LOTE.IDLOTE%TYPE,
    fechaProduccion LOTE.FECHAPRODUCCION%TYPE,
    fechaVencimiento LOTE.FECHAVENCIMIENTO%TYPE
  );

  -- Crear un tipo de tabla para almacenar una lista de detalles de Lotes
  TYPE lotes_tabla IS TABLE OF lote_detalle INDEX BY PLS_INTEGER;

  -- Función para obtener los lotes de un producto
  FUNCTION lotes_producto
    RETURN lotes_tabla;

  -- Crear un tipo de registro para almacenar los detalles de un Trabajador
  TYPE trabajador_detalle IS RECORD (
    CEDULATRABAJO TRABAJADOR.CEDULATRABAJO%TYPE,
    idSucursal TRABAJADOR.IDSUCURSAL%TYPE,    
    nombreTrabajador TRABAJADOR.NOMBRE%TYPE,
    cargoTrabajador TRABAJADOR.CARGO%TYPE,
    salarioTrabajador TRABAJADOR.SALARIO%TYPE,
    estadoTrabajador TRABAJADOR.ESTADO%TYPE
  );

  -- Crear un tipo de tabla para almacenar una lista de detalles de Trabajadores
  TYPE trabajadores_tabla IS TABLE OF trabajador_detalle INDEX BY PLS_INTEGER;

  -- Función para obtener los trabajadores
  FUNCTION trabajadores
    RETURN trabajadores_tabla;
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
    UPDATE Producto  set PrecioActual = PrecioActual*(1+p_porcentajeCambio);
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

  FUNCTION principales_clientes_ultimo_mes RETURN clientesCore_tabla AS
    v_clientes clientesCore_tabla;
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

  FUNCTION capital_sucursal(p_idSucursal SUCURSAL.IDSUCURSAL%TYPE)
    RETURN SUCURSAL.CAPITAL%TYPE
  IS
    v_capital SUCURSAL.CAPITAL%TYPE;
  BEGIN
    SELECT
      capital
    INTO
      v_capital
    FROM
      sucursal
    WHERE
      idsucursal = p_idSucursal;

    RETURN v_capital;
  END capital_sucursal;

  FUNCTION proveedores
    RETURN proveedores_tabla
  IS
    v_proveedores proveedores_tabla;
    v_index PLS_INTEGER := 0;
  BEGIN
    FOR v_proveedor IN (
      SELECT
        *
      FROM
        proveedor
    ) LOOP
      v_index := v_index + 1;
      v_proveedores(v_index).nit := v_proveedor.nit;
      v_proveedores(v_index).nombreProveedor := v_proveedor.nombre;
      v_proveedores(v_index).telefonoProveedor := v_proveedor.telefono;
      v_proveedores(v_index).direccionProveedor := v_proveedor.direccion;
    END LOOP;

    RETURN v_proveedores;
  END proveedores;

  FUNCTION clientes
    RETURN clientes_tabla
  IS
    v_clientes clientes_tabla;
    v_index PLS_INTEGER := 0;
  BEGIN
    FOR v_cliente IN (
      SELECT
        cedulacliente, nombre, correo, to_char(FECHANACIMIENTO, 'DD/MM/YYYY') AS FECHANACIMIENTO
      FROM
        cliente
    ) LOOP
      v_index := v_index + 1;
      v_clientes(v_index).cedulaCliente := v_cliente.cedulacliente;
      v_clientes(v_index).nombreCliente := v_cliente.nombre;
      v_clientes(v_index).correoCliente := v_cliente.correo;
      v_clientes(v_index).fechaNacCliente := v_cliente.fechanacimiento;
    END LOOP;

    RETURN v_clientes;
  END clientes;

  FUNCTION sucursales
    RETURN sucursales_tabla
  IS
    v_sucursales sucursales_tabla;
    v_index PLS_INTEGER := 0;
  BEGIN
    FOR v_sucursal IN (
      SELECT
        *
      FROM
        sucursal
      WHERE
        estado = 1
    ) LOOP
      v_index := v_index + 1;
      v_sucursales(v_index).idSucursal := v_sucursal.idsucursal;
      v_sucursales(v_index).nombreSucursal := v_sucursal.nombre;
      v_sucursales(v_index).telefonoSucursal := v_sucursal.telefono;
      v_sucursales(v_index).capitalSucursal := v_sucursal.capital;
      v_sucursales(v_index).direccionSucursal := v_sucursal.direccion;
      v_sucursales(v_index).estadoSucursal := v_sucursal.estado;
    END LOOP;

    RETURN v_sucursales;
  END sucursales;

  FUNCTION lotes_producto
    RETURN lotes_tabla
  IS
    v_lotes lotes_tabla;
    v_index PLS_INTEGER := 0;
  BEGIN
    FOR v_lote IN (
      SELECT
        idLote, to_char(fechaProduccion, 'DD-MM-YYYY') AS FECHAPRODUCCION, to_char(fechaVencimiento, 'DD-MM-YYYY') AS FECHAVENCIMIENTO
      FROM
        lote
    ) LOOP
      v_index := v_index + 1;
      v_lotes(v_index).idLote := v_lote.idlote;
      v_lotes(v_index).fechaProduccion := v_lote.fechaproduccion;
      v_lotes(v_index).fechaVencimiento := v_lote.fechavencimiento;
    END LOOP;

    RETURN v_lotes;
  END lotes_producto;

  FUNCTION trabajadores
    RETURN trabajadores_tabla
  IS
    v_trabajadores trabajadores_tabla;
    v_index PLS_INTEGER := 0;
  BEGIN
    FOR v_trabajador IN (
      SELECT
        *
      FROM
        trabajador
      WHERE
        estado = 1
    ) LOOP
      v_index := v_index + 1;
      v_trabajadores(v_index).CEDULATRABAJO := v_trabajador.CEDULATRABAJO;
      v_trabajadores(v_index).idSucursal := v_trabajador.idsucursal;
      v_trabajadores(v_index).nombreTrabajador := v_trabajador.nombre;
      v_trabajadores(v_index).cargoTrabajador := v_trabajador.cargo;
      v_trabajadores(v_index).salarioTrabajador := v_trabajador.salario;
      v_trabajadores(v_index).estadoTrabajador := v_trabajador.estado;
    END LOOP;

    RETURN v_trabajadores;
  END trabajadores;

END paquete_gestionContable;
/
--Hacer triger de pedido para calcular el descuento si la compra se realizo en el cumple del cliente

CREATE OR REPLACE PACKAGE TRANSACCIONES AS

  TYPE PRODUCTO_R IS RECORD (
    idProducto NUMBER,
    cantidad NUMBER,
    precioUnitario NUMBER,
    idLote NUMBER
  );

  TYPE PRODUCTOS_TABLA IS TABLE OF PRODUCTO_R INDEX BY PLS_INTEGER;

  PROCEDURE insertCompra(
    p_nitProveedor in COMPRA.NIT%TYPE,
    p_idSucursal in COMPRA.IDSUCURSAL%TYPE,
    p_productos in TRANSACCIONES.PRODUCTOS_TABLA
  );
  PROCEDURE insertPedido(
    p_cedulaCliente in COMPRA.NIT%TYPE,
    p_idSucursal in COMPRA.IDSUCURSAL%TYPE,
    p_cedulaTrabajador in trabajador.CEDULATRABAJo%TYPE,
    p_estado in PEDIDO.ESTADO%TYPE,
    p_productos in TRANSACCIONES.PRODUCTOS_TABLA
  );
END TRANSACCIONES;

CREATE OR REPLACE PACKAGE BODY TRANSACCIONES AS
  PROCEDURE insertCompra(
      p_nitProveedor in COMPRA.NIT%TYPE,
      p_idSucursal in COMPRA.IDSUCURSAL%TYPE,
      p_productos in TRANSACCIONES.PRODUCTOS_TABLA
  )
  IS
      v_idSucursal COMPRA.IDSUCURSAL%TYPE;
      v_idCompra NUMBER;
  BEGIN
      SAVEPOINT inicio_transaccion;

      SELECT Sucursal.idsucursal
      INTO v_idSucursal
      FROM sucursal
      WHERE estado = 1 AND IDSUCURSAL = p_idSucursal;

      SELECT SEQ_COMPRA.NEXTVAL 
      INTO v_idCompra
      FROM DUAL;

      IF p_productos.count = 0 THEN
          RAISE_APPLICATION_ERROR(-20006, 'Ingrese al menos un producto');
      END IF;

      INSERT INTO COMPRA (CODIGOCOMPRA,NIT, IDSUCURSAL, FECHA, PRECIOTOTAL) VALUES(v_idCompra, p_nitProveedor, v_idSucursal, SYSDATE, 0);
      
      FOR i IN p_productos.FIRST.. p_productos.LAST LOOP
          insertProductoCompra(
              v_idCompra, 
              p_productos(i).idProducto, 
              p_productos(i).cantidad, 
              p_productos(i).precioUnitario, 
              p_productos(i).idLote);
      END LOOP;

      COMMIT;
  EXCEPTION
      WHEN OTHERS THEN
          ROLLBACK TO inicio_transaccion;
          RAISE;
  END insertCompra;
  PROCEDURE insertPedido(
      p_cedulaCliente in COMPRA.NIT%TYPE,
      p_idSucursal in COMPRA.IDSUCURSAL%TYPE,
      p_cedulaTrabajador in trabajador.CEDULATRABAJo%TYPE,
      p_estado in PEDIDO.ESTADO%TYPE,
      p_productos in TRANSACCIONES.PRODUCTOS_TABLA
  )
  IS
      v_idSucursal COMPRA.IDSUCURSAL%TYPE;
      v_idTrabajador trabajador.CEDULATRABAJo%TYPE;
      v_idPedido NUMBER;
  BEGIN
      SAVEPOINT inicio_transaccion;
      SELECT Sucursal.idsucursal
      INTO v_idSucursal
      FROM sucursal
      WHERE estado = 1 AND IDSUCURSAL = p_idSucursal;
      
      SELECT Trabajador.cedulaTrabajo
      INTO v_idTrabajador
      FROM trabajador
      WHERE estado = 1 AND cedulatrabajo = p_cedulaTrabajador;
      
      SELECT SEQ_PEDIDO.NEXTVAL
      INTO v_idPedido
      FROM DUAL;

      IF(NOT (p_estado) IN ('Entregado', 'Pendiente')) THEN 
          RAISE_APPLICATION_ERROR(-20006, 'Ingrese un estado valido (Entregado o Pendiente)');
      END IF;
      
      INSERT INTO PEDIDO (CODIGOPEDIDO,CEDULACLIENTE, IDSUCURSAL, cedulatrabajor,FECHA, PRECIOTOTAL, ESTADO) 
      VALUES(v_idPedido, p_cedulacliente, v_idSucursal, v_idtrabajador,SYSDATE, 0, p_estado);

      FOR i IN p_productos.FIRST.. p_productos.LAST LOOP
          InsertProductoVenta(
              p_productos(i).idProducto, 
              v_idPedido, 
              p_productos(i).cantidad);
      END LOOP;
  EXCEPTION
      WHEN OTHERS THEN
          ROLLBACK TO inicio_transaccion;
          RAISE;
  END insertPedido;
END TRANSACCIONES;
