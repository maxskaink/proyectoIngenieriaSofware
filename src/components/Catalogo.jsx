import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "../styles/catalogo.css";

import { ItemProduct } from "./ItemProduct";
import { SearchBar } from "./SearchBard";
import { getProducts } from "../helpers/querys";

/* no hace nada realmente, solo es para que siempre se llame a una funcion y no a un undfined */
const handleSelectProductDefault = (props) => {
  console.log(
    `cuando utilice el catalogo por favor ingrese una funcion para saber que hacer cuando se clickea en los items`,
  );
  console.log(props);
};

export const Catalogo = ({
  handleSelectProduct = handleSelectProductDefault,
  productSelected = undefined,
  cantidadStock = false,
  hanldeValition = () => true,
}) => {
  /* Array de todos los productos de la base de datos */
  const [productos, setProductos] = useState([]);

  /* Nos da la informacion de la barra de busqueda */
  const [search, setSearch] = useState("");

  /* Maneja que hacer cuando se escribe algo en la barra de busqueda */
  const handleSearch = (value) => {
    setSearch(value);
  };
  /* cuando se hace click en algun produco se le manda la info a la funcion que se recibio como parametro */
  const handleClick = (info) => {
    handleSelectProduct(info);
  };
  /* Actualiza la lista de producos cada vez que se carga el componente, se hace una busqueda o se cambia el atributo seleccionado */
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await getProducts();
        setProductos(response.data);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    fetchProductos();
  }, [search, productSelected]);

  return (
    <div className="catalogo">
      <div className="cabecera">
        <h2 className="catalogo-titulo">Lista de Productos </h2>
        <SearchBar onSearch={handleSearch} />
        <div className="contenedor">
          <div className="columnaHeader">
            {" "}
            <strong> NOMBRE:</strong>{" "}
          </div>
          <div className="columnaHeader">
            <strong>DESCRICION </strong>
          </div>
          <div className="columnaHeader">
            <strong> PRECIO </strong>
          </div>
          <div className="columnaHeader">
            <strong> CATEGORIA </strong>
          </div>
          {
            cantidadStock && 
            <div className="columnaHeader">
              <strong> STOCK </strong>
            </div>
          }
        </div>
      </div>
      <ul className="catalogo-lista">
        {productos && productos.length > 0 ? (
          productos.map(
            (producto, index) =>
              (producto.nombre.toUpperCase().includes(search.toUpperCase()) || search.toString().length === 0 ||
                producto.categoria.toUpperCase().includes(search.toUpperCase())) &&
                hanldeValition(producto) && (
                <ItemProduct
                  key={index}
                  producto={producto}
                  onClick={handleClick}
                  cantidadStock={cantidadStock}
                />
              ),
          )
        ) : (
          <li>No hay productos disponibles</li>
        )}
      </ul>
    </div>
  );
};

Catalogo.propTypes = {
  hanldeValition: PropTypes.func,
  cantidadStock: PropTypes.bool,
  handleSelectProduct: PropTypes.func,
  productSelected: PropTypes.object,
};
