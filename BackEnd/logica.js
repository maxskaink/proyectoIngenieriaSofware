/* eslint-disable no-undef */
import { getConnection } from "oracledb";
import { Product } from "../src/class/product.js";
import { Inform } from "../src/class/inform.js";
import { Provider } from "../src/class/provider.js";
import { Client } from "../src/class/client.js";
import { Sucursal } from "../src/class/sucursal.js";
import { Lote } from "../src/class/lote.js";
import { Trabajador } from "../src/class/trabajador.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const oracledb = require("oracledb");
 

const user = 'gestiontotal'
const  password = 'oracle'
const connectionString = 'localhost/xe'

//#region Productos

export const consultarProductosSucursal = async ({idSucursal}) => {
  try {
    // Obtener conexión
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });

    const ProductoSucursal = await connection.getDbObjectClass("PAQUETE_GESTIONCONTABLE.PRODUCTO_SUCURSAL_TABLA");

    // Consulta SELECT
    const result = await connection.execute(
      `BEGIN 
        :ret := paquete_gestionContable.productos_inventario_sucursal(:idSucursal); 
        END;`,
      {
          ret: {
              dir: oracledb.BIND_OUT,
              type: ProductoSucursal
          },
          idSucursal
      }

    );


    // Extraer filas del resultado
    const res = result.outBinds.ret;

    const productos = res.toMap().map( (producto) => new Product(producto));
  
    // Cerrar la conexión
    await connection.close();
  
    return productos;
  } catch (err) {
    console.log(err) 
  }
};
export const agregarProducto = async ({nombre, descripcion, precio, categoria }) => {
    let connection;

    let result = {
        state: 'OK',
        message: 'La inserción termino de forma exitosa',
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

//#endregion

//#region Dinero de la sucursal
export const consultarDineroSucursal = async ({idSucursal}) => {
  try {
    // Obtener conexión
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
  
    // Consulta SELECT
    const query = 'select capital from sucursal where idSucursal = :idSucursal';
    const result = await connection.execute(query, {idSucursal}, { autoCommit: true });
  
    // Extraer filas del resultado
    const dinero = result.rows[0][0];
    // Cerrar la conexión
    await connection.close();
  
    return dinero;
  } catch (err) {
    console.log(err)
  }
}

export const agregarDineroSucursal = async ({idSucursal, dinero}) => {
  try{
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
    if(dinero < 0 ) return {state: 'ERROR', message: 'No se puede agregar dinero negativo'};
    
    //Obtenemos el dinero actual de la sucursal
    const query = 'select capital from sucursal where idSucursal = :idSucursal';
    const result = await connection.execute(query, {idSucursal}, { autoCommit: true });
    const dineroActual = result.rows[0][0];
    //Sumamos el dinero actual con el dinero que se va a agregar
    const dineroTotal = parseInt(dineroActual) + parseInt(dinero);

    const query2 = `BEGIN updateSucursalCapital(:idSucursal,:dineroTotal); END;`;
    await connection.execute(query2, {idSucursal,dineroTotal}, { autoCommit: true });

    await connection.close();

    return {state: 'OK', message: 'Se ha agregado el dinero con éxito'};
  }catch(err){
    console.log(err);
    return {state: 'ERROR', message: 'No se ha podido agregar el dinero'};
  }
}
//#endregion

//#region Compras y ventas
export const crearCompra = async ({nitProveedor, idSucursal , products = []}) => {
  try{
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });


    const query = `BEGIN INSERTCOMPRA(:nitProveedor,:idSucursal) ; END;`
    await connection.execute(query, {nitProveedor,idSucursal}, { autoCommit: true });


    const query2 = `select codigoCompra from compra order by fecha desc FETCH FIRST ROW ONLY`;
    const result = await connection.execute(query2);
    const idCompra = result.rows[0][0];

    for (let i = 0; i < products.length; i++) {
      const producto = products[i];
      const query3 = `BEGIN insertProductoCompra(:idCompra,:idProducto, :cantidad, :precioUnitario, :idLote); END;`;
      await connection.execute(query3, {
        idProducto: producto.product.id,
        idCompra,
        cantidad: producto.quantity,
        precioUnitario: producto.price,
        idLote: producto.idLote
      }, { autoCommit: true });
    }

    await connection.close();
    return {state: 'OK', message: 'Se ha creado la compra con éxito'};
  }catch(err){
    console.log(err);
    return {state: 'ERROR', message: 'No se ha podido crear la compra'};
  }
}

