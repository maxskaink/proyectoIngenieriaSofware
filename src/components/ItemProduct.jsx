import "../styles/ItemProduct.css";
import PropTypes from "prop-types";
import { Product } from "../class/product";

const defaultProduct = new Product([]);
/* Es el componente donde se es tablece como se va a mostrar el producto, ademas tambien que va a hacer cuadno se le de click */
export const ItemProduct = ({
  producto = defaultProduct, 
  onClick, 
  cantidadStock,
  hideDescription,
  hidePrice, 
}) => {
  const handleClick = () => {
    onClick(producto);
  };

  return (
    <div>
      <li
        key={producto.id}
        id={producto.id}
        className="catalogo-producto"
        onClick={handleClick}
      >
        <div className="contenedor">
          <div className="columna">{producto.nombre}</div>
          {
            hideDescription ||
            <div className="columna">{producto.descripcion}</div>
          }
          {
            hidePrice ||
            <div className="columna">{producto.precio}</div>
          }
          {cantidadStock&&<div className="columna">{producto.cantidadStock}</div>}
        </div>
      </li>
    </div>
  );
};

ItemProduct.propTypes = {
  cantidadStock: PropTypes.bool,
  producto: PropTypes.object,
  onClick: PropTypes.func,
  hideDescription: PropTypes.bool,
  hidePrice: PropTypes.bool,
};
