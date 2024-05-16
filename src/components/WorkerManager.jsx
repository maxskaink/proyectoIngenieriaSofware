import { AddWorker } from './AddWorker';
import { UpdateWorker } from './UpdateWorker';

export const WorkerManager = () => {
    return (
        <div>
            <h1>Gestionador de trabajadores</h1>
            <AddWorker />
            <UpdateWorker />
        </div>
    )
}