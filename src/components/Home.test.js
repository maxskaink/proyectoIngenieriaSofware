import { Home } from './Home';
import {render,screen} from '@testing-library/react';

test('always true test', () => {
    expect(true).toBe(true);
});

test(' renders <agregar producto>', () => {  
    render(<Home />);
    const myElement = screen.getByText(/No hay productos disponibles/);
    expect(myElement).toBeInTheDocument();
});