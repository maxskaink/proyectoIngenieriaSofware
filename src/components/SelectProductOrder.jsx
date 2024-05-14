import { useEffect, useState } from "react";
import {  getProductsBranch } from "../helpers/querys";

import { SelectLot } from "./SelectLot";

import PropTypes from "prop-types";
import "../styles/selectProduct.css";

export const SelectProductOrder = ({ onAddProduct, price, justWithStock, actualOrder, showLote }) => {
  const [products, setProducts] = useState([]);
  const [actualProduct, setActualProduct] = useState({
    product: undefined,
    quantity: null,
  });

  const handleSelectChange = (product) => {
    const selectedProduct = products.find(
      (p) => p.id.toString() === product.target.value.toString(),
    );
    setActualProduct((prevOrder) => ({
      ...prevOrder,
      product: selectedProduct,
    }));
  };

  const handleQuantityChange = (event) => {
    setActualProduct((prevOrder) => ({
      ...prevOrder,
      quantity: event.target.value,
    }));
  };
  const handlePriceChange = (event) => {
    setActualProduct((prevOrder) => ({
      ...prevOrder,
      price: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!actualProduct.product) return window.alert("Seleccione un producto");
    if (!actualProduct.quantity) return window.alert("Cantidad no válida");
    if (price && !actualProduct.price) return window.alert("Precio no válido");
    if(actualProduct.quantity <= 0) return window.alert("La cantidad debe ser mayor a 0");
    if(price && actualProduct.price <= 0) return window.alert("El precio debe ser mayor a 0");
    setProducts([]);
    setActualProduct({ ...actualProduct, product: undefined} );
    onAddProduct(actualProduct);
  };

  const handleSelectLot = (idLote) => 
    setActualProduct((prevOrder) => ({ ...prevOrder, idLote }));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductsBranch(actualOrder.idSucursal);
  
        setProducts(response.data);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    fetchProducts();
  }, [actualOrder, actualProduct, justWithStock]);

  return (
    <div className="ContendedorCompra">
      <form onSubmit={handleSubmit} className="add-product-form">
        <select className="select-product" onChange={handleSelectChange} disabled={!actualOrder.idSucursal}>
          <option value="0">Seleccione un producto</option>
          {products.map((product) => (
            ( (justWithStock)? parseInt(product.cantidad) > 0 : true)&&
            <option key={product.id} value={product.id}>
              { (product.nombre + " -  Precio Venta:" + product.precio + " - Stock:" + product.cantidad)}
            </option>
          ))}
        </select>

        <input
          className="quantity-input"
          type="number"
          placeholder="Cantidad"
          onChange={handleQuantityChange}
          disabled={!actualOrder.idSucursal}
        />

        {price && (
          <input
            className="price-input"
            type="number"
            placeholder="Precio Unitario"
            onChange={handlePriceChange}
            disabled={!actualOrder.idSucursal}
          />
        )}

        {showLote && (

          <SelectLot handleSelectLot={handleSelectLot} disabled={!actualOrder.idSucursal}/>
        )}

        <button className="add-button" type="submit">
          Agregar
        </button>
      </form>
    </div>
  );
};
SelectProductOrder.propTypes = {
  onAddProduct: PropTypes.func.isRequired,
  price: PropTypes.bool,
  justWithStock: PropTypes.bool,
  actualOrder: PropTypes.object,
  showLote: PropTypes.bool
};
