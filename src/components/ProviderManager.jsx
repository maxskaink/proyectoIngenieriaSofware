import { AddProvider } from "./AddProvider";
import { UpdateProvider } from "./UpdateProvider";

export const ProviderManager = () => {
    return (
        <div>
            <h1>Gestionar Proveedor</h1>
            <AddProvider />
            <UpdateProvider />
        </div>
    );
}