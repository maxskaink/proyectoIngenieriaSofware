import { SelectProductOrder } from "./SelectProductOrder";
import { ProductsOrder } from "./ProductsOrder";
import { getProductsId } from "../helpers/querys";
import { useState } from "react";

export const SaleManager = () => {

    const [order, setOrder] = useState({ products: [], medioPago:""});

    const addProduct = (product) => {
        /* Falta validar:
            - que halla la cantidades del producto en stock
        */
        if(product.product === 0 || product.quantity === 0) 
            return window.alert('Producto o cantidad no válidos');
        /* Validar que no exista ya el producto,, y si existe suma las cantidades */
        const productIndex = order.products.findIndex(p => p.product === product.product);
        if (productIndex !== -1) {
            const updatedProducts = [...order.products];
            // Hacer una copia del producto antes de modificarlo
            const updatedProduct = { ...updatedProducts[productIndex] };
            updatedProduct.quantity = Number(product.quantity) + Number(updatedProduct.quantity);
            updatedProducts[productIndex] = updatedProduct;
            setOrder(prevOrder => ({ ...prevOrder, products: updatedProducts }));
            return;
        } 
        setOrder((prevOrder) => ({ ...prevOrder, products: [...prevOrder.products, product] }));
    }

    const deleteProduct = async(productIndex) => {
        const getProductInfo = async (productId) => {
            try {
                const product = await getProductsId(productId);
                return product.data[0][1];
            } catch (error) {
                console.error(error);
                return "";
            }
        };

        const productName = await getProductInfo(order.products[productIndex].product);

        const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar el producto ${productName}?`);

        if (confirmDelete) {
            const updatedProducts = [...order.products];
            updatedProducts.splice(productIndex, 1);
            setOrder((prevOrder) => ({ ...prevOrder, products: updatedProducts }));
        }
    }
    const handleMedioPagoChange = (event) => {
        setOrder((prevOrder) => ({ ...prevOrder, medioPago: event.target.value }));
    }

    const handleSubmit = () => {
        if (order.products.length === 0) {
            window.alert('Debe seleccionar al menos un producto');
            return;
        }
        if(order.medioPago === "") {
            window.alert('Debe seleccionar un medio de pago');
            return;
        }
        console.log(order);
        // Aquí puedes realizar las acciones necesarias al enviar el formulario
    }

    return (
        <div>
            <h1>ventas</h1>
            <SelectProductOrder 
                onAddProduct={addProduct}
            />
            
            <ProductsOrder 
                productsInOrder={order}
                onDeleteProduct={deleteProduct}
            />

            <div>
                <form>
                    <label>
                        Medio de Pago:
                        <select value={order.medioPago} onChange={handleMedioPagoChange}>
                            <option value="">Seleccione un medio de pago</option>
                            <option value="tarjeta">Tarjeta</option>
                            <option value="efectivo">Efectivo</option>
                            <option value="transferencia">Transferencia</option>
                        </select>
                    </label>
                    <button type="button" onClick={handleSubmit}>Enviar</button>
                </form>
            </div>
        </div>
    );
};
