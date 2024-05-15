import { Catalogo } from "./Catalogo";
import { Product } from "../class/product";
import { WeeklyReport } from "./WeeklyReport.jsx";
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
        <div className="containerReports">
            <div className="containerInforme">
                <WeeklyReport />
            </div>
            <div className="containerReports-stocks">
                <div>
                    <h2>Informe de falta de stock o bajo stock</h2>
                    <Catalogo 
                        cantidadStock 
                        hanldeValition={hanldeValition}
                        hideDescription
                        hidePrice
                        //hideSearch
                        hideTitle 
                    />
                </div>
                <div>
                    <h2>Informe de stock</h2>
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
    );
};
