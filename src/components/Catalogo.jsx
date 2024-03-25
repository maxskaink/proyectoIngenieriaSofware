import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../constants/API";
import "../styles/catalogo.css";

import { ItemProduct } from "./ItemProduct";
import { SearchBar } from "./SearchBard";

/* no hace nada realmente, solo es para que siempre se llame a una funcion y no a un undfined */
const handleSelectProductDefault = (props) => {
  console.log(
    `cuando utilice el catalogo por favor ingrese una funcion para saber que hacer cuando se clickea en los items`
  );
  console.log(props);
};

export const Catalogo = ({
  handleSelectProduct = handleSelectProductDefault,
  productSelected = [],
}) => {
  /* Array de todos los prodcutos de la base de datos */
  const [productos, setProductos] = useState([]);

  /* Nos da la informacion de la barra de busqueda */
  const [search, setSearch] = useState([]);

  /* Manjea uqe hacer cuando se escribe algo en la barra de busqueda */
  const handleSearch = (value) => {
    setSearch(value);
  };
  /* cuando se hace click en algun produco se le manda la info a la funcion que se resibio como parametro */
  const handleClick = (info) => {
    handleSelectProduct(info);
  };
  /* Actualiza la lista de producos cada vez que se carga el componente, se hace una busqueda o se cambia el atributo seleccionado */
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get(API.consultarProductos);

        if (response.status === 200) {
          setProductos(response.data);
        } else {
          console.error("Error al obtener la lista de productos");
        }
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
        </div>


      </div>
      <ul className="catalogo-lista">
        {productos && productos.length > 0 ? (
          productos.map(
            (producto, index) =>
              (producto[1].toString().includes(search) ||
                search.toString().length === 0) && (
                <ItemProduct
                  key={index}
                  producto={producto}
                  onClick={handleClick}
                />
              )
          )
        ) : (
          <li>No hay productos disponibles</li>
        )}
      </ul>
    </div>
  );
};

Catalogo.propTypes = {
  handleSelectProduct: PropTypes.func,
  productSelected: PropTypes.array,
};
