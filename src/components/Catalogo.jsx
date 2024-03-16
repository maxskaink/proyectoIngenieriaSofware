/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { API } from "../constants/API";
import "../styles/catalogo.css";

import { ItemProduct } from './ItemProduct';
import { SearchBar } from './SearchBard';

const handleSelectProductDefault = (props) => {
  console.log(
    `cuando utilice el catalogo por favor ingrese una funcino para saber que hacer cuando se clicl en los items`
  );
  console.log(props);
};


export const Catalogo = ({
  handleSelectProduct = handleSelectProductDefault,
  productoAtributos = [],
}) => {
  const [productos, setProductos] = useState([]);

  const [search, setSearch] = useState([]);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleClick = (info) => {
    handleSelectProduct(info);
  };

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
  }, [search, productoAtributos]);

  return (
    <div className="catalogo">
      <SearchBar onSearch={handleSearch} />
      <h2 className="catalogo-titulo">Lista de Productos </h2>
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
