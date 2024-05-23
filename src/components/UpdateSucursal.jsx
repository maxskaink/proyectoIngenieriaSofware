import { useState } from 'react';
import { SelectSucursal } from './SelectSucursal';
import { updateBranch } from '../helpers/querys';

export const UpdateSucursal = () => {

    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        direccion: '',
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
        
        if(formattedPhone <= 0 && formData.telefono.length > 0)
            return alert("Ingrese un telefono valido");

        await updateBranch(formData)
            .then(() => alert('Se ha hecho la actualizacion de la sucursal'))
            .catch(() => alert('Ha ocurrido un error'));
        window.location.href = '/gestionar-Sucursales';
    };
    const handleSelectedSucursal = (idSucursal) => {
        setFormData({
            ...formData,
            idSucursal
        })
    }

    return (
        <>
        <h2>Actualizar Sucursal</h2>
            <form onSubmit={handleSubmit}>
                <SelectSucursal handleSelectedSucursal={handleSelectedSucursal} />
                <label>
                    Nombre:
                    <input className='price-input'
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Teléfono:
                    <input className='price-input'
                        type="number"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Dirección:
                    <input className='price-input'
                        type="text"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                    />
                </label>
                <button className= "bttEnviar" type="submit">Guardar</button>
            </form>
        </>
    );

};