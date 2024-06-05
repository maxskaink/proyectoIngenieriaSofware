import { useEffect, useState } from "react";
import { getProducts } from "../helpers/querys";
import PropTypes from "prop-types";
import "../styles/selectProduct.css";

export const SelectProductOrder = ({ onAddProduct, price, justWithStock, actualOrder }) => {
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    fetchProducts();
  }, [actualOrder, actualProduct]);

  return (
    <div className="ContendedorCompra">
      <form onSubmit={handleSubmit} className="add-product-form">
        <select className="select-product" onChange={handleSelectChange}>
          <option value="0">Seleccione un producto</option>
          {products.map((product) => (
            ( (justWithStock)? parseInt(product.cantidadStock) > 0 : true)&&
            <option key={product.id} value={product.id}>
              { (product.nombre + " -  Precio Venta:" + product.precio + " - Stock:" + product.cantidadStock)}
            </option>
          ))}
        </select>

        <input
          className="quantity-input"
          type="number"
          placeholder="Cantidad"
          onChange={handleQuantityChange}
        />

        {price && (
          <input
            className="price-input"
            type="number"
            placeholder="Precio Unitario"
            onChange={handlePriceChange}
          />
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
  actualOrder: PropTypes.object
};
