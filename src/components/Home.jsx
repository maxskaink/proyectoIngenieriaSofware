
import { Link } from 'react-router-dom';
import '../styles/Home.css';

export const Home = () => {
  return (
    <div className="main-menu">
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/catalago"> Manejar catologo </Link></li>
      </ul>
    </div>
  );
}
