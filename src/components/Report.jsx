import { Inform } from "../class/inform";
import { PropTypes } from 'prop-types';
import "../styles/report.css";

const informDefault = new Inform([]);

export const Report = ({ infoReport = informDefault, sizeText}) => {
    return (
        <div className={`cont-inform-semana ${sizeText}`}>
            <p>Semana: {infoReport.SEMANA}</p>
            <p>Ingresos por ventas: {infoReport.INGRESOS_VENTAS}</p>
            <p>Número de ventas: {infoReport.NUMERO_VENTAS}</p>
            <p>Precio promedio de venta: {infoReport.PRECIO_PROMEDIO_VENTA}</p>
            <p>Gastos en compras: {infoReport.GASTOS_COMPRAS}</p>
            <p>Número de compras: {infoReport.NUMERO_COMPRAS}</p>
            <p>Precio promedio de compra: {infoReport.PRECIO_PROMEDIO_COMPRA}</p>
            <p>Producto más vendido: {infoReport.PRODUCTO_MAS_VENDIDO}</p>
            <p>Producto menos vendido: {infoReport.PRODUCTO_MENOS_VENDIDO}</p>
            <p>Producto más comprado: {infoReport.PRODUCTO_MAS_COMPRADO}</p>
            <p>Producto menos comprado: {infoReport.PRODUCTO_MENOS_COMPRADO}</p>
            <p>Saldo final de caja: {infoReport.SALDO_FINAL_CAJA}</p>

        </div>
    );
};


Report.propTypes = {
    infoReport: PropTypes.object,
    sizeText: PropTypes.string
}