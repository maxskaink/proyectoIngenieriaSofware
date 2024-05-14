import { useState, useEffect } from 'react';
import { getBranchs  } from '../helpers/querys';
import { PropTypes } from 'prop-types';

export const SelectSucursal = ({handleSelectedSucursal}) => {
    const [sucursales, setSucursales] = useState([]);
    const [selectedSucursal, setSelectedSucursal] = useState('');

    useEffect(() => {
        // Aquí puedes hacer la llamada a tu API o realizar cualquier otra lógica para cargar las sucursales
        const fetchSucursales = async () => {
            try {
                const data = await getBranchs();
                setSucursales(data);
            } catch (error) {
                console.error('Error al cargar las sucursales:', error);
            }
        };

        fetchSucursales();
    }, []);

    const handleSelectChange = (event) => {
        handleSelectedSucursal(event.target.value);
        setSelectedSucursal(event.target.value);
    };

    return (
        <label>
            <select value={selectedSucursal} onChange={handleSelectChange} required>
                <option value="">Selecciona una sucursal</option>
                {sucursales.map((sucursal) => (
                    <option key={sucursal.idsucursal} value={sucursal.idsucursal}>
                        {sucursal.nombre}
                    </option>
                ))}
            </select>
        </label>
    );
};

SelectSucursal.propTypes = {
    handleSelectedSucursal: PropTypes.func.isRequired,
};