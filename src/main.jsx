import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom";
import { Home } from "./components/Home";
import { ManageProduct } from "./components/ManageProduct";
import { Catalogo } from "./components/Catalogo";

const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
    errorElement: <h1>404 Not found</h1>,
  },
  {
    path: "crear-producto",
    Component: ManageProduct,
  },
  {
    path: "/catalago",
    Component: Catalogo,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
