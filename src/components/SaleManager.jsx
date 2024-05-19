import { SelectProductOrder } from "./SelectProductOrder";
import { SelectSucursal } from "./SelectSucursal";
//import { SelectWorker } from "./SelectWorker";
import { SelectClient} from "./SelectClient";
import { ProductsOrder } from "./ProductsOrder";
import { SelectWorker } from "./SelectWorker";
import { createSale } from "../helpers/querys";
import { useState } from "react";
import { Trabajador } from "../class/trabajador";
import "../styles/salManager.css";


const defaultWorker = new Trabajador(['', '', '', '', '', '']);
export const SaleManager = () => {
  const [order, setOrder] = useState({
    products: [],
    idSucursal: undefined,
    cedulaTrabajador : undefined,
    estado: "Entregado"
  });

  const addProduct = async (newItem) => {

    if (newItem.product === undefined || newItem.quantity === 0)
      return window.alert("Producto o cantidad no válidos");

    if (newItem.product.cantidadStock < newItem.quantity)
      return window.alert("No hay suficiente stock para este producto");

    /* Validar que no exista ya el producto,, y si existe suma las cantidades */
    const productIndex = order.products.findIndex((p) => p.product.id === newItem.product.id);
    if (productIndex !== -1) {
      const updatedProducts = [...order.products];
      // Hacer una copia del producto antes de modificarlo
      const updatedProduct = { ...updatedProducts[productIndex] };
      updatedProduct.quantity =
        Number(newItem.quantity) + Number(updatedProduct.quantity);
      updatedProducts[productIndex] = updatedProduct;
      if (newItem.product.cantidadStock < updatedProduct.quantity)
        return window.alert("No hay suficiente stock para este producto");
      setOrder((prevOrder) => ({ ...prevOrder, products: updatedProducts }));
      return;
    }
    setOrder((prevOrder) => ({
      ...prevOrder,
      products: [...prevOrder.products, newItem],
    }));
  };

  const deleteProduct = async (product) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro de que quieres eliminar el producto ${product.nombre}?`,
    );

    if (confirmDelete) {
      const productIndex = order.products.findIndex((p) => p.id === product.id);
      const updatedProducts = [...order.products];
      updatedProducts.splice(productIndex, 1);
      setOrder((prevOrder) => ({ ...prevOrder, products: updatedProducts }));
    }
  };

  const handleSubmit = async () => {
    if (order.products.length === 0) {
      window.alert("Debe seleccionar al menos un producto");
      return;
    }
    if(order.idSucursal === undefined || order.idSucursal.length === 0)
      return window.alert("Debe seleccionar una sucursal");
    if(order.cedulaCliente === undefined || order.cedulaCliente.length === 0)
      return window.alert("Debe seleccionar un cliente");
    if(order.cedulaTrabajador === undefined || order.cedulaTrabajador.length === 0)
      return window.alert("Debe seleccionar un trabajador");
    try {
      console.log(order);
      const response = await createSale(order);

      if (response.data.state === "OK") {
        window.alert("Venta realizada con éxito");
        //window.location.reload();
      } else window.alert("Error al realizar la venta");

      setOrder({
        products: [],
        idSucursal: undefined,
        cedulaTrabajador : undefined,
        estado: "Entregado"
      });
    } catch (error) {
      console.error(error);
      window.alert("Error al realizar la venta");
    }
  };

  const handleSelectSucursal = (idSucursal) => {
    setOrder((prevOrder) => ({ ...prevOrder, idSucursal }));
  }
  const handleSelectClient = (cedulaCliente) => {
    setOrder((prevOrder) => ({ ...prevOrder, cedulaCliente }));
  }
  const handleSelectWorker = (cedulaTrabajador) => {
    setOrder((prevOrder) => ({ ...prevOrder, cedulaTrabajador }));
  }
  const filterWorker = (worker=defaultWorker) => worker.idSucursal?.toString() === order.idSucursal?.toString();
  return (
    <div className="boardSalManager"> 
      <div className="contenedorSalManager">
        <div className="contenido">

        <ProductsOrder order={order} onDeleteProduct={deleteProduct} />
        
        <div className="contendorMedioPago">
        <SelectProductOrder onAddProduct={addProduct} actualOrder={order} justWithStock/>
            <form>
              <SelectSucursal handleSelectedSucursal={handleSelectSucursal} />
              <SelectClient handleSelectedClient={handleSelectClient} />
              <SelectWorker handleSelectWorker={handleSelectWorker} filterWorker={filterWorker}/>
              <button className= "bttEnviar" type="button" onClick={handleSubmit}>
                <p>Enviar</p>
              </button>
            </form>
           
          </div>
    
        </div>
      </div>
    </div>
  );
};
