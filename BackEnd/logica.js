import { getConnection } from "oracledb";

const user = 'BDDII'
const  password = 'oracle'
const connectionString = 'localhost/xe'

const checkExistingProductAndDesactivaded = async (nombre) => {
  const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
  const query = 'SELECT COUNT(*) FROM PRODUCTO WHERE (nombre = :nombre) AND (activado = 0)';
  const result = await connection.execute(query, { nombre });
  const count = result.rows[0][0];
  await connection.close();
  return count > 0;
};

export const agregarProducto = async ({nombre, descripcion, precio }) => {
    let connection;

    let result = {
        state: 'OK',
        message: 'Se ha insertado con éxito la inserción',
    }

    connection = await getConnection({ user: user, password: password, connectionString: connectionString })
    .catch( err => console.log(err));

    const existingProduct = await checkExistingProductAndDesactivaded(nombre);
    const query = (existingProduct)
      ? 'UPDATE PRODUCTO SET activado = 1, nombre = :nombre, DESCRIPCION = :descripcion, PrecioActual = :precio WHERE nombre = :nombre'
      : 'INSERT INTO PRODUCTO (nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) VALUES (:nombre, :descripcion, :precio, 1, 0)';

    await connection.execute(query, {
    nombre,
    descripcion,
    precio,
    }, { autoCommit: true })
    .catch( () => {result.state = 'ERROR'; result.message='No se puede hacer la insercion, el nombre ya existe'});

    if (connection) {
        await connection.close()
        .catch( () => {result.state = 'ERROR'; result.message='No se ha podido cerrar la conexion'});

    }
    return result;

  };

export const consultarProductos = async () => {
    try {
        // Obtener conexión
        const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
    
        // Consulta SELECT
        const query = 'select * from PRODUCTO WHERE ACTIVADO = 1';
        const result = await connection.execute(query);
    
        // Extraer filas del resultado
        const productos = result.rows;
    
        // Cerrar la conexión
        await connection.close();
    
        return productos;
      } catch (err) {
        console.log(err)
      }
}

export const actualizarProducto = async({ id, nombre, descripcion, precio, activado }) => {
  let result = {
    state: 'OK',
    message: 'Se ha actualizado con éxito el producto',
  }
  try {
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });

    //TODO falta implemtentar todo eso, pero primero se necesita la base de datos lista
    const query = 'UPDATE PRODUCTO SET nombre = :nombre, DESCRIPCION = :descripcion, PrecioActual = :precio, activado = :activado WHERE idProducto = :id';
    await connection.execute(query, {id, nombre, descripcion, precio, activado}, { autoCommit: true });

    if (connection) {
      await connection.close()
      .catch( () => {result.state = 'ERROR'; result.message='No se ha podido cerrar la conexion'});
    }
    return result
  } catch (error) {
    result.state = 'ERROR';
    result.message='No se ha hecho la actualizacion, este nombre ya existe'
    console.log(error)
    return result;
  }
}

export const consultarProductoId = async ({id}) => {
  try {
    // Obtener conexión
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
  
    // Consulta SELECT
    const query = 'select * from PRODUCTO WHERE idProducto = :id';
    const result = await connection.execute(query, {id});
    // Extraer filas del resultado
    const productos = result.rows;
    // Cerrar la conexión
    await connection.close();
  
    return productos;
  } catch (err) {
    console.log(err)
  }
}

export const constularDineroCaja = async () => {
  try {
    // Obtener conexión
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
  
    // Consulta SELECT
    const query = 'select dineroTOtal from caja where codigocaja = 1';
    const result = await connection.execute(query);
  
    // Extraer filas del resultado
    const dinero = result.rows[0][0];
    // Cerrar la conexión
    await connection.close();
  
    return dinero;
  } catch (err) {
    console.log(err)
  }
}

export const crearCompra = async ({address = "", contact = "", providerName="",products = []}) => {
  try{
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });


    const query = `insert into COMPRA (direccion, contacto, nombreProveedor, preciototalcompra,fecha) values (:address, :contact, :providerName, 0,SYSDATE)`;
    
    await connection.execute(query, {address, contact, providerName}, { autoCommit: true });


    const query2 = `select codigoCompra from compra order by fecha desc FETCH FIRST ROW ONLY`;
    const result = await connection.execute(query2);
    const idCompra = result.rows[0][0];

    for (let i = 0; i < products.length; i++) {
      const producto = products[i];
      const query3 = `BEGIN InsertarProductoEnCompra(:idProducto, :idCompra,:cantidad, :precioUnitario); END;`;
      await connection.execute(query3, {
        idProducto: producto.product,
        idCompra,
        cantidad: producto.quantity,
        precioUnitario: producto.price
      }, { autoCommit: true });
    }

    await connection.close();
    return {state: 'OK', message: 'Se ha creado la compra con éxito'};
  }catch(err){
    console.log(err);
    return {state: 'ERROR', message: 'No se ha podido crear la compra'};
  }
}

export const crearVenta = async ({medioPago = "", products = []}) => {
  try{
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });

    const query = `INSERT INTO VENTA (mediopago, fecha, preciototalventa) values (:medioPago, sysdate, 0)`;
    await connection.execute(query, {medioPago}, { autoCommit: true });

    const query2 = `select codigoVenta from venta order by fecha desc FETCH FIRST ROW ONLY`;
    const result = await connection.execute(query2);
    const idVenta = result.rows[0][0];

    for (let i = 0; i < products.length; i++) {
      const producto = products[i];
      const query3 = `BEGIN InsertarProductoEnVenta(:idProducto, :idVenta,:cantidad); END;`;
      await connection.execute(query3, {
        idProducto: producto.product,
        idVenta,
        cantidad: producto.quantity
      }, { autoCommit: true });
    }

    await connection.close();
    return {state: 'OK', message: 'Se ha creado la venta con éxito'};
  }catch(err){
    console.log(err);
    return {state: 'ERROR', message: 'No se ha podido crear la venta'};
  }
}