import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { getActualMoney } from "../helpers/querys";
import "../styles/productsOrder.css";

const Product = ({ index, product, onHandleDelete, quantity, price }) => {
  const handleDelete = () => {
    onHandleDelete(product.product);
  };
  return (
    <li key={index}>
      <p>
        {"Nombre: " +
          product.product.nombre +
          ". Cantidad: " +
          quantity +
          (" . Precio Unitario: " + (price ? price : product.product.precio.toString()))}
      </p>
      <button onClick={handleDelete}>Eliminar</button>
    </li>
  );
};

export const ProductsOrder = ({ order, onDeleteProduct, showActualMoney }) => {

  const [totalPrice, setTotalPrice] = useState(0);
  const [actualMoney, setActualMoney] = useState(0);

  useEffect(() => {
    const loadProducsOrder = async () => {
      let total = 0;
      order.products.forEach(product => {
        total += (product.price ? product.price : product.product.precio) * product.quantity;
      });
      setTotalPrice(total);
      if(showActualMoney){
        getActualMoney().then((res) => setActualMoney(res.data));
      }
    };
    loadProducsOrder();
  }, [order, order.products, showActualMoney]);

  return (
    <div className="products-order">
      <h2 className="products-order-title">Products Order</h2>
      <ul className="products-list">
        {order.products.length > 0 ? (
          order.products.map((product, index) => (
            <Product
              key={index}
              product={product}
              quantity={product.quantity.toString()}
              onHandleDelete={onDeleteProduct}
              index={index}
              price={product.price && product.price.toString()}
            />
          ))
        ) : (
          <p>No products in order</p>
        )}
        <p>Total: {totalPrice}</p>
        {showActualMoney && <p>Dinero actual en caja: {actualMoney}</p>}
      </ul>
    </div>
  );
};

ProductsOrder.propTypes = {
  onDeleteProduct: PropTypes.func,
  order: PropTypes.object,
  showActualMoney: PropTypes.bool,
};

Product.propTypes = {
  index: PropTypes.number,
  product: PropTypes.object,
  onHandleDelete: PropTypes.func,
  quantity: PropTypes.string,
  price: PropTypes.string,
};
