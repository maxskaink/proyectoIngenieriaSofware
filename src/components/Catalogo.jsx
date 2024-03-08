import  { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/catalogo.css';

export const Catalogo = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/consultar-productos');

        if (response.status === 200) {
          setProductos(response.data);
        } else {
          console.error('Error al obtener la lista de productos');
        }
      } catch (error) {
        console.error('Error en la solicitud:', error);
      }
    };

    fetchProductos();
  }, []); 

  return (
    <div className='catalogo'>
      <h2 className='catalogo-titulo'>Lista de Productos</h2>
      <ul className='catalogo-lista'>
        {productos && productos.length > 0 ? (
          productos.map((producto) => (
            <li key={producto[0]} className='catalogo-producto'>
              <strong>ID:</strong> {producto[0]}, <strong>Nombre:</strong> {producto[1]}, <strong>Descripción:</strong> {producto[2]}, <strong>Precio:</strong> {producto[3]}
            </li>
          ))
        ) : (
          <li>No hay productos disponibles</li>
        )}
      </ul>
    </div>
  );
};
