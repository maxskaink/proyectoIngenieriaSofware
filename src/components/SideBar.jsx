import { Link } from "react-router-dom"
import '../styles/board.css'
export const SideBar =() =>{
    return(
        <div>
            <div className="Container-Menu">
                <div className = "cont-menu">
                <h1 className="titulo"> Control Total</h1>
                    <nav>
                        <a><Link to="/">Home</Link></a>
                        <a><Link to="/catalogo" >Catalogo</Link></a>
                        <a><Link to="/catalogo" >Gestionar Catalogo</Link></a>
                    </nav>
                </div>
            </div>
        </div>
  );
}