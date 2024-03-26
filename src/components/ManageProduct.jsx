/* eslint-disable react/prop-types */
import { useState } from "react";
import "../styles/manageProduct.css";
import { infoFormanageProductoValid } from "../helpers/validations";


export const ManageProduct = ({
  handleManagement,
  product,
  title,
  children,
}) => {
  const [infoNewProduct, setInfoNewProducto] = useState({
    id: product ? product[0] : "",
    nombre: product ? product[1] : "",
    descripcion: product ? product[2] : "",
    precio: product ? product[3] : "",
  });

  const [stateForm, setStateForm] = useState({
    isValid: true,
    message: "",
    className: "manageProduct-message",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validate = infoFormanageProductoValid(name, value);

    setStateForm({
      isValid: validate.isValid,
      message: validate.message,
      className: validate.isValid
        ? "manageProduct-message"
        : "manageProduct-message-error",
    });
    if (validate.isValid && value.toString != "")
      setInfoNewProducto((prevProducto) => ({ ...prevProducto, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(infoNewProduct.nombre === "" || infoNewProduct.descripcion === "" || infoNewProduct.precio === "") {
      setStateForm(
        {
          isValid: false,
          message: "Ingrese al menos una descripcion, precio y nombre del producto",
          className: "manageProduct-message-error",
        }
      );
      return;
    }

    let response;
    try {
      response = await handleManagement(infoNewProduct);
      if (response.data.state === "OK")
        setStateForm({
          isValid: true,
          message: "Se ha agregado el producto",
          className: "manageProduct-message",
        });
    } catch (error) {
      console.log(error);
      setStateForm({
        isValid: false,
        message: error.response.data.message.toString(),
        className: "manageProduct-message-error",
      });
    }
  };

  //TODO recordar cambiar esto, para que no pida la id, y funcioine normalmente el title
  return (
    <div className="manageProduct">
      <h2 className="manageProduct-titulo">
        {" "}
        {title}
      </h2>
      <form onSubmit={handleSubmit} className="manageProduct-form">
        <label className="manageProduct-label">
          Nombre:
          <input
            className="cmBoxDescripcion"
            type="text"
            name="nombre"
            value={infoNewProduct.nombre}
            onChange={handleChange}
          />
        </label>

        <label className="manageProduct-label">
          Descripción:
          <textarea className="cmBoxDescripcion"
            name="descripcion"
            value={infoNewProduct.descripcion}
            onChange={handleChange}
          />
        </label>

        <label className="manageProduct-label">
          Precio:
          <input
            className="cmBoxDescripcion"
            type="number"
            name="precio"
            value={infoNewProduct.precio}
            onChange={handleChange}
          />
        </label>

        <button
          type="submit"
          className="manageProduct-button button"
          disabled={!stateForm.isValid}
        >
          {title ? title : "Agregar Producto"}
        </button>
        {children}
      </form>
      <label className={stateForm.className}>{stateForm.message}</label>
    </div>
  );
};
