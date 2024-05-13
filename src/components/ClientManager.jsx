import { AddClient } from "./AddClient";
import { UpdateClient } from "./UpdateClient";

export const ClientManager = () => {
    return (
        <div>
            <h1>Gestionador de clientes</h1>
            <AddClient />
            <UpdateClient />
        </div>
    )
}