import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Home } from './components/Home';
import { CatalogoManager } from './components/CatalogoManager';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      {/* Aqui deberia de ir el componente del sidebar para que este en todas las paginas, 
        recomiendo tener muy en cuenta como es la estructura del html para poder cuadrar bien las cosas 7u7
      */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<CatalogoManager />} />
    </Routes>
  </BrowserRouter>
);
