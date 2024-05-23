import { AddWorker } from './AddWorker';
import { UpdateWorker } from './UpdateWorker';

export const WorkerManager = () => {
    return (
        <div className='contenedorGrid'>

           
            <div>
                <AddWorker />
            </div>
            <div>
                <UpdateWorker />
            </div>
            
        </div>
    )
}