export const crearVenta = async ({cedulaCliente, idSucursal, cedulaTrabajador, estado, products = []}) => {
  try{
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });

    const query = `BEGIN INSERTPEDIDO(:cedulaCliente, :idSucursal, :cedulaTrabajador, :estado); END;`;
    await connection.execute(query, {cedulaCliente, idSucursal, cedulaTrabajador, estado}, { autoCommit: true });

    const query2 = `select codigoPedido from pedido order by fecha desc FETCH FIRST ROW ONLY`;
    const result = await connection.execute(query2);
    const idVenta = result.rows[0][0];

    for (let i = 0; i < products.length; i++) {
      const producto = products[i];
      const query3 = `BEGIN InsertProductoVenta(:idProducto, :idVenta,:cantidad); END;`;
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

export const actualizarEstadoVenta = async({idPedido, estado}) => {
  let result = {
    state: 'OK',
    message: 'Se ha actualizado con éxito el producto',
  }
  try {
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });

    const query =  'BEGIN updatePedido(:idPedido,:estado); END;'
    await connection.execute(query, {idPedido,estado}, { autoCommit: true });

    if (connection) {
      await connection.close()
      .catch( () => {result.state = 'ERROR'; result.message='No se ha podido cerrar la conexion'});
    }
    return result
  } catch (error) {
    result.state = 'ERROR';
    result.message='No se ha hecho la actualizacion, el estado es incorrecto'
    console.log(error)
    return result;
  }
}
//#endregion

//#region Informes
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
//#endregion

//#region Proveedores
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

export const obtenerProveedores = async () => {
  try {
    // Obtener conexión
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
  
    // Consulta SELECT
    const query = 'select * from proveedor';
    const result = await connection.execute(query);
    // Extraer filas del resultado
    const proveedores = result.rows.map( (proveedor) => new Provider(proveedor));
    // Cerrar la conexión
    await connection.close();
  
    return proveedores;
  } catch (err) {
    console.log(err)
  }
}

export const actualizarProveedor = async({nit, nombre, telefono, direccion}) => {
  let result = {
    state: 'OK',
    message: 'Se ha actualizado con éxito el proveedor',
  }
  try {
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });

    const query =  'BEGIN updateProveedor(:nit ,:nombre, :telefono, :direccion); END;'
    await connection.execute(query, {nit, nombre, telefono, direccion}, { autoCommit: true });

    if (connection) {
      await connection.close()
      .catch( () => {result.state = 'ERROR'; result.message='No se ha podido cerrar la conexion'});
    }
    return result
  } catch (error) {
    result.state = 'ERROR';
    result.message='No se ha hecho la actualizacion, verifique el error con el adminsitrador'
    console.log(error)
    return result;
  }
}
//#endregion

//#region Clientes
export const agregarCliente = async ({cedula, nombre, correo, fechaNacimiento}) => {
  let connection;

  let result = {
      state: 'OK',
      message: 'Se ha insertado con éxito la inserción',
  }
  connection = await getConnection({ user: user, password: password, connectionString: connectionString })
  .catch( err => console.log(err));
  const query = "BEGIN insertarCliente(:cedula ,:nombre, :correo,  TO_DATE(:fechaNacimiento, 'DD/MM/YYYY') ); END;";
  await connection.execute(query, {
    cedula,
    nombre,
    correo,
    fechaNacimiento
  }, { autoCommit: true })
  .catch( () => {result.state = 'ERROR'; result.message='No se puede hacer la insercion, hubo un problema'});
  
  if (connection) {
      await connection.close()
      .catch( () => {result.state = 'ERROR'; result.message='No se ha podido cerrar la conexion'});

  }
  return result;
};

export const obtenerClientes = async () => {
  try {
    // Obtener conexión
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
  
    // Consulta SELECT
    const query = "select cedulacliente, nombre, correo, to_char(FECHANACIMIENTO, 'DD/MM/YYYYY') from cliente";
    const result = await connection.execute(query);
    // Extraer filas del resultado
    const clientes = result.rows.map( (cliente) => new Client(cliente));
    // Cerrar la conexión
    await connection.close();
  
    return clientes;
  } catch (err) {
    console.log(err)
  }
}

