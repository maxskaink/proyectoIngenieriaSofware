import { render, fireEvent, screen } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import CatalogoManager from './CatalogoManager';

let mock = new MockAdapter(axios);

afterEach(() => {
    // Limpiar todas las solicitudes pendientes
    mock.reset();
});

test('agrega un producto', async () => {
    
    render(<CatalogoManager />);
    
    const addButton = screen.getByText(/Agregar producto/i);
    fireEvent.click(addButton);
    
    expect(axios.post).toHaveBeenCalled();
});
