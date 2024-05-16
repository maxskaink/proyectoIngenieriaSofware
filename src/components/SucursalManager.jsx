import { AddSucursal } from './AddSucursal';
import { UpdateSucursal } from './UpdateSucursal';
import { AddMoney } from './AddMoney';
import { WorkerManager } from './WorkerManager';

export const SucursalManager = () => {
    return (
        <div>
            <h1>Gestionador de sucursales</h1>
            <AddSucursal />
            <UpdateSucursal />
            <AddMoney />
            <WorkerManager />
        </div>
    )
}