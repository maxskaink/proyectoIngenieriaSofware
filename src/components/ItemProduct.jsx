import "../styles/ItemProduct.css";
import PropTypes from "prop-types";

/* Es el componente donde se es tablece como se va a mostrar el producto, ademas tambien que va a hacer cuadno se le de click */
export const ItemProduct = ({ producto, onClick }) => {
  const handleClick = () => {
    onClick(producto);
  };

  return (
     <div>

      <li key={producto[0]} id={producto[0]} className="catalogo-producto" onClick={handleClick}>
        {/*  No creo que sea necesario mostrar esto <strong>ID:</strong> {producto[0]}, */}
        
        <div className="contenedor">
          <div className="columna">
             {producto[1]}
          </div>
          <div className="columna">
             {producto[2]}
          </div>
          <div className="columna">
            {producto[3]}
          </div>
        </div>
      </li>
    </div>
  );
};


ItemProduct.propTypes = {
  producto: PropTypes.array,
  onClick: PropTypes.func,
};
