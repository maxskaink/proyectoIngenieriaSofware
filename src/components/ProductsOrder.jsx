import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { getActualMoney } from "../helpers/querys";
import "../styles/productsOrder.css";

const Product = ({ index, product, onHandleDelete, quantity, price }) => {
  const handleDelete = () => {
    onHandleDelete(product.product);
  };

  return (
    <div className  = "contenedor-Product" key={index}>
        <div className="product-compra">{ product.product.nombre}</div>  {/* Este div contiene el nombre del producto */}
        <div className="product-compra">{ quantity}</div>  {/* Este div contiene La cantidad del producto */}
        <div className="product-compra" >{(price ? price : product.product.precio.toString())}</div> {/* Este div contiene el precio unitario del producto */}
        <div className="button-compra"><button onClick={handleDelete}>-</button ></div>
    </div>
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
       <div className="cabecera">
        <div className="contenedor-Product">
          <div className="columnaHeader-Product">
            {" "}
            <strong> Nombre:</strong>{" "}
          </div>
          <div className="columnaHeader-Product">
            <strong>Cantidad </strong>
          </div>
          <div className="columnaHeader-Product">
            <strong> Precio Unitario </strong>
          </div>
        </div>
      </div>


      <div className="section-prodcunts">
          {order.products.length > 0 ? (
            order.products.map((product, index) => (
              <Product
                key={index}
                index={index}
                product={product}
                quantity={product.quantity.toString()}
                onHandleDelete={onDeleteProduct}
                price={product.price && product.price.toString()}
              />
            ))
          ) : (
            <p className="aviso-noProductos">No products in order</p>
          )}
      </div>


      <div className="dinero">
        <p>Total: {totalPrice}</p>
          -----------------------------------------------------------------------------------------------------------
        {showActualMoney && <p>Dinero actual en caja: {actualMoney}</p>}
      </div>
              
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
