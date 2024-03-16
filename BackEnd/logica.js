import { getConnection } from "oracledb";

const user = 'BDDII'
const  password = 'oracle'
const connectionString = 'localhost/xe'

export const agregarProducto = async ({ id, nombre, descripcion, precio }) => {
    let connection;

    let result = {
        state: 'OK',
        message: 'Se ha insertado con éxito la inserción',
    }

    connection = await getConnection({ user: user, password: password, connectionString: connectionString })
    .catch( err => console.log(err));
    const query = `insert into PRODUCTO (idProducto, nombre, DESCRIPCION, PrecioActual, activado, CANTIDADSTOCK) values (:id, :nombre, :descripcion, :precio, 1, 0)`

    await connection.execute(query, {
    id,
    nombre,
    descripcion,
    precio,
    }, { autoCommit: true })
    .catch( () => {result.state = 'ERROR'; result.message='No se ha hecho la insersion, puede que el id ya exista'});

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
    result.message='No se ha hecho la insersion, puede que el id ya exista'
    console.log(error)
    return result;
  }
}