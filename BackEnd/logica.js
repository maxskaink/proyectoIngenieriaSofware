import { getConnection } from "oracledb";
import { Product } from "../src/class/product.js";
import { Inform } from "../src/class/inform.js";

const user = 'gestiontotal'
const  password = 'oracle'
const connectionString = 'localhost/xe'


export const agregarProducto = async ({nombre, descripcion, precio, categoria }) => {
    let connection;

    let result = {
        state: 'OK',
        message: 'Se ha insertado con éxito la inserción',
    }

    connection = await getConnection({ user: user, password: password, connectionString: connectionString })
    .catch( err => console.log(err));

    const query = 'BEGIN insertProducto(:nombre, :descripcion, :precio, :categoria); END;';
    await connection.execute(query, {
      nombre,
      descripcion,
      precio,
      categoria
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
        const productos = result.rows.map( (producto) => new Product(producto));
    
        // Cerrar la conexión
        await connection.close();
    
        return productos;
      } catch (err) {
        console.log(err)
      }
}

export const actualizarProducto = async({ id, nombre, descripcion, precio, activado, categoria }) => {
  let result = {
    state: 'OK',
    message: 'Se ha actualizado con éxito el producto',
  }
  try {
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });

    //TODO falta implemtentar todo eso, pero primero se necesita la base de datos lista
    if(activado == 1){
      const query =  'BEGIN updateProducto(:id ,:nombre, :descripcion, :precio, :categoria); END;'
      await connection.execute(query, {id, nombre, descripcion, precio, categoria}, { autoCommit: true });
    }else{
      const query =  'BEGIN desactivarProducto(:id); END;'
      await connection.execute(query, {id}, { autoCommit: true });
    }
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
    const productos = result.rows.length > 0 && new Product(result.rows[0]);
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
        idProducto: producto.product.id,
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
        idProducto: producto.product.id,
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

export const agregarDineroCaja = async ({dinero}) => {
  try{
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
    if(dinero < 0 ) return {state: 'ERROR', message: 'No se puede agregar dinero negativo'};
    const query = `UPDATE CAJA SET dineroTotal = dineroTotal + :dinero WHERE codigocaja = 1`;
    await connection.execute(query, {dinero}, { autoCommit: true });

    await connection.close();
    return {state: 'OK', message: 'Se ha agregado el dinero con éxito'};
  }catch(err){
    console.log(err);
    return {state: 'ERROR', message: 'No se ha podido agregar el dinero'};
  }
}

export const consultarInformes = async () => {
  try {
    // Obtener conexión
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
  
    // Consulta SELECT
    const query = 'select * from Vista_Resumen_Semanal';
    const result = await connection.execute(query);
    // Extraer filas del resultado
    const informes = result.rows.map( (informeArray) => new Inform(informeArray));
    // Cerrar la conexión
    await connection.close();
  
    return informes;
  } catch (err) {
    console.log(err)
  }
}

export const obtenerCategorias = async () => {
  try {
    // Obtener conexión
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
  
    // Consulta SELECT
    const query = 'select categoria from producto group by categoria;';
    const result = await connection.execute(query);
    // Extraer filas del resultado
    const categorias = result.rows;
    // Cerrar la conexión
    await connection.close();
  
    return categorias;
  } catch (err) {
    console.log(err)
  }
}

export const agregarProveedor = async ({nit, nombre, telefono, direccion}) => {
  let connection;

  let result = {
      state: 'OK',
      message: 'Se ha insertado con éxito la inserción',
  }

  connection = await getConnection({ user: user, password: password, connectionString: connectionString })
  .catch( err => console.log(err));
  const query = 'BEGIN insertProveedor(:nit ,:nombre, :telefono, :direccion); END;';
  await connection.execute(query, {
    nit,
    nombre,
    telefono,
    direccion
  }, { autoCommit: true })
  .catch( () => {result.state = 'ERROR'; result.message='No se puede hacer la insercion, hubo un problema'});
  
  if (connection) {
      await connection.close()
      .catch( () => {result.state = 'ERROR'; result.message='No se ha podido cerrar la conexion'});

  }
  return result;

}