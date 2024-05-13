import { useState, useEffect } from 'react';
import { getClients } from '../helpers/querys';

import PropTypes from 'prop-types';

export const SelectClient = ({ handleSelectedClient }) => {
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await getClients();
                setClients(response);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
    }, []);

    const handleClientChange = (event) => {
        setSelectedClient(event.target.value);
        handleSelectedClient(event.target.value)
    };

    return (
        <div>
            <label htmlFor="client">Selecciona un cliente:</label>
            <select id="client" value={selectedClient} onChange={handleClientChange}>
                <option value="">Seleccione un cliente</option>
                {clients.map((client) => (
                    <option key={client.cedula} value={client.cedula}>
                        {client.cedula} - {client.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};

SelectClient.propTypes = {
    handleSelectedClient: PropTypes.func.isRequired,
};