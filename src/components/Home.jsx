
import { Link } from 'react-router-dom';


export const Home = () => {
  return (
    <div className="main-menu">
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/catalago"> Manejar catálogo </Link></li>
      </ul>
    </div>
  );
}
