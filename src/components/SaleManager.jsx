import { SelectProductOrder } from "./SelectProductOrder";
import { ProductsOrder } from "./ProductsOrder";
import { createSale } from "../helpers/querys";
import { useState } from "react";
import "../styles/salManager.css";
export const SaleManager = () => {
  const [order, setOrder] = useState({ products: [], medioPago: "" });

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
  const handleMedioPagoChange = (event) => {
    setOrder((prevOrder) => ({ ...prevOrder, medioPago: event.target.value }));
  };

  const handleSubmit = async () => {
    if (order.products.length === 0) {
      window.alert("Debe seleccionar al menos un producto");
      return;
    }
    if (order.medioPago === "") {
      window.alert("Debe seleccionar un medio de pago");
      return;
    }

    try {
      const response = await createSale(order);

      if (response.data.state === "OK") {
        window.alert("Venta realizada con éxito");
        //window.location.reload();
      } else window.alert("Error al realizar la venta");

      setOrder({ products: [], medioPago: "" });
    } catch (error) {
      console.error(error);
      window.alert("Error al realizar la venta");
    }
  };

  return (
    <div className="boardSalManager"> 
      <div className="contenedorSalManager">
        
        <h1 className="tituloVentas">Ventas</h1>
        <div className="contenido">
          <SelectProductOrder 
            onAddProduct={addProduct}
            justWithStock
          />

       

          <div className="contendorMedioPago">
            <form>
              <label >
                <p>Medio de Pago:</p>
                <select className="cmbxOption" value={order.medioPago} onChange={handleMedioPagoChange}>
                  <option value="">Seleccione un medio de pago</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </label>
              <button className= "bttEnviar" type="button" onClick={handleSubmit}>
                <p>Enviar</p>
              </button>
            </form>
          </div>
          <ProductsOrder order={order} onDeleteProduct={deleteProduct} />
        </div>
      </div>
    </div>
  );
};