export const actualizarCliente = async({cedula, nombre, correo}) => {
  let result = {
    state: 'OK',
    message: 'Se ha actualizado con éxito el cliente',
  }
  try {
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });

    const query =  'BEGIN actualizarCliente(:cedula ,:nombre, :correo); END;'
    await connection.execute(query, {cedula, nombre, correo}, { autoCommit: true });

    if (connection) {
      await connection.close()
      .catch( () => {result.state = 'ERROR'; result.message='No se ha podido cerrar la conexion'});
    }
    return result
  } catch (error) {
    result.state = 'ERROR';
    result.message='No se ha hecho la actualizacion, verifique el error con el adminsitrador'
    console.log(error)
    return result;
  }
}
//#endregion

//#region Sucursales
export const agregarSucursal = async ({idSucursal, nombre, telefono, capital, direccion}) => {
  let connection;

  let result = {
      state: 'OK',
      message: 'Se ha insertado con éxito la sucursal',
  }

  connection = await getConnection({ user: user, password: password, connectionString: connectionString })
  .catch( err => console.log(err));
  const query = 'BEGIN insertSucursal(:idSucursal, :nombre, :telefono, :capital, :direccion); END;';
  await connection.execute(query, {
    idSucursal,
    nombre,
    telefono,
    capital,
    direccion
  }, { autoCommit: true })
  .catch( () => {result.state = 'ERROR'; result.message='No se puede hacer la insercion, hubo un problema'});
  
  if (connection) {
      await connection.close()
      .catch( () => {result.state = 'ERROR'; result.message='No se ha podido cerrar la conexion'});

  }

  return result; 
}
//Actualiza cualquier atributo de la sucursal excepto el capital, si el parametro es vacio se mantiene el valor actual
export const actualizarSucursal = async({ idSucursal, nombre="", direccion="", telefono="", activado = 1 }) => {
  let result = {
    state: 'OK',
    message: 'Se ha actualizado con éxito la sucursal',
  }
  try {
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
    
    //TODO falta implemtentar todo eso, pero primero se necesita la base de datos lista
    if(activado == 1){
      const query1 =  'BEGIN activateSucursal(:idSucursal); END;'
      await connection.execute(query1, {idSucursal}, { autoCommit: true });

      if(nombre != ""){
        const query2 =  'BEGIN updateSucursalNombre(:idSucursal, :nombre); END;'
        await connection.execute(query2, {idSucursal, nombre}, { autoCommit: true });
      }

      if(direccion != ""){
        const query3 =  'BEGIN updateSucursalDireccion(:idSucursal, :direccion); END;'
        await connection.execute(query3, {idSucursal, direccion}, { autoCommit: true });
      }

      if(telefono != ""){
        const query4 =  'BEGIN updateSucursalTelefono(:idSucursal, :telefono); END;'
        await connection.execute(query4, {idSucursal, telefono}, { autoCommit: true });
      }
    }else if(activado == 0){
      const query =  'BEGIN desactivateSucursal(:idSucursal); END;'
      await connection.execute(query, {idSucursal}, { autoCommit: true });
    }
    if (connection) {
      await connection.close()
      .catch( () => {result.state = 'ERROR'; result.message='No se ha podido cerrar la conexion'});
    }
    return result
  } catch (error) {
    result.state = 'ERROR';
    result.message='No se ha hecho la actualizacion'
    console.log(error)
    return result;
  }
}

export const obtenerSucursales = async () => {
  try {
    // Obtener conexión
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
  
    // Consulta SELECT
    const query = 'select * from sucursal';
    const result = await connection.execute(query);
    // Extraer filas del resultado
    const sucursales = result.rows.map( (sucursal) => new Sucursal(sucursal));
    // Cerrar la conexión
    await connection.close();
  
    return sucursales;
  } catch (err) {
    console.log(err)
  }
}
//#endregion

//#region Lote

