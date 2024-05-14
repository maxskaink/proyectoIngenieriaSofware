import { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { getLots  } from '../helpers/querys';

export const SelectLot = ({handleSelectLot, disabled}) => {
    const [lots, setLots] = useState([]);
    const [selectedLot, setSelectedLot] = useState("");

    useEffect(() => {
        // Lógica para obtener los lotes de la API y actualizar el estado
        const fetchLots = async () => {
            await getLots().then((response) => {
                setLots(response);
            });
        }
        fetchLots();
    }, []);

    const handleLotChange = (event) => {
        const selectedLotId = event.target.value;
        setSelectedLot(selectedLotId);
        handleSelectLot(selectedLotId);
    };

    return (
        <div>
            <select value={selectedLot} onChange={handleLotChange} required disabled={disabled}>
                <option value="">Seleccione un lote</option>
                {lots.map(lot => (
                    <option key={`select-lot-${lot.idLote}`} value={lot.idLote}>{lot.fechaProduccion + " - " + lot.fechaVencimiento}</option>
                ))}
            </select>
        </div>
    );
};

SelectLot.propTypes = {
    handleSelectLot: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};