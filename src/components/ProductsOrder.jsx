
import PropTypes from 'prop-types';
import "../styles/productsOrder.css";

const Product = ({index, product, onHandleDelete, quantity, price}) => {
    const handleDelete = () => {
        onHandleDelete(product.product);
    };
    return(
        <li key={index}>
            <p>
                { "Nombre: " + product.product.nombre + ". Cantidad: " + quantity + (" . Precio: " + ((price) ? price : product.product.precio.toString()))}
            </p>
            <button onClick={handleDelete}>Eliminar</button>
        </li>
    );
}

export const ProductsOrder = ({ order, onDeleteProduct }) => {

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
