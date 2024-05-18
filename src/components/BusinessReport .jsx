import { Catalogo } from "./Catalogo";
import { Product } from "../class/product";
import { WeeklyReport } from "./WeeklyReport.jsx";
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
        <div className="total"> 
            <div className="containerReports">
                <div className="containerInforme">
                    <WeeklyReport />
                </div>
                <div className="containerReports-stocks">
                    <div className="container-bajoStock">
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
                    <div className="container-stock">
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
        </div>
    );
};
