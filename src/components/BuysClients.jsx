import { useState, useEffect } from 'react';
import { SelectClient } from './SelectClient';
import { getHistoryClient } from '../helpers/querys';
import "../styles/report.css";
export const BuysClients = () => {

    const [buys, setBuys] = useState([]);
    const [idClient, setIdClient] = useState(undefined);
    // Obtener la información de compra
    
    useEffect(() => {
        if(idClient)
            getHistoryClient(idClient)
                .then(async (response) => await setBuys(response));
    }, [idClient]);
    const handleSelectedClient = (client) => {
        setIdClient(client);
    }

    return (
        <div>
           
            <div className='serarch-bar'>
                < SelectClient handleSelectedClient={handleSelectedClient}/>
            </div>
            
            <ul className='contenedor-semana'>
                {buys.length > 0 ? 
                buys.map((buy, index) => (
                    <li key={index}  className='cont-inform-semana'>
                        <p>Producto: {buy.NOMBREPRODUCTO}</p>
                        <p>Fecha de compra: {buy.FECHACOMPRA}</p>
                        <p>Cantidad: {buy.CANTIDAD}</p>
                        <p>Precio unitario: {buy.PRECIOUNITARIO}</p>
                    </li>
                )) : <p className='letrero-sinCompras'>No hay compras</p>}
            </ul>
        </div>
    );
};
