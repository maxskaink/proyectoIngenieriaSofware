import  { useState } from "react";
import axios from "axios";
import '../styles/createProduct.css';
import {  infoForCreateProductoValid } from '../helpers/validations'

export const CreateProduct = () => {
  const [producto, setProducto] = useState({
    id: '',
    nombre: '',
    descripcion: '',
    precio: '',
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
      response = await axios.post('http://localhost:3001/agregar-producto', producto);
      if (response.data.state === 'OK')
        setState({isValid:true, 
                  message: 'Se ha agregado el producto',
                  className: 'createProduct-message' })
    } catch (error) {
      console.log(error);
      setState({isValid:false, 
                message: error.response.data.message.toString(),
                className: 'createProduct-message-error' })
    }
  };

  return (
    <div className="createProduct">
      <h2 className="createProduct-titulo">Agregar Producto</h2>
      <form onSubmit={handleSubmit} className="createProduct-form">
        <label className="createProduct-label">
          <span>ID:</span>
          <input
            type="number"
            name="id"
            value={producto.id}
            onChange={handleChange}
          />
        </label>

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

        <button type="submit" className="createProduct-button" disabled={!state.isValid}>Agregar Producto</button>
      </form>
      <label className={state.className}>{state.message}</label>
    </div>
  );
}
