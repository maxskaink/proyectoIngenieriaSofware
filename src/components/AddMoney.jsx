import  { useState } from 'react';
import { addMoneyBranch} from '../helpers/querys';
import { SelectSucursal } from './SelectSucursal';

export const AddMoney = () => {
    const [info, setInfo] = useState({
        idSucursal: undefined,
        dinero: 0
    });

    const handleInputChange = (e) => {
        setInfo({
            ...info,
            dinero: e.target.value
        });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();


        if(parseInt(info.dinero) <= 0) return alert('Por favor ingresa una cantidad mayor a 0');

        console.log(info);
        await addMoneyBranch(info)
            .then(() => alert('Dinero agregado correctamente'))
            .catch(() => alert('Error al agregar dinero'));
        //window.location.reload();
    };

    const handleSelectSucursal = (idSucursal) => {
        setInfo({
            ...info,
            idSucursal
        });
    }

    return (
        <div >
            <div className='containerAddMoney'>
                <h2 className='Tittle-Agregar-Sucursal' >Agregar Dinero</h2>
                <form  className='divisor' onSubmit={handleSubmit}>
                    <SelectSucursal handleSelectedSucursal={handleSelectSucursal} />
                    <input className='price-input'
                        type="number"
                        value={info.dinero}
                        onChange={handleInputChange}
                        placeholder="Ingrese la cantidad"
                        required
                    />
                    <button className='bttEnviar' type="submit">Agregar</button>
                </form>
            </div>
        </div>
    );
};
