import  { useState } from 'react';
import { SelectWorker } from './SelectWorker';
import { SelectSucursal } from './SelectSucursal';
import { updateWorker } from '../helpers/querys';
import '../styles/updateWorker.css';
export const UpdateWorker = () => {
    const [workerData, setWorkerData] = useState({
        nombre: '',
        puesto: '',
        salario: '',
        cedula: undefined,
        idSucursal: undefined,
        activado: 1
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setWorkerData({ ...workerData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(workerData);
        // Aquí puedes realizar cualquier lógica adicional, como enviar los datos al servidor
        await updateWorker(workerData)
        .then(() => alert('Empleado actualizado correctamente'))
        .catch(() => alert('Error al actualizar el empleado'));
        window.location.reload();
    };
    const handleDeleate = async (e) => {
        e.preventDefault();
        if(workerData.cedula === '')
            return alert('Debes seleccionar un trabajador');
        const workDataForDeleate = {
            ...workerData,
            activado: 0
        }
        // Aquí puedes realizar cualquier lógica adicional, como enviar los datos al servidor
        await updateWorker(workDataForDeleate)
        .then(() => alert('Empleado eliminado correctamente'))
        .catch(() => alert('Error al eliminar el empleado'));
        window.location.reload();
    }

    const handleSelectWorker = (cedula) => 
        setWorkerData(prevWorkerData => ({
            ...prevWorkerData,
            cedula
        }));
    const handleSelectSucursal = (idSucursal) =>
        setWorkerData(prevWorkerData => ({
            ...prevWorkerData,
            idSucursal
        }));
    return (
        <div >
            <h2>Actualizar Empleado</h2>
            <form className='divisor' onSubmit={handleSubmit}>
                <SelectWorker handleSelectWorker={handleSelectWorker} />
                <SelectSucursal handleSelectedSucursal={handleSelectSucursal} />
                <label>
                    Nombre:
                    <input className='price-input'
                        type="text"
                        name="nombre"
                        value={workerData.name}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <label>
                    Puesto:
                    <select  className='price-input'
                        name="puesto"
                        value={workerData.position}
                        onChange={handleInputChange}
                    >
                        <option value="">Seleccionar</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Empleado">Empleado</option>
                    </select>
                </label>
                <br />
                <label>
                    Salario:
                    <input  className='price-input'
                        type="number"
                        name="salario"
                        value={workerData.salary}
                        onChange={handleInputChange}
                    />
                </label>
                <br />
                <div className='contenedorBotones'>
                    <button className= "add-button"type="submit">Guardar</button>
                    <button className='botonRojo' onClick={handleDeleate}> Eliminar Trabajador</button>
                </div>
                
            </form>
        </div>
    );
};

