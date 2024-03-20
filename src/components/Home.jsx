
import { Link } from 'react-router-dom';
import '../styles/home.css';

/* Es el componente principal que debe tener acceso al resto de funciones en la aplicacion */
export const Home = () => {
  return (
    <div className="main-menu">
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/catalogo"> Manejar catologo </Link></li>
      </ul>
    </div>
  );
}
