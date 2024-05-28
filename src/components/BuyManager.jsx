import { SelectProductOrder } from "./SelectProductOrder";
import { ProductsOrder } from "./ProductsOrder";
import { SelectProvider } from "./SelectProvider";
import { SelectSucursal } from "./SelectSucursal";
import {  createBuy, getMoneyBranch } from "../helpers/querys";
import { useState } from "react";
import "../styles/buyManager.css";

export const BuyManager = () => {
  const [order, setOrder] = useState({
    products: [],
    nitProveedor: undefined,
    idSucursal: undefined
  });

  const addProduct = async (newItem) => {
    if (newItem.product.id === 0) return window.alert("Seleccione un producto");
    if (newItem.quantity === 0) return window.alert("Cantidad no válida");
    if (newItem.price === 0) return window.alert("Precio no válido");

    const dineroActual = await getMoneyBranch(order.idSucursal).then((res) => res.data);

    let totalPrice = order.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0,
    );
    totalPrice += newItem.price * newItem.quantity;

    if (totalPrice > dineroActual)
      return window.alert(
        "No hay dinero suficiente para comprar este producto",
      );

    /* Validar que no exista ya el producto,, y si existe suma las cantidades */
    const productIndex = order.products.findIndex(
      (p) => p.product.id === newItem.product.id,
    );
    console.log(newItem, order.products);
    if (productIndex !== -1) {
      const updatedProducts = [...order.products];
      // Hacer una copia del producto antes de modificarlo
      const updatedProduct = { ...updatedProducts[productIndex] };
      updatedProduct.quantity =
        Number(newItem.quantity) + Number(updatedProduct.quantity);
      updatedProducts[productIndex] = updatedProduct;
      setOrder((prevOrder) => ({ ...prevOrder, products: updatedProducts }));
      return;
    }
    setOrder((prevOrder) => ({
      ...prevOrder,
      products: [...prevOrder.products, newItem],
    }));
  };

  const deleteProduct = async (product) => {
    const productIndex = order.products.findIndex(
      (p) => p.product.id === product.id,
    );

    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar el producto ${product.nombre}?`,
    );

    if (confirmDelete) {
      const updatedProducts = [...order.products];
      updatedProducts.splice(productIndex, 1);
      setOrder((prevOrder) => ({ ...prevOrder, products: updatedProducts }));
    }
  };

  const handleSubmit = async () => {
    if (order.products.length === 0)
      return window.alert("Debe seleccionar al menos un producto");
    if (!order.nitProveedor) return window.alert("Debe seleccionar un proveedor");
    try {
      console.log(order);
      await createBuy(order);

      window.alert("Compra realizada exitosamente");
      window.location.reload();
      //window.location.reload();
    } catch (error) {
      console.error(error);
      window.alert("Error al realizar la compra");
    }
  };

  const handelSelectProvider = (nitProveedor) => {
    setOrder((prevOrder) => ({ ...prevOrder, nitProveedor }));
  }

  const handleSelectSucursal = (idSucursal) => {
    setOrder((prevOrder) => ({ ...prevOrder, idSucursal }));
  }

  return (
    <div className="boardManageBuy">
      <div className="manageBuy">
        <div className="Columna-1">
          
          <ProductsOrder order={order} onDeleteProduct={deleteProduct} showActualMoney />
        </div>
        <div className="Columna-2">
          <h1 className="compras-titulo">Compras </h1>
          <SelectProvider handleSelectedProvider={handelSelectProvider}/>
          <SelectSucursal handleSelectedSucursal={handleSelectSucursal} />
          <SelectProductOrder onAddProduct={addProduct} price actualOrder = {order} showLote/>

          <div >
            <form className="contendorProveedor">

 
              <button className="bttEnviar" type="button" onClick={handleSubmit}>
                Enviar
              </button>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
};
