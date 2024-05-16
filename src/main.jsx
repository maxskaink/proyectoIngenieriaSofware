import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Home } from "./components/Home";
import { CatalogoManager } from "./components/CatalogoManager";
import { SideBar } from "./components/SideBar";
import { SaleManager } from "./components/SaleManager";
import { BuyManager } from "./components/BuyManager";
import { BusinessReport  } from "./components/BusinessReport ";
import { AddMoney } from "./components/AddMoney";
import { ProviderManager } from "./components/ProviderManager"; 
import { ClientManager } from "./components/ClientManager";
import { SucursalManager } from "./components/SucursalManager"; // [1
import { AddLot } from "./components/AddLot";
import "./styles/main.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SideBar></SideBar>
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/catalogo" element={<CatalogoManager></CatalogoManager>} />
      <Route path="/ventas" element={<SaleManager />} />
      <Route path="/compras" element={<BuyManager />} />
      <Route path="/informes" element={<BusinessReport />} />
      <Route path="/agregar-dinero" element={<AddMoney />} />
      <Route path="/gestionar-proveedor" element={<ProviderManager />} />
      <Route path="/gestionar-clientes" element={<ClientManager />} />
      <Route path="/gestionar-Sucursales" element={<SucursalManager />} />
      <Route path="/agregar-lote" element={<AddLot />} />
    </Routes>
  </BrowserRouter>,
);
