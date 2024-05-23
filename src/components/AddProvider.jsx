import { useState } from 'react';
import { addProvider } from "../helpers/querys.js"

export const AddProvider = () => {
    const [providerData, setProviderData] = useState({
        nit: '',
        nombre: '',
        telefono: '',
        direccion: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProviderData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const nitNumeric = parseInt(providerData.nit);
        const teleNumeric = parseInt(providerData.telfono)

        if(!nitNumeric && nitNumeric <= 0)
            return alert("Ingrese un nit valido");

        if(!teleNumeric && teleNumeric <= 0)
            return alert("Ingrese un telefono valido");

        if(providerData.nombre.length === 0 || providerData.direccion.length === 0 )
            return alert("Ingrese todos los datos")
        await addProvider(providerData)
            .then(() => alert("Se ha agregado el proveedor exxitosamente"))
            .catch(() => alert("No se pudo agregar el proveedor"));
        
        setProviderData({
            nit: '',
            nombre: '',
            telefono: '',
            direccion: ''
        });
        window.location.href = '/gestionar-proveedor';

    };

    return (
        <div>
            <h2 className='Tittle-Agregar-Sucursal'>Add Provider</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    NIT:
                    <input className='price-input' type="number" name="nit" value={providerData.nit} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Name:
                    <input className= "price-input" type="text" name="nombre" value={providerData.name} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Phone:
                    <input className='price-input' type="number" name="telefono" value={providerData.phone} onChange={handleChange} required />
                </label>
                <br />
                <label>
                    Address:
                    <input className='price-input' type="text" name="direccion" value={providerData.address} onChange={handleChange} required />
                </label>
                <br />
                <button className='bttEnviar' type="submit">Agregar</button>
            </form>
        </div>
    );
};
