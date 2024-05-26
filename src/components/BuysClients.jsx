import { useState, useEffect } from 'react';
import { SelectClient } from './SelectClient';
import { getHistoryClient } from '../helpers/querys';

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
            <h1>Lista de Compras</h1>
            <SelectClient handleSelectedClient={handleSelectedClient}/>
            <ul>
                {buys.length > 0 ? 
                buys.map((buy, index) => (
                    <li key={index}>
                        <p>Producto: {buy.NOMBREPRODUCTO}</p>
                        <p>Fecha de compra: {buy.FECHACOMPRA}</p>
                        <p>Cantidad: {buy.CANTIDAD}</p>
                        <p>Precio unitario: {buy.PRECIOUNITARIO}</p>
                    </li>
                )) : <p>No hay compras</p>}
            </ul>
        </div>
    );
};
