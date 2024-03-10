import { Link } from "react-router-dom"
import axios from "axios"
import { API } from "../constants/API.js"
import '../styles/home.css'
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
export function Home () {
    const [productoAtributos, setProducto] = useState([]);
    const handleSelectProduct = ( newProducto ) => {
        setProducto(newProducto)
    }
    return(
        <article className="home">
{/*             <div className="home-container">
                <h1> Menu principal, seleccione alguna opcion</h1>

                <div className="home-container-buttons">
                    <Link to='/catalago' > 
                        <button className="home-container-buttons-button">Presione aqui para ir a el catalogo</button>
                    </Link>
                    <Link to='/crear-producto' > 
                        <button className="home-container-buttons-button">Presione aqui para ir a agregar producto</button>
                    </Link>
                </div>
            </div> */}
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