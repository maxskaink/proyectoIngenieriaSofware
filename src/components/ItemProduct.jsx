import "../styles/ItemProduct.css";
import PropTypes from "prop-types";
import { Product } from "../class/product";

const defaultProduct = new Product([]);
/* Es el componente donde se es tablece como se va a mostrar el producto, ademas tambien que va a hacer cuadno se le de click */
export const ItemProduct = ({ producto = defaultProduct, onClick }) => {
  const handleClick = () => {
    onClick(producto);
  };

  return (
     <div>

      <li key={producto.id} id={producto.id} className="catalogo-producto" onClick={handleClick}>
        <div className="contenedor">
          <div className="columna">
             {producto.nombre}
          </div>
          <div className="columna">
             {producto.descripcion}
          </div>
          <div className="columna">
            {producto.precio}
          </div>
        </div>
      </li>
    </div>
  );
};


ItemProduct.propTypes = {
  producto: PropTypes.object,
  onClick: PropTypes.func,
};
