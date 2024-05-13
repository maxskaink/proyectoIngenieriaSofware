import {describe,test,expect, afterEach} from 'vitest';
import { render, screen,fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useState } from "react";
import MockAdapter from 'axios-mock-adapter';
import { Catalogo } from '../components/Catalogo';
import { API } from "../constants/API";
let mock = new MockAdapter(axios);


afterEach(() => { 
  mock.reset();
});

const TestComponent = () => {
  const [productoAtributos, setProducto] = useState([]);

  const handleSelectProduct = (newProducto) => {
    setProducto(newProducto)
  }

  return <Catalogo productoAtributos={productoAtributos} handleSelectProduct={handleSelectProduct}></Catalogo>

}

//Es importante tener en cuenta que a la hora de testear Catalogo tenemos una base de que la API 
//devuelve los datos filtrados por el backend por lo que no puede haber un producto con activado = 0

(async () => {
  await waitFor(async () => {
    describe('Pruebas para la visualización de atributos de producto en el componente Catálogo', () => {
      const productos = [
        [1, "producto1", "desc1", 1000, 1, 17], 
        [2, "producto2", "desc2", 2000, 1, 27], 
        [3, "producto3", "desc3", 3000, 1, 37]
      ];
      mock.onGet(API.consultarProductos).reply(200, productos);
      render(<TestComponent />);

      test('muestra la lista de productos cuando hay productos disponibles', async () => {
        expect(screen.getByText(/producto1/i)).toBeDefined();
        expect(screen.getByText(/producto2/i)).toBeDefined();
        expect(screen.getByText(/producto3/i)).toBeDefined();
      });


      test('Muestra la descripción de los productos cuando hay productos disponibles', async () => {
        expect(screen.getByText(/desc1/i)).toBeDefined();
        expect(screen.getByText(/desc2/i)).toBeDefined();
        expect(screen.getByText(/desc3/i)).toBeDefined();
      });

      test('Muestra el precio de los productos cuando hay productos disponibles', async () => {
        expect(screen.getByText(/1000/i)).toBeDefined();
        expect(screen.getByText(/2000/i)).toBeDefined();
        expect(screen.getByText(/3000/i)).toBeDefined();
      });

      test('No muestra la cantidad del producto cuando hay productos disponibles', async () => {
        expect(screen.queryByText(/17/i)).toBeNull();
        expect(screen.queryByText(/27/i)).toBeNull();
        expect(screen.queryByText(/37/i)).toBeNull();
      });

      test('No muestra la lista del producto cuando el producto no existe', async () => {
        expect(screen.queryByText(/producto4/i)).toBeNull();
        expect(screen.getByText(/producto3/i)).toBeDefined();
      }); 

      test('Filtra los productos basado en la búsqueda', async () => {
        const searchBar = screen.getByPlaceholderText('Buscar...');
        fireEvent.change(searchBar, { target: { value: 'producto2' } });
        
        expect(screen.getByText(/producto2/i)).toBeDefined();
        expect(screen.queryByText(/producto1/i)).toBeNull();
        expect(screen.queryByText(/producto3/i)).toBeNull();
      });

    });
  });
})();

describe('Pruebas para la visualización de mensajes en el componente Catálogo', () => {
  const productos = null;
  mock.onGet(API.consultarProductos).reply(200, productos);

  test('Muestra un mensaje cuando no hay productos disponibles', async () => {
    document.body.innerHTML = '';
    render(<TestComponent />);
    expect(screen.getByText(/No hay productos disponibles/i)).toBeDefined();
  });
});


