import { Catalogo } from "./Catalogo";
import { BuysClients } from "./BuysClients.jsx";
import { Product } from "../class/product";
import '../styles/businessReport.css';

const defaultProduct = new Product([]);

export const BusinessReport = () => {

    const hanldeValition = (producto = defaultProduct) => {
        if (producto.cantidad < 5) {
            return true;
        }
        return false;
    }

    return (
        <div className="total"> 
            <div className="containerReports">
                <div className="containerInforme">
                    <h2 className="title-stock">Informe de compras</h2>
                    <BuysClients />
                </div>
                <div className="containerReports-stocks">
                    <div className="container-bajoStock">
                        <h2 className="title-stock">Informe de falta de stock o bajo stock</h2>
                        <Catalogo 
                            cantidadStock 
                            hanldeValition={hanldeValition}
                            hideDescription
                            hidePrice
                            //hideSearch
                            hideTitle 
                        />
                    </div>
                    <div className="container-stock">
                        <h2 className="title-stock">Informe de stock</h2>
                        <Catalogo 
                            cantidadStock 
                            hideDescription
                            hidePrice
                            //hideSearch
                            hideTitle
                        />
                    </div>                                          
                </div>
            </div>
        </div>
    );
};