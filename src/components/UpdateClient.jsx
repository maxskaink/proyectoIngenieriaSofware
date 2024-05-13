import  { useState } from 'react';
import { updateClient } from '../helpers/querys';
import { SelectClient } from './SelectClient';

export const UpdateClient = () => {
    const [clientData, setClientData] = useState({
        cedula: '',
        nombre: '',
        correo: ''
    });

    const handleChange = (e) => {
        setClientData({
            ...clientData,
            [e.target.name]: e.target.value
        });
    };

    const handleSelectedClient = (cedula) => {
        setClientData({...clientData, cedula});
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        await updateClient(clientData)
            .then(() => alert('Cliente actualizado correctamente'))
            .catch(() => alert('Error al actualizar cliente'));
        window.location.href = '/gestionar-clientes';
    };

    return (
        <div>
            <h2>Actualizar Cliente</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <SelectClient handleSelectedClient={handleSelectedClient}/>
                </div>
                <div>
                    <label>Nombre:</label>
                    <input
                        type="text"
                        name="nombre"
                        value={clientData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Correo:</label>
                    <input
                        type="email"
                        name="correo"
                        value={clientData.correo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Guardar</button>
            </form>
        </div>
    );
};

