import{ useState } from 'react';
import { addClient } from '../helpers/querys';

export const AddClient = () => {
    const [formData, setFormData] = useState({
        cedula: '',
        nombre: '',
        correo: '',
        fechaNacimiento: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formattedDate = formData.fechaNacimiento.split('-').reverse().join('/');
        const formattedData = { ...formData, fechaNacimiento: formattedDate };
        
        await addClient(formattedData)
            .then(() => alert('Cliente agregado correctamente'))
            .catch(() => alert('Error al agregar cliente, verfique que la cedula no esté repetida'));
        window.location.href = '/gestionar-clientes';

    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Cédula:
                <input className='price-input'
                    type="number"
                    name="cedula"
                    value={formData.cedula}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Nombre:
                <input  className='price-input'
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Correo Electrónico:
                <input  className='price-input'
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <label>
                Fecha de Nacimiento:
                <input  className='price-input'
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    required
                />
            </label>
            <br />
            <button className= "bttEnviar" type="submit">Guardar</button>
        </form>
    );
};

