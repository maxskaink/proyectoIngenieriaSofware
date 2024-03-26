import { useState } from 'react';
import '../styles/searchBard.css'
import PropTypes from 'prop-types';


/* Barra de busuqeda qeu pude funcionar en varias ambitos */
export const SearchBar = ({ onSearch }) => {
    /* estado que me dice que hay en la busqueda */
    const [query, setQuery] = useState('');

    /* Cada ves que se escribe algo, se actualiza la barra y se iniciar cierta accion */
    const handleInputChange = (event) => {
        setQuery(event.target.value);
        onSearch(event.target.value)
    };

    /* Cuando se le unde buscar hace simplemnete hace lo mismo que la otra funcion */
    

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Buscar..."
                value={query}
                onChange={handleInputChange}
            />
           
        </div>
    );
};

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};