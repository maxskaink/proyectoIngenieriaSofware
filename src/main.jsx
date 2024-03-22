import { BrowserRouter , Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { Home } from './components/Home';
import { CatalogoManager } from './components/CatalogoManager';
import { SideBar } from './components/SideBar';
import './styles/main.css';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <SideBar></SideBar>
      <Routes>
        <Route path="/" exact element={<Home />}/>
        <Route path="/catalogo"  element={<CatalogoManager></CatalogoManager>}/>
      </Routes>
    </BrowserRouter>
);