import { useState } from 'react';
import { SelectSucursal } from './SelectSucursal';
import { addWorker } from '../helpers/querys';

export const AddWorker = () => {
    const [worker, setWorker] = useState({
        nombre: '',
        puesto: '',
        salario: '',
        cedulaTrabajador: '',
        idSucursal: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setWorker(prevWorker => ({
            ...prevWorker,
            [name]: value
        }));
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(worker.idSucursal === '') 
            return alert('Debes seleccionar una sucursal');
        // Aquí puedes realizar las acciones necesarias con los datos del trabajador
        await addWorker(worker)
            .then(() => alert('Trabajador agregado correctamente'))
            .catch(() => alert('Error al agregar el trabajador'));
        window.location.reload();
    };

    const handleSelectSucursal = (idSucursal) => 
        setWorker(prevWorker => ({
            ...prevWorker,
            idSucursal
        }));

    return (
        <div>
            <h2>Agregar Trabajador</h2>
            <form onSubmit={handleSubmit}>
                <SelectSucursal handleSelectedSucursal={handleSelectSucursal} />
                <label>
                    Nombre:
                    <input type="text" name="nombre" value={worker.name} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Puesto:
                    <select name="puesto" value={worker.position} onChange={handleChange} required>
                        <option value="">Seleccione un puesto</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Empleado">Empleado</option>
                    </select>
                </label>
                <br />
                <label>
                    Salario:
                    <input type="number" name="salario" value={worker.salary} onChange={handleChange} required/>
                </label>
                <br />
                <label>
                    Cédula:
                    <input type="text" name="cedulaTrabajador" value={worker.id} onChange={handleChange} required/>
                </label>
                <br />
                <button type="submit">Agregar</button>
            </form>
        </div>
    );
};
