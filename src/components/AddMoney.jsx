import  { useState } from 'react';
import {addMoney} from '../helpers/querys';

export const AddMoney = () => {
    const [amount, setAmount] = useState('');

    const handleInputChange = (e) => {
        setAmount(e.target.value);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        // Validaciones básicas
        if (amount.trim() === '') return alert('Por favor ingresa una cantidad');

        if (isNaN(amount)) return alert('Por favor ingresa un número válido');

        if(parseInt(amount) <= 0) return alert('Por favor ingresa una cantidad mayor a 0');

        addMoney( parseInt(amount) )
            .then(() => alert('Dinero agregado correctamente'))
            .catch(() => alert('Error al agregar el dinero'));

        setAmount('');
    };

    return (
        <div>
            <h2>Agregar Dinero</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={amount}
                    onChange={handleInputChange}
                    placeholder="Ingrese la cantidad"
                />
                <button type="submit">Agregar</button>
            </form>
        </div>
    );
};
