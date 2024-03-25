import { useEffect, useState } from 'react';
import { getProducts } from '../helpers/querys';
import PropTypes from 'prop-types';

export const SelectProductOrder = ({ onAddProduct }) => {
    const [products, setProducts] = useState([]);
    const [actualProduct, setActualProduct] = useState({ product: 0, quantity: 0 });
    
    const handleSelectChange = ( product) => {
        setActualProduct(prevOrder => ({ ...prevOrder, product: product.target.value }));
    };
    
    const handleQuantityChange = (event) => {
        setActualProduct(prevOrder => ({ ...prevOrder, quantity: event.target.value }));
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        onAddProduct(actualProduct);
    };    
    
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                if (response.status === 200) {
                    setProducts(response.data);
                } else {
                    console.error('Error al obtener la lista de productos');
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
            }
        };
        fetchProducts();
    },[]);
    
    return(
        <>
        <p>Se ha seleccionado el producto: { actualProduct.productId && actualProduct.productId }</p>
        <form onSubmit={handleSubmit}>
            <select onChange={handleSelectChange}>
                <option value="0">Seleccione un producto</option>
                {products.map((product) => (
                    <option key={product[0]} value={product[0]}>
                        {product[1]}
                    </option>
                ))}
            </select>
            <input type="number" placeholder="Cantidad" onChange={handleQuantityChange} defaultValue={0} />
            <button type="submit">Agregar</button>
        </form>
        </>
    )
}
SelectProductOrder.propTypes = {
    onAddProduct: PropTypes.func.isRequired,
};