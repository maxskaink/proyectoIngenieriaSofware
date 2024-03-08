import { Link } from "react-router-dom"
import '../styles/home.css'

export function Home () {
    return(
        <article className="home">
            <div className="home-container">
                <h1> Menu principal, seleccione alguna opcion</h1>

                <div className="home-container-buttons">
                    <Link to='/catalago' > 
                        <button className="home-container-buttons-button">Presione aqui para ir a el cataloogo</button>
                    </Link>
                    <Link to='/crear-producto' > 
                        <button className="home-container-buttons-button">Presione aqui para ir a agregar prodcuto</button>
                    </Link>
                </div>
            </div>
        </article>

    )
}