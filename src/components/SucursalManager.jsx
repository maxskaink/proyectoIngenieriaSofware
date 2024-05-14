import { AddSucursal } from './AddSucursal';
import { UpdateSucursal } from './UpdateSucursal';

export const SucursalManager = () => {
    return (
        <div>
            <h1>Gestionador de sucursales</h1>
            <AddSucursal />
             <UpdateSucursal />
        </div>
    )
}