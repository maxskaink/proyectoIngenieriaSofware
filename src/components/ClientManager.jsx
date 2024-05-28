import { AddClient } from "./AddClient";
import { UpdateClient } from "./UpdateClient";
import '../styles/clientManager.css';

export const ClientManager = () => {
    return (
        <div className="contenedorGeneral">
            <div className="contenedor-Manager">
                <h1>Gestionador de clientes</h1>
                <AddClient />
                <UpdateClient />
            </div>
            
        </div>
    )
}