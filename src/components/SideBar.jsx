import "../styles/board.css";
import { Link, useLocation } from "react-router-dom";
export const SideBar = () => {
  const location = useLocation();
  return (
    <div>
      <div className="Container-Menu">
        <div className="sidebar">
          <h1 className="titulo">Control Total</h1>
          <nav>            
            <Link
              className={`containerMenu-nav-link ${location.pathname === "/catalogo" && "active"}`}
              to="/catalogo"
            >
              <i className="fa-regular fa-clipboard"></i>
              <p>Gestionar Catalogo</p>
            </Link>
            <Link
              className={`containerMenu-nav-link ${location.pathname === "/gestionar-Sucursales" && "active"}`}
              to="/gestionar-Sucursales"
            >
              <i className="fa-regular fa-clipboard"></i>
              <p>Gestionar Sucursales</p>
            </Link>
            <Link
              className={`containerMenu-nav-link ${location.pathname === "/gestionar-proveedor" && "active"}`}
              to="/gestionar-proveedor"
            >
              Gestionar Proveedor
            </Link>
            <Link
              className={`containerMenu-nav-link ${location.pathname === "/gestionar-clientes" && "active"}`}
              to="/gestionar-clientes"
            >
              Gestionar Clientes
            </Link>
            <Link
              className={`containerMenu-nav-link ${location.pathname === "/ventas" && "active"}`}
              to="/ventas"
            >
              <i className="fa-solid fa-cash-register"></i>
              <p>Crear venta</p>
              
            </Link>
            <Link
              className={`containerMenu-nav-link ${location.pathname === "/compras" && "active"}`}
              to="/compras"
            >
              <i className="fa-solid fa-cart-shopping"></i>
              <p>Crear compra</p>
            </Link>
            <Link
              className={`containerMenu-nav-link ${location.pathname === "/informes" && "active"}`}
              to="/informes"
            >
              <i className="fa-solid fa-circle-info"></i>
              <p>Informes</p>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};
