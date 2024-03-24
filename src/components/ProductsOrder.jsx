
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { getProductsId } from '../helpers/querys';

export const ProductsOrder = ({ productsInOrder }) => {
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
            console.log(validProducts);
        };

        fetchProducts();
    }, [productsInOrder]);

    return (
        <div>
            <h2>Products Order</h2>
            <ul>
                { products.length > 0 ?(                    
                    products.map((product, index) => (
                        <li key={index}>{product[1]}</li>
                ))): <p>No products in order</p>}
            </ul>
        </div>
    );
};

ProductsOrder.propTypes = {
    productsInOrder: PropTypes.object,
};
