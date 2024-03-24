import { SelectProductOrder } from "./SelectProductOrder";
import { ProductsOrder } from "./ProductsOrder";
import { useState } from "react";

export const SaleManager = () => {

    const [order, setOrder] = useState({ products: [], medioPago:""});

    const addProduct = (product) => {
        if(product.product === 0 || product.quantity === 0) 
            return window.alert('Producto o cantidad no válidos');
        setOrder((prevOrder) => ({ ...prevOrder, products: [...prevOrder.products, product] }));
    }
     return (
        <div>

            <SelectProductOrder 
                onAddProduct={addProduct}
            />
            
            <ProductsOrder 
                productsInOrder={order}
            />

            <div>
                {/* Contenedor para la información adicional */}
            </div>
        </div>
    );
};
