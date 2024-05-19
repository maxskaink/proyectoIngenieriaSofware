import { useState, useEffect } from 'react';
import { Provider } from '../class/provider';
import { getProviders } from '../helpers/querys';


const defaultProvider = new Provider([]);


import PropTypes from 'prop-types';

export const SelectProvider = ({ handleSelectedProvider }) => {
    const [providers, setProviders] = useState([]);

    useEffect(() => {
        const gets = async () => await getProviders().then((providers) => setProviders(providers));
        gets();
    }, []);

    const handleProviderChange = (event) => {
        handleSelectedProvider(event.target.value);
    };

    return (
        <div>
            <label htmlFor="provider">Selecciona un proveedor:</label>
            <select id="provider" onChange={handleProviderChange} required>
                <option value="">Seleccionar proveedor</option>
                {providers.map((provider = defaultProvider) => (
                    <option key={provider.nit} value={provider.nit}>{provider.nombre}</option>
                ))}
            </select>
        </div>
    );
};

SelectProvider.propTypes = {
    handleSelectedProvider: PropTypes.func.isRequired
};