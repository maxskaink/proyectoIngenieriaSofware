import PropTypes from "prop-types";
import { useState, useEffect } from "react";
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

export const ProductsOrder = ({ order, onDeleteProduct }) => {

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    let total = 0;
    console.log(order)
    order.products.forEach(product => {
      total += (product.price ? product.price : product.product.precio) * product.quantity;
    });
    setTotalPrice(total);
  }, [order, order.products]);

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
      </ul>
    </div>
  );
};

ProductsOrder.propTypes = {
  onDeleteProduct: PropTypes.func,
  order: PropTypes.object,
};

Product.propTypes = {
  index: PropTypes.number,
  product: PropTypes.object,
  onHandleDelete: PropTypes.func,
  quantity: PropTypes.string,
  price: PropTypes.string,
};