//Las fechas deben de ser en formato 'DD-MM-YYYY'
export const agregarLote = async ({idLote, fProduccion, fVencimiento }) => {
  let connection;

  let result = {
      state: 'OK',
      message: 'La inserción termino de forma exitosa',
  }
  

  connection = await getConnection({ user: user, password: password, connectionString: connectionString })
  .catch( err => console.log(err));

  const query = 'BEGIN insertLote(:idLote, :fProduccion, :fVencimiento); END;';
  await connection.execute(query, {
    idLote,
    fProduccion,
    fVencimiento
  }, { autoCommit: true })
  .catch( (err) => {result.state = 'ERROR'; result.message='No se puede hacer la insercion: '+err});
  
  if (connection) {
      await connection.close()
      .catch( () => {result.state = 'ERROR'; result.message='No se ha podido cerrar la conexion'});

  }
  return result;

};

export const obtenerLotes = async () => {
  try {
    // Obtener conexión
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
  
    // Consulta SELECT
    const query = "select idLote, to_char(fechaProduccion, 'DD-MM-YYYY'), to_char(fechaVencimiento, 'DD-MM-YYYY') from lote";
    const result = await connection.execute(query);
    // Extraer filas del resultado
    const lotes = result.rows.map( (lote) => new Lote(lote));
    // Cerrar la conexión
    await connection.close();
  
    return lotes;
  } catch (err) {
    console.log(err)
  }
}
//#endregion

//#region Trabajadores
export const agregarTrabajador = async ({ idSucursal, nombre, puesto, salario, cedulaTrabajador}) => {
  let connection;

  let result = {
      state: 'OK',
      message: 'La inserción termino de forma exitosa',
  }


  connection = await getConnection({ user: user, password: password, connectionString: connectionString })
  .catch( err => console.log(err));

  const query = 'BEGIN insertTrabajador( :cedulaTrabajador, :idSucursal, :nombre, :puesto, :salario); END;';
  await connection.execute(query, {
    idSucursal,
    nombre,
    puesto,
    salario,
    cedulaTrabajador
  }, { autoCommit: true })
  .catch( () => {result.state = 'ERROR'; result.message='No se puede hacer la insercion'});

  if (connection) {
      await connection.close()
      .catch( () => {result.state = 'ERROR'; result.message='No se ha podido cerrar la conexion'});

  }
  return result;

};

export const actualizarTrabajador = async ({cedula, idSucursal = "" , nombre = "", puesto = "", salario = "", activado = 1 }) => {
  let connection;

  let result = {
      state: 'OK',
      message: 'La inserción termino de forma exitosa',
  }


  connection = await getConnection({ user: user, password: password, connectionString: connectionString })
  .catch( err => console.log(err));

  if (activado == 0){
    const query =  'BEGIN deleteTrabajador(:cedula); END;'
    await connection.execute(query, {cedula}, { autoCommit: true });
  }
  else if(activado == 1){
    const query1 =  'BEGIN activateTrabajador(:cedula); END;'
    await connection.execute(query1, {cedula}, { autoCommit: true });

    if(idSucursal != ""){
      const query2 =  'BEGIN updateTrabajadorSucursal(:cedula, :idSucursal); END;'
      await connection.execute(query2, {cedula, idSucursal}, { autoCommit: true });
    }

    if(nombre != ""){
      const query3 =  'BEGIN updateTrabajadorNombre(:cedula, :nombre); END;'
      await connection.execute(query3, {cedula, nombre}, { autoCommit: true });
    }

    if(puesto != ""){
      const query4 =  'BEGIN updateTrabajadorCargo(:cedula, :puesto); END;'
      await connection.execute(query4, {cedula, puesto}, { autoCommit: true });
    }

    if(salario != ""){
      const query5 =  'BEGIN updateTrabajadorSalario(:cedula, :salario); END;'
      await connection.execute(query5, {cedula, salario}, { autoCommit: true });
    }
  }

  if (connection) {
      await connection.close()
      .catch( () => {result.state = 'ERROR'; result.message='No se ha podido cerrar la conexion'});

  }
  return result;

};

export const obtenerTrabajadores = async () => {
  try {
    // Obtener conexión
    const connection = await getConnection({ user: user, password: password, connectionString: connectionString });
  
    // Consulta SELECT
    const query = "select * from trabajador";
    const result = await connection.execute(query);
    // Extraer filas del resultado
    const trabajadores = result.rows.map( (trabajador) => new Trabajador(trabajador));
    // Cerrar la conexión
    await connection.close();
  
    return trabajadores;
  } catch (err) {
    console.log(err)
  }
}

//#endregion
