import { SelectProductOrder } from "./SelectProductOrder";
import { ProductsOrder } from "./ProductsOrder";
import { getActualMoney, getProductsId, createBuy } from "../helpers/querys";
import { useState } from "react";
import "../styles/buyManager.css";

export const BuyManager = () => {

    const [order, setOrder] = useState({ 
        products: [],
        providerName: "",
        contact: "",
        address: ""
    });

    const addProduct = async(product) => {
        /* Falta validar:
            - que halla la cantidad de dinero para comprar
        */

        if(product.product === 0) 
            return window.alert('Seleccione un producto');
        if( product.quantity === 0)
            return window.alert('Cantidad no válida');
        if( product.price === 0)
            return window.alert('Precio no válido');
        
        const dineroActual = await getActualMoney().then(res => res.data)
        
        let totalPrice = order.products.reduce((total, product) => total + (product.price * product.quantity), 0);
        totalPrice += product.price * product.quantity;

        if (totalPrice > dineroActual) 
            return window.alert('No hay dinero suficiente para comprar este producto');
        
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

    const handleSubmit = async() => {
        if (order.products.length === 0) 
            return window.alert('Debe seleccionar al menos un producto');
        
        if(order.providerName.length === 0) 
            return window.alert('Ingrese el nombre del proveedor');
        
        if(order.contact.length === 0)
            return window.alert('Ingrese el contacto del proveedor');
        if(order.address.length === 0)
            return window.alert('Ingrese la dirección del proveedor');
        
        try {
            const response = await createBuy(order);
            if (response.status === 200) {
                window.alert('Compra realizada exitosamente');
                setOrder({ products: [], providerName: "", contact: "", address: "" });
            } else {
                window.alert('Error al realizar la compra');
            }
        } catch (error) {
            console.error(error);
            window.alert('Error al realizar la compra');
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrder(prevOrder => ({ ...prevOrder, [name]: value }));
    }

    return (
        <div className="boardManageBuy">
            <div className="manageBuy">
                <h1 className="compras-titulo">Compras </h1>
                <SelectProductOrder 
                    onAddProduct={addProduct}
                    price
                />
                
                <ProductsOrder 
                    productsInOrder={order}
                    onDeleteProduct={deleteProduct}
                />

                <div>
                    <form>
                        <input type="text" name="providerName" placeholder="Nombre del proveedor" onChange={handleInputChange} />
                        <input type="text" name="contact" placeholder="Contacto" onChange={handleInputChange} />
                        <input type="text" name="address" placeholder="Dirección" onChange={handleInputChange} />
                        <button className="buttonA" type="button" onClick={handleSubmit}>Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
