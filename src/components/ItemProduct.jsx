import "../styles/ItemProduct.css";
import PropTypes from "prop-types";

/* Es el componente donde se es tablece como se va a mostrar el producto, ademas tambien que va a hacer cuadno se le de click */
export const ItemProduct = ({ producto, onClick }) => {
  const handleClick = () => {
    onClick(producto);
  };

  return (
    <li key={producto[0]} className="catalogo-producto" onClick={handleClick}>
      <strong>ID:</strong> {producto[0]},<strong>Nombre:</strong> {producto[1]},
      <strong>Descripción:</strong> {producto[2]},<strong>Precio:</strong>{" "}
      {producto[3]}
    </li>
  );
};


ItemProduct.propTypes = {
  producto: PropTypes.array,
  onClick: PropTypes.func,
};
