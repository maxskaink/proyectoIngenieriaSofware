import "../styles/board.css";
import { Link, useLocation } from "react-router-dom";
export const SideBar = () => {
  const location = useLocation();
  return (
    <div>
      <div className="Container-Menu">
        <div className="cont-menu">
          <h1 className="titulo">Control Total</h1>
          <nav>
            <Link
              className={`containerMenu-nav-link ${location.pathname === "/" && "active"}`}
              to="/"
            >
              Home
            </Link>
            <Link
              className={`containerMenu-nav-link ${location.pathname === "/catalogo" && "active"}`}
              to="/catalogo"
            >
              Gestionar Catalogo
            </Link>
            <Link
              className={`containerMenu-nav-link ${location.pathname === "/ventas" && "active"}`}
              to="/ventas"
            >
              Crear venta
            </Link>
            <Link
              className={`containerMenu-nav-link ${location.pathname === "/compras" && "active"}`}
              to="/compras"
            >
              Crear compra
            </Link>
            <Link
              className={`containerMenu-nav-link ${location.pathname === "/informes" && "active"}`}
              to="/informes"
            >
              Informes
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};
