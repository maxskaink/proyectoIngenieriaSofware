import {describe,test, beforeEach,afterEach,expect} from 'vitest';

import { render, screen } from '@testing-library/react';
/* import userEvent from '@testing-library/user-event'; */
import axios from 'axios';
import { useState } from "react";
import MockAdapter from 'axios-mock-adapter';
import { Catalogo } from '../components/Catalogo';
import { API } from "../constants/API";
let mock;





const TestComponent = () => {
  const [productoAtributos, setProducto] = useState([]);

  const handleSelectProduct = (newProducto) => {
    setProducto(newProducto)
  }

  return <Catalogo productoAtributos={productoAtributos} handleSelectProduct={handleSelectProduct}></Catalogo>

}


describe('Pruebas para la visualización de atributos de producto en el componente Catálogo', () => {

  beforeEach(() => {
    // Limpiar todas las solicitudes pendientes
    mock = new MockAdapter(axios);
  });
  afterEach(() => {
    // Limpiar todas las solicitudes pendientes y restablecer el mock después de cada prueba
    mock.restore();
  });

  test('muestra la lista de productos cuando hay productos disponibles', async () => {
    const productos = [[1, "producto1", "desc1", 1000, 1, 0], [2, "producto2", "desc2", 2000, 1, 0], [3, "producto3", "desc3", 3000, 1, 0]];

    mock.onGet(API.consultarProductos).reply(200, productos);

    render(<TestComponent />);

    await screen.findByText(/producto1/i);

    expect(screen.getAllByText('Lista de Productos')).toBeDefined();
    expect(screen.getAllByText(/producto1/i)).toBeDefined();
    expect(screen.getAllByText(/producto2/i)).toBeDefined();
    expect(screen.getAllByText(/producto3/i)).toBeDefined();
  });

  test('Muestra la descripción de los productos cuando hay productos disponibles', async () => {
    const productos = [[1, "producto1", "desc1", 1000, 1, 0], [2, "producto2", "desc2", 2000, 1, 0], [3, "producto3", "desc3", 3000, 1, 0]];

    mock.onGet(API.consultarProductos).reply(200, productos);

    render(<TestComponent />);

    await screen.findByText(/desc1/i);

    expect(screen.getByText('Lista de Productos')).toBeDefined();
    expect(screen.getAllByText(/desc1/i)).toBeDefined();
    expect(screen.getAllByText(/desc2/i)).toBeDefined();
    expect(screen.getAllByText(/desc3/i)).toBeDefined();
  });
});

 /*  

  test('Muestra el precio de los productos cuando hay productos disponibles', async () => {
    const productos = [[1, "producto1", "desc1", 1000, 1, 0], [2, "producto2", "desc2", 2000, 1, 0], [3, "producto3", "desc3", 3000, 1, 0]];

    mock.onGet(API.consultarProductos).reply(200, productos);

    render(<TestComponent />);

    await screen.findByText(/desc1/i);

    expect(screen.getByText('Lista de Productos')).to.exist;
    expect(screen.getByText(/1000/i)).to.exist;
    expect(screen.getByText(/2000/i)).to.exist;
    expect(screen.getByText(/3000/i)).to.exist;
  });

  test('No muestra la cantidad del producto cuando hay productos disponibles', async () => {
    const productos = [[1, "producto1", "desc1", 1000, 1, 17], [2, "producto2", "desc2", 2000, 1, 27], [3, "producto3", "desc3", 3000, 1, 37]];

    mock.onGet(API.consultarProductos).reply(200, productos);

    render(<TestComponent />);

    await screen.findByText(/desc1/i);

    

    expect(screen.getByText('Lista de Productos')).to.exist;
    expect(screen.queryByText(/17/i)).toBeNull();
    expect(screen.queryByText(/27/i)).toBeNull();
    expect(screen.queryByText(/37/i)).toBeNull();
  });

    test('No muestra la lista del producto cuando esta inactivo', async () => {
    const productos = [[1, "producto1", "desc1", 1000, 0, 17], [2, "producto2", "desc2", 2000, 0, 27], [3, "producto3", "desc3", 3000, 1, 37]];

    mock.onGet(API.consultarProductos).reply(200, productos);

    render(<TestComponent />);

    await screen.findByText(/desc1/i);

    expect(screen.getByText('Lista de Productos')).to.exist;
    expect(screen.queryByText(/producto1/i)).toBeNull();
    expect(screen.queryByText(/producto2/i)).toBeNull();
    expect(screen.getByText(/producto3/i)).to.exist;
  }); 

  test('No muestra la lista del producto cuando el producto no existe', async () => {
    const productos = [[1, "producto1", "desc1", 1000, 1, 17], [2, "producto2", "desc2", 2000, 1, 27], [3, "producto3", "desc3", 3000, 1, 37]];

    mock.onGet(API.consultarProductos).reply(200, productos);

    render(<TestComponent />);

    await screen.findByText(/desc1/i);

    expect(screen.getByText('Lista de Productos')).to.exist;
    expect(screen.queryByText(/producto4/i)).toBeNull();
    expect(screen.queryByText(/producto5/i)).toBeNull();
    expect(screen.getByText(/producto3/i)).to.exist;
  }); 

  test('Muestra un mensaje cuando no hay productos disponibles', async () => {
    const productos = null;

    mock.onGet(API.consultarProductos).reply(200, productos);

    render(<TestComponent />);

    await screen.findByText(/No hay productos disponibles/i);

    expect(screen.getByText(/No hay productos disponibles/i)).to.exist;
  });

}); */

/* describe('Pruebas para la selección de productos en el componente Catálogo', () => {
  test('Actualiza el estado del componente cuando un producto es seleccionado', async () => {
    const productos = [[1, "producto1", "desc1", 1000, 0, 17], [2, "producto2", "desc2", 2000, 0, 27], [3, "producto3", "desc3", 3000, 1, 37]];

    mock.onGet(API.consultarProductos).reply(200, productos);

    render(<TestComponent />);

    const producto = await screen.findByText(/producto1/i);
    await userEvent.click(producto);

    expect(screen.getByText(/Actualizar Producto/i)).to.exist;
  });
});
 */



