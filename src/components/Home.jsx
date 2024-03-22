import { Catalogo } from './Catalogo';
import '../styles/home.css';

/* Es el componente principal que debe tener acceso al resto de funciones en la aplicacion */
export const Home = () => {
  return (
    <div>
      <Catalogo></Catalogo>
      <p>Este es el home</p>
    </div>
    );
}
