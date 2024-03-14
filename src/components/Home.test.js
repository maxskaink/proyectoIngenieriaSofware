import { Home } from './Home';
import {render,screen} from '@testing-library/react';

it('always true test', () => {
    expect(true).toBe(true);
});

it('renders<agregar producto>', () => {  
    render(<Home />);
    const myElement = screen.getByText(/No hay productos disponibles/);
    expect(myElement).toBeInTheDocument();
});