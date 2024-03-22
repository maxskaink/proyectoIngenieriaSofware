import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Home } from '../components/Home';


test('contiene enlaces a Inicio y Manejar catálogo', () => {
    render(<Router><Home /></Router>);

    expect(screen.getByText(/Inicio/i)).toBeInTheDocument();
    expect(screen.getByText(/Manejar catálogo/i)).toBeInTheDocument();
});

/* Completarlo cuando este definidio el menú de inicio */
/* test('los enlaces apuntan a las rutas correctas', () => {
    render(<Router><Home /></Router>);

    const inicioLink = screen.getByText(/Inicio/i);
    const catalogoLink = screen.getByText(/Manejar catálogo/i);

    expect(inicioLink.getAttribute('href')).toBe('/');
    expect(catalogoLink.getAttribute('href')).toBe('/catalogo');
}); */ 