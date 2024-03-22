import axios from "axios"
import { API } from "../constants/API.js"
import '../styles/catalogoManager.css'
import {  Catalogo } from './Catalogo.jsx'
import { ManageProduct } from './ManageProduct.jsx'
import { useState } from "react"

/* Funcion que nos permite resibir el producto que se quiere actualizar com objeto para luego utilizar la api */
const updateProduct = async(producto) => {
    if(!window.confirm("¿Estas seguro que deseas actualizar el producto?")) return;
    const newProduct = {...producto, activado:1}
    return await axios.put(API.actualizarProducto, newProduct)
} 
/* Nos permite resibir el producto como objeto para enviarlo a la api y agregarlo */
const addProduct = async(producto) => {
    return await axios.post(API.agregarProducto, producto)
};

/* Nos permite resibir el producto seleccionado para hace su acutalizacion clocando el activado en ce ro */
const deleateProduct = async(producto) => {
    if (!window.confirm("¿Estas seguro que deseas eliminar el producto?")) return;
    const newProduct = {
        id: producto[0], 
        nombre: producto[1], 
        descripcion: producto[2], 
        precio: producto[3], 
        activado:0 
    }


    const productoCompleto  = await axios.get(API.consultarProductoId, { params: { id: newProduct.id } }).then(res => res.data[0]); 
    if(productoCompleto[5] > 0){
        alert("No se puede eliminar un producto con stock")
        return
    }
    return await axios.put(API.actualizarProducto, newProduct)
}

/* Componente donde podreamos ver, agregar, modificar y eliminar los productos del catalogo */
export function CatalogoManager () {
    /* el productoAtributos tiene la informacion del producto que se halla seleccionado en esta seccion, ademas de darnos la funcin para actualizarlo */
    const [productoAtributos, setProducto] = useState([]);
    /* Definimos que hacer cuando se selecciona un producto */
    const handleSelectProduct = ( newProducto ) => {
        setProducto(newProducto)
    }
    /* Definimos la accion cuando presiona el boton para elimnar el producto */
    const handleDeleteProduct  = async() => {
        await deleateProduct(productoAtributos);
        setProducto([])
    }
    return( 
    <>
        <article className="home">
            <Catalogo productoAtributos={productoAtributos} handleSelectProduct={handleSelectProduct}></Catalogo>
            <div className="container-crud">
                <ManageProduct 
                    handleUpdate={setProducto} 
                    handleManagement={addProduct}
                    title="Agregar producto"
                    />
                {(productoAtributos.length>0) && 
                    <ManageProduct 
                        handleUpdate={setProducto}
                        handleManagement={updateProduct} 
                        title = "Actualizar producto"
                        product={productoAtributos} 
                        key={productoAtributos[0]}>
                    <button className="button" onClick={handleDeleteProduct}>Eliminar producto</button>
                    </ManageProduct>}
            </div>
        </article>
    </>

    )
}