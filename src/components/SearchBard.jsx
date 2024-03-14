import { useState } from 'react';
import '../styles/searchBard.css'

// eslint-disable-next-line react/prop-types
export const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (event) => {
        setQuery(event.target.value);
        onSearch(event.target.value)
    };

    const handleSearch = () => {

        onSearch(query);
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Buscar..."
                value={query}
                onChange={handleInputChange}
            />
            <button onClick={handleSearch}>Buscar</button>
        </div>
    );
};
