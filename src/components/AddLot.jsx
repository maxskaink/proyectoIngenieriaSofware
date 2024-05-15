import  { useState } from 'react';
import { addLot } from '../helpers/querys';

export const AddLot = () => {
    const [lotData, setLotData] = useState({
        fechaCreacion: '',
        fechaVencimiento: ''
    });

    const handleInputChange = (e) => {
        setLotData({
            ...lotData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        const formattedFechaCreacion = new Date(lotData.fechaCreacion).toLocaleDateString('es-ES').split('/').join('-');
        const formattedFechaVencimiento = new Date(lotData.fechaVencimiento).toLocaleDateString('es-ES').split('/').join('-');

        const lotDataWithFormattedDates = {
            ...lotData,
            fProduccion: formattedFechaCreacion,
            fVencimiento: formattedFechaVencimiento
        };

        await addLot(lotDataWithFormattedDates)
            .then(() => alert('Lote agregado'))
            .catch(() => alert('Error al agregar lote'));
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Fecha de Creación:
                <input
                    type="date"
                    name="fechaCreacion"
                    value={lotData.fechaCreacion}
                    onChange={handleInputChange}
                    required
                />
            </label>
            <br />
            <label>
                Fecha de Vencimiento:
                <input
                    type="date"
                    name="fechaVencimiento"
                    value={lotData.fechaVencimiento}
                    onChange={handleInputChange}
                    required
                />
            </label>
            <br />
            <button type="submit">Guardar</button>
        </form>
    );
};