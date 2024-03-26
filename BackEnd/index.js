import { agregarProducto, consultarProductos, actualizarProducto, consultarProductoId, constularDineroCaja} from '../BackEnd/logica.js';
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

app.get('/constular-dinero-caja', async (req, res) => {
  try {
    // Llamar a la función que consulta el dinero en caja
    const dinero = await constularDineroCaja();

    // Enviar el dinero como respuesta
    res.json(dinero);
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar dinero en caja' });
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

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
