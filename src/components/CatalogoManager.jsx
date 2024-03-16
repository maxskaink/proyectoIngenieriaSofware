import axios from "axios"
import { API } from "../constants/API.js"
import '../styles/catalogoManager.css'
import {  Catalogo } from './Catalogo.jsx'
import { ManageProduct } from './ManageProduct.jsx'
import { useState } from "react"

const updateProduct = async(producto) => {
    const newProduct = {...producto, activado:1}
    return await axios.put(API.actualizarProducto, newProduct)
} 

const addProduct = async(producto) => {
    return await axios.post(API.agregarProducto, producto)
};
export function CatalogoManager () {
    const [productoAtributos, setProducto] = useState([]);
    const handleSelectProduct = ( newProducto ) => {
        setProducto(newProducto)
    }
    return(
        <article className="home">
            <Catalogo productoAtributos={productoAtributos} handleSelectProduct={handleSelectProduct}></Catalogo>
            <div className="container-crud">
                <ManageProduct handleUpdate={setProducto} handleManagement={addProduct}></ManageProduct>
                {(productoAtributos.length>0) && 
                    <ManageProduct handleUpdate={setProducto}
                                   handleManagement={updateProduct} 
                                   title = "Actualizar producto"
                                   product={productoAtributos} 
                                   key={productoAtributos[0]}>
                        <button>Eliminar producto</button>
                    </ManageProduct>}
            </div>
        </article>

    )
}