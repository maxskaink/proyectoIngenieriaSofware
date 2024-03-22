<<<<<<< HEAD
import React from 'react';
import { BrowserRouter, createBrowserRouter , Route, Routes } from 'react-router-dom';
=======
import { BrowserRouter, Route, Routes } from 'react-router-dom';
>>>>>>> 3b09b60b93e118cb628ddc89edd0e0a3fa6ad53c
import ReactDOM from 'react-dom';
import { Home } from './components/Home';
import { CatalogoManager } from './components/CatalogoManager';
import { SideBar } from './components/SideBar';


<<<<<<< HEAD
const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    errorElement: <h1>404 Not found</h1>,
  },
  {
    path: '/crear-producto',
    Component: ManageProduct
  },
  {
    path: '/cataloWgo',
    Component: CatalogoManager
  }
]);


ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <SideBar></SideBar>
      <Routes>
        <Route path="/" exact element={<Home />}/>
        <Route path="/catalogo"  element={<CatalogoManager></CatalogoManager>}/>
      </Routes>
    </BrowserRouter>
=======

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      {/* Aqui deberia de ir el componente del sidebar para que este en todas las paginas, 
        recomiendo tener muy en cuenta como es la estructura del html para poder cuadrar bien las cosas 7u7
      */}
      <Home /> {/* Provicionalmente dejo el home aqui para que funcione como el sidebar pero se deberia de quitar */}
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/catalogo" element={<CatalogoManager />} />
    </Routes>
  </BrowserRouter>
>>>>>>> 3b09b60b93e118cb628ddc89edd0e0a3fa6ad53c
);
