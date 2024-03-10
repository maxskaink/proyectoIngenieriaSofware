import  { useState } from "react";
import axios from "axios";
import { API } from '../constants/API'
import '../styles/createProduct.css';
import {  infoForCreateProductoValid } from '../helpers/validations'

const nada = () => {
   console.log()
}

const addProduct = async(producto) => {
    return await axios.post(API.agregarProducto, producto)
};

// eslint-disable-next-line react/prop-types
export const ManageProduct = ({handleUpdate = nada, handleManagement = addProduct, product, title}) => {
  const [producto, setProducto] = useState({
    id: (product)? product[0] : '',
    nombre: (product)? product[1] : '',
    descripcion: (product)? product[2] : '',
    precio: (product)? product[3] : '',
  });

  const [state, setState] = useState({
    isValid: true,
    message: '',
    className:'createProduct-message'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validate = infoForCreateProductoValid(name, value)

    setState({isValid:validate.isValid, 
              message: validate.message,
              className: (validate.isValid) ?'createProduct-message' : 'createProduct-message-error' });
    if(validate.isValid && value.toString !='')
      setProducto((prevProducto) => ( {...prevProducto, [name]: value,} ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let response;
    try {
      response = await handleManagement(producto);
      if (response.data.state === 'OK')
        setState({isValid:true, 
                  message: 'Se ha agregado el producto',
                  className: 'createProduct-message' })
        handleUpdate([]);
    } catch (error) {
      console.log(error);
      setState({isValid:false, 
                message: error.response.data.message.toString(),
                className: 'createProduct-message-error' })
    }
  };

  return (
    <div className="createProduct">
      <h2 className="createProduct-titulo"> {(title)? title : 'Agregar Producto'}</h2>
      <form onSubmit={handleSubmit} className="createProduct-form">
        {(!title)&&
        <label className="createProduct-label">
          <span>ID:</span>
          <input
            type="textq"
            name="id"
            value={producto.id}
            onChange={handleChange}
          />
        </label>
        }
        <label className="createProduct-label">
          Nombre:
          <input
            type="text"
            name="nombre"
            value={producto.nombre}
            onChange={handleChange}
          />
        </label>

        <label className="createProduct-label">
          Descripción:
          <textarea
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
          />
        </label>

        <label className="createProduct-label">
          Precio:
          <input
            type="number"
            name="precio"
            value={producto.precio}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="createProduct-button" disabled={!state.isValid}>{(title)? title : 'Agregar Producto'}</button>
      </form>
      <label className={state.className}>{state.message}</label>
    </div>
  );
}
