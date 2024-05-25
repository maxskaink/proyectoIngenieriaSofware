import { AddSucursal } from './AddSucursal';
import { UpdateSucursal } from './UpdateSucursal';
import { AddMoney } from './AddMoney';
import { WorkerManager } from './WorkerManager';
import '../styles/sucursalManager.css';

export const SucursalManager = () => {
    return (
        <div className='contenedorOverflow'>
            <div className='columnaManager'>
                <h1>Gestionador de sucursales</h1>
                <AddSucursal />
                <UpdateSucursal />
                <AddMoney />
            </div>
            <div className='columnaManager' >
            <h1>Gestionador de trabajadores</h1>
                <WorkerManager />

            </div>
            
        </div>
    )
}