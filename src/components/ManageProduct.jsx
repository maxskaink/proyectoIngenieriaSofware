/* eslint-disable react/prop-types */
import { useState } from "react";
import "../styles/manageProduct.css";
import { infoFormanageProductoValid } from "../helpers/validations";


export const ManageProduct = ({
  handleUpdate,
  handleManagement,
  product,
  title,
  children,
}) => {
  const [producto, setProducto] = useState({
    id: product ? product[0] : "",
    nombre: product ? product[1] : "",
    descripcion: product ? product[2] : "",
    precio: product ? product[3] : "",
  });

  const [state, setState] = useState({
    isValid: true,
    message: "",
    className: "manageProduct-message",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validate = infoFormanageProductoValid(name, value);

    setState({
      isValid: validate.isValid,
      message: validate.message,
      className: validate.isValid
        ? "manageProduct-message"
        : "manageProduct-message-error",
    });
    if (validate.isValid && value.toString != "")
      setProducto((prevProducto) => ({ ...prevProducto, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    try {
      response = await handleManagement(producto);
      if (response.data.state === "OK")
        setState({
          isValid: true,
          message: "Se ha agregado el producto",
          className: "manageProduct-message",
        });
      handleUpdate && handleUpdate([]);
    } catch (error) {
      console.log(error);
      setState({
        isValid: false,
        message: error.response.data.message.toString(),
        className: "manageProduct-message-error",
      });
    }
  };

  //TODO recordar cambiar esto, para que no pida la id, y funcioine normalmente el title
  return (
    <div className="manageProduct">
            {children}
      <h2 className="manageProduct-titulo">
        {" "}
        {title}
      </h2>
      <form onSubmit={handleSubmit} className="manageProduct-form">
        <label className="manageProduct-label">
          Nombre:
          <input
            type="text"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
          />
        </label>

        <label className="manageProduct-label">
          Descripción:
          <textarea
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
          />
        </label>

        <label className="manageProduct-label">
          Precio:
          <input
            type="number"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          className="manageProduct-button button"
          disabled={!state.isValid}
        >
          {title ? title : "Agregar Producto"}
        </button>
      </form>
      <label className={state.className}>{state.message}</label>
    </div>
  );
};
