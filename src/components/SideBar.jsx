import { Link } from "react-router-dom"
import '../styles/board.css'
export const SideBar =() =>{
    return(
        <div>
            <div className="Container-Menu">
                <div className = "cont-menu">
                <h1 className="titulo"> Control Total</h1>
                    <nav>
                        <Link className='containerMenu-nav-link' to="/">Home</Link>
                        <Link className="containerMenu-nav-link" to="/catalogo" >Gestionar Catalogo</Link>
                        <Link className="containerMenu-nav-link" to="/ventas" >Crear venta</Link>
                    </nav>
                </div>
            </div>
        </div>
  );
}