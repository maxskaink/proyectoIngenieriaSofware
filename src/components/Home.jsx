import { Link } from "react-router-dom"
import '../styles/home.css'
import {  Catalogo } from './Catalogo.jsx'
import { ManageProduct } from './ManageProduct.jsx'
import { useState } from "react"

const handleManagement = () => {

} 

export function Home () {
    const [state, setState] = useState([]);
    const handleSelectProduct = ( producto ) => {
        setState(producto)
    }
    return(
        <article className="home">
            <div className="home-container">
                <h1> Menu principal, seleccione alguna opcion</h1>

                <div className="home-container-buttons">
                    <Link to='/catalago' > 
                        <button className="home-container-buttons-button">Presione aqui para ir a el catalogo</button>
                    </Link>
                    <Link to='/crear-producto' > 
                        <button className="home-container-buttons-button">Presione aqui para ir a agregar producto</button>
                    </Link>
                </div>
            </div>
            <Catalogo state={state} handleSelectProduct={handleSelectProduct}></Catalogo>
            <div className="container-crud">
                <ManageProduct handleUpdate={setState}></ManageProduct>
                {(state.length>0) && 
                    <ManageProduct handleUpdate={setState}
                                   handleManagement={handleManagement} 
                                   title = "Actualizar producto"
                                   product={state} 
                                   key={state[0]}>
                    </ManageProduct>}
            </div>
        </article>

    )
}