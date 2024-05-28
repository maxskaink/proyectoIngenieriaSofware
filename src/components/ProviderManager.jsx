import { AddProvider } from "./AddProvider";
import { UpdateProvider } from "./UpdateProvider";
import '../styles/providerManager.css';


export const ProviderManager = () => {
    return (
        <div className="contenedorGeneral">
            <div className="contenidoProvider">
                <h1>Gestionar Proveedor</h1>
                <div className="contenedorAgregarProvider">
                    <AddProvider/>
                </div>
                <div className="contenedorActualizaeProvider">
                    <UpdateProvider/>
                </div>
            </div>
        </div>
        
    );
}