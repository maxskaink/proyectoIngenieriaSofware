import { useState } from 'react';
import { addBranch } from '../helpers/querys';

export const AddSucursal = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        direccion: '',
        capital: 0,
        estado: 1
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedPhone = parseInt(formData.telefono);
        
        if(formattedPhone <= 0)
            return alert("Ingrese un telefono valido");

        await addBranch(formData)
            .then(() => alert('Se ha hecho la insercion de la sucursal'))
            .catch((error) => alert(error.data.message));
        window.location.href = '/gestionar-Sucursales';
    };

    return (
        <>
        <h2>Agregar Sucursal</h2>
        <form onSubmit={handleSubmit}>
            <label>
                Nombre:
                <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Teléfono:
                <input
                    type="number"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Dirección:
                <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                />
            </label>
            <button type="submit">Guardar</button>
        </form>
        </>
    );
};
