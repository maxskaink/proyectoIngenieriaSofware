import { useState, useEffect } from 'react';
import { Trabajador } from '../class/trabajador';
import { getWorkers } from '../helpers/querys';
import { PropTypes } from 'prop-types';

const defaultWorker = new Trabajador(['', '', '', '', '', '']);

export const SelectWorker = ({handleSelectWorker, filterWorker = ()=> true, disable}) => {
    const [workers, setWorkers] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState('');

    const handleWorkerChange = (event) => {
        setSelectedWorker(event.target.value);
        handleSelectWorker(event.target.value);
    };

    useEffect(() => {
        const getInfo = async () => {
            await getWorkers().then((response) => {
                setWorkers(response);
            });
        };
        getInfo();
    }, []);

    return (
        <div>
            <select className="select-product" id="worker" value={selectedWorker} onChange={handleWorkerChange}>
                <option value="">Selecciona un trabajador</option>
                {workers.map((worker = defaultWorker) => (
                    filterWorker(worker) &&
                    <option key={worker.cedulaTrabajador} value={worker.cedulaTrabajador}>
                        {worker.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};

SelectWorker.propTypes = {
    handleSelectWorker: PropTypes.func.isRequired,
    filterWorker: PropTypes.func,
    disable: PropTypes.bool,
};