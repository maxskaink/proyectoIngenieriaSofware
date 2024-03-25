import { render, screen,fireEvent } from '@testing-library/react';
import {test, describe, vi, beforeEach} from 'vitest';
import { CatalogoManager } from '../components/CatalogoManager';
import { expect } from 'chai';


describe('Agregar Form', () => {
    const onSubmit = vi.fn();

    beforeEach(() => {
        onSubmit.mockClear();
    });

    render(<CatalogoManager onSubmit={onSubmit} />);

    test('onsSubmit is called with the correct values', async () => {
        fireEvent.input(getNombre(), { target: { value: 'Nombre del producto' } })
        fireEvent.input(getDescripcion(), { target: { value: 'Descripción del producto' } })
        fireEvent.input(getPrecio(), { target: { value: '2700' } })

        fireEvent.click(getButton());

        expect(screen.getByText('Nombre del producto')).toBeInDocument();
        expect(screen.getByText('Descripción del producto')).toBeInDocument();
        expect(screen.getByText('2700')).toBeInDocument();
    });

    function getNombre()
    {
        return screen.getByLabelText('Nombre del producto');
    }
    function getDescripcion()
    {
        return screen.getByRole('textbox', {
            name: /descripción:/i
        })
    }
    function getPrecio()
    {
        return screen.getByLabelText('Precio del producto');
    }
    function getButton()
    {
        return screen.getByRole('button', {
            name: /agregar producto/i
        })
    }
});