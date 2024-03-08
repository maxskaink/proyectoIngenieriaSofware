import { agregarProducto, consultarProductos} from '../BackEnd/logica.js';
import cors from 'cors';
import express from 'express';

const app = express();
const PORT = 3001; // Puerto para el servidor Express
app.use(cors());
app.use(express.json());

// Ruta para agregar un producto
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

app.get('/actualizar-producto', async (req, res) => {
  try {
    //TODO tengo que implemntar esta mrd
  } catch (error) {
    res.status(500).json({ error: 'Error al consultar productos' });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});
