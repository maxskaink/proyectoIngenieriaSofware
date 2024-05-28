import  { useState } from 'react';
import { SelectProvider } from './SelectProvider';
import { updateProvider } from '../helpers/querys';

export function UpdateProvider() {
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        direccion: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSelectedProvider = (nit) => {  
        setFormData({
            ...formData,
            nit: nit
        });
    }

    const handleSubmit =  async(e) => {
        e.preventDefault();

        const numberTel = parseInt(formData.telefono);
        if((!numberTel || numberTel <= 0) && formData.telefono.length != 0)
            return alert("Ingrese un numero validio");

        await updateProvider(formData)
            .then((res) => alert(res.data.message))
            .catch(() => alert("Ha habido un error"));
        setFormData({
            nombre: '',
            telefono: '',
            direccion: ''
        });
        window.location.href = '/gestionar-proveedor';
    };

    return (
        <div>
            <h2 className='Tittle-Agregar-Sucursal'>Actualizar proveedor</h2>
            <form onSubmit={handleSubmit}>
                <SelectProvider handleSelectedProvider={handleSelectedProvider} />

                <label>
                    Nombre:
                    <input className='price-input' type="text" name="nombre" value={formData.name} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Teléfono:
                    <input className='price-input' type="number" name="telefono" value={formData.phone} onChange={handleChange} />
                </label>
                <br />
                <label>
                    Dirección:
                    <input className='price-input' type="text" name="direccion" value={formData.address} onChange={handleChange} />
                </label>
                <br />
                <button className= "bttEnviar" type="submit">Actualizar</button>
            </form>
        </div>
    );
}


