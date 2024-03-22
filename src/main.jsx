import React from 'react';
import { BrowserRouter, createBrowserRouter , Route, Routes } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { Home } from './components/Home';
import { ManageProduct } from './components/ManageProduct';
import { CatalogoManager } from './components/CatalogoManager';
import { SideBar } from './components/SideBar';


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
);
