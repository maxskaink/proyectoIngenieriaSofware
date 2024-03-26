
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getProductsId } from '../helpers/querys';
import "../styles/productsOrder.css";

const Product = ({index, product, onHandleDelete, quantity, price}) => {
    const handleDelete = () => {
        onHandleDelete(index);
    };
    return(
        <li 
        key={index}
        >
            <p>
                { "Nombre: " + product[1] + ". Cantidad: " + quantity + ((price) ? ". Precio: " + price : "")}
            </p>
            <button onClick={handleDelete}>Eliminar</button>
        </li>
    );
}

export const ProductsOrder = ({ productsInOrder, onDeleteProduct }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const productPromises = productsInOrder.products.map(product => getProductsId(product.product));
            // eslint-disable-next-line no-undef
            const productResponses = await Promise.all(productPromises);
            const validProducts = productResponses
                .filter(response => response.status === 200 && response.data.length > 0)
                .map(response => response.data[0]);
            setProducts(validProducts);
        };

        fetchProducts();
    }, [productsInOrder]);

    return (
        <div className="products-order">
            <h2 className="products-order-title">Products Order</h2>
            <ul className="products-list">
                {products.length > 0 ? (
                products.map((product, index) => (
                    <Product 
                    key={index}
                    product={product}
                    quantity={productsInOrder.products[index] ? productsInOrder.products[index].quantity.toString() : ""}
                    onHandleDelete={onDeleteProduct}
                    index={index}
                    price={(productsInOrder.products[index] &&  productsInOrder.products[index].price) ? productsInOrder.products[index].price.toString() : undefined}
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
    productsInOrder: PropTypes.object,
};

Product.propTypes = {
    index: PropTypes.number,
    product: PropTypes.array,
    onHandleDelete: PropTypes.func,
    quantity: PropTypes.string,
    price: PropTypes.string,
};
