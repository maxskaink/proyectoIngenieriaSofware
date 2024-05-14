import {agregarProducto, 
        consultarProductos, 
        actualizarProducto, 
        consultarProductoId, 
        crearCompra,
        crearVenta,
        consultarInformes,
        obtenerCategorias,
        agregarProveedor,
        obtenerProveedores,
        actualizarProveedor,
        agregarCliente,
        obtenerClientes,
        actualizarCliente,
        agregarSucursal,
        agregarDineroSucursal,
        actualizarSucursal,
        consultarDineroSucursal,
        actualizarEstadoVenta,
        agregarLote,
        obtenerSucursales,
        consultarProductosSucursal
      } from '../BackEnd/logica.js';
import cors from 'cors';
import express from 'express';

const app = express();
const PORT = 3001; // Puerto para el servidor Express
app.use(cors());
app.use(express.json());


app.post('/agregar-producto', async (req, res) => {
    const result = await agregarProducto(req.body)
      .catch(err => console.log(err))
    if(result.state === 'OK')
        res.json(result);
    else
        res.status(500).json(result);
});

app.get('/consultar-productos', async (req, res) => {
  try {
    // Llamar a la función que consulta los productos
    const productos = await consultarProductos();

    // Enviar los productos como respuesta
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});

app.get('/consultar-productos-sucursal', async (req, res) => {
  try {
    // Llamar a la función que consulta los productos de una sucursal
    const productos = await consultarProductosSucursal(req.query);

    // Enviar los productos como respuesta
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});
app.get('/consultar-producto-id', async (req, res) => {
  try {
    // Llamar a la función que consulta producto por id

    const producto = await consultarProductoId(req.query);

    // Enviar los productos como respuesta
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});
app.put('/actualizar-producto', async (req, res) => {
  const result = await actualizarProducto(req.body)
  .catch(err => console.log(err))

  if(result.state === 'OK')
      res.json(result);
  else
      res.status(500).json(result);
});

app.post('/crear-compra', async (req, res) => {
  const result = await crearCompra(req.body)
  .catch(err => console.log(err))

  if(result.state === 'OK')
      res.json(result);
  else
      res.status(500).json(result);
});

app.post('/crear-venta', async (req, res) => {
  const result = await crearVenta(req.body)
  .catch(err => console.log(err))

  if(result.state === 'OK')
      res.json(result);
  else
      res.status(500).json(result);
});

app.get('/consultar-informes', async(req, res) => {
  try {
    // Llamar a la función que consulta los informes
    const informes = await consultarInformes();

    // Enviar los informes como respuesta
    res.json(informes);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar informes' });
  }
});

app.get('/obtener-categorias', async(req, res) => {
  try {
    // Llamar a la función que consulta las categorias
    const categorias = await obtenerCategorias();

    // Enviar las categorias como respuesta
    res.json(categorias);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar categorias' });
  }
});

app.post('/agregar-proveedor', async (req, res) => {

  const result = await agregarProveedor(req.body)
    .catch(err => console.log(err));
  if(result.state === 'OK')
      res.json(result);
  else
      res.status(500).json(result);
});

app.get('/consultar-proveedores', async (req, res) => {
  try {
    // Llamar a la función que consulta los proveedores
    const proveedores = await obtenerProveedores();

    // Enviar los proveedores como respuesta
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar proveedores' });
  }
});

app.put('/actualizar-proveedor', async (req, res) => {
  const result = await actualizarProveedor(req.body)
  .catch(err => console.log(err))

  if(result.state === 'OK')
      res.json(result);
  else
      res.status(500).json(result);
});

app.post('/agregar-cliente', async (req, res) => {

  const result = await agregarCliente(req.body)
    .catch(err => console.log(err));
  
  if(result.state === 'OK')
      res.json(result);
  else
      res.status(500).json(result);
});

app.get('/consultar-clientes', async (req, res) => {
  try {
    // Llamar a la función que consulta los clientes
    const clientes = await obtenerClientes();

    // Enviar los clientes como respuesta
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar clientes' });
  }
});

app.put('/actualizar-cliente', async (req, res) => {
  const result = await actualizarCliente(req.body)
  .catch(err => console.log(err))

  if(result.state === 'OK')
      res.json(result);
  else
      res.status(500).json(result);
});

app.post( '/agregar-sucursal', async (req, res) => {
  const result = await agregarSucursal(req.body)
    .catch(err => console.log(err));
  if(result.state === 'OK')
      res.json(result);
  else
      res.status(500).json(result);
});

app.put('/agregar-dinero-sucursal', async (req, res) => {
  const result = await agregarDineroSucursal(req.body)
  .catch(err => console.log(err))

  if(result.state === 'OK')
      res.json(result);
  else
      res.status(500).json(result);
});

app.get('/consultar-sucursales', async (req, res) => {
  try {
    // Llamar a la función que consulta las sucursales
    const sucursales = await obtenerSucursales();

    // Enviar las sucursales como respuesta
    res.json(sucursales);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar sucursales' });
  }
});

app.put('/actualizar-sucursal', async (req, res) => {
  const result = await actualizarSucursal(req.body)
  .catch(err => console.log(err))

  if(result.state === 'OK')
      res.json(result);
  else
      res.status(500).json(result);
});

app.get('/consultar-dinero-sucursal', async (req, res) => {
  try {
    // Llamar a la función que consulta el dinero de la sucursal
    const dinero = await consultarDineroSucursal(req.query);
    if(dinero === undefined)
        throw new Error('Error al consultar dinero de la sucursal');
    // Enviar el dinero como respuesta
    res.json(dinero);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar dinero de la sucursal' });
  }
});

app.put('/actualizar-estado-venta', async (req, res) => {
  const result = await actualizarEstadoVenta(req.body)
  .catch(err => console.log(err))

  if(result.state === 'OK')
      res.json(result);
  else
      res.status(500).json(result);
});

app.post('/agregar-lote', async (req, res) => {
  const result = await agregarLote(req.body)
  .catch(err => console.log(err))

  if(result.state === 'OK')
      res.json(result);
  else
      res.status(500).json(result);
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
