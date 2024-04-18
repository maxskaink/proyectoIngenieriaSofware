import { Catalogo } from "./Catalogo";
import { Product } from "../class/product";
import '../styles/businessReport.css';

const defaultProduct = new Product([]);

export const BusinessReport = () => {

    const hanldeValition = (producto = defaultProduct) => {
        if (producto.cantidadStock < 5) {
            return true;
        }
        return false;
    }

    return (
        <div className="containerReports">
            <div>
                <h2>Informes semanales</h2>
                <p>Ni idea de como se va a manejar los informes semanales</p>
            </div>
            <div className="containerReports-stocks">
                <div>
                    <h2>Informe de falta de stock o bajo stock</h2>
                    <Catalogo cantidadStock hanldeValition={hanldeValition} />
                </div>
                <div>
                    <h2>Informe de stock</h2>
                    <Catalogo cantidadStock />
                </div>                                          
            </div>
        </div>
    );
};
