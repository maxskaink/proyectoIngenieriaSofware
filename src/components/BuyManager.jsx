import { SelectProductOrder } from "./SelectProductOrder";
import { ProductsOrder } from "./ProductsOrder";
import { getActualMoney, createBuy } from "../helpers/querys";
import "../styles/buyManager.css";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const BuyManager = () => {
/*   const [order, setOrder] = useState({
    products: [],
    providerName: "",
    contact: "",
    address: "",
  });
 */
  const [order, setOrder] = useLocalStorage("orderBuy", {
    products: [],
    providerName: "",
    contact: "",
    address: "",
  })

  const addProduct = async (newItem) => {
    if (newItem.product.id === 0) return window.alert("Seleccione un producto");
    if (newItem.quantity === 0) return window.alert("Cantidad no válida");
    if (newItem.price === 0) return window.alert("Precio no válido");

    const dineroActual = await getActualMoney().then((res) => res.data);

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
      (p) => p.product === newItem.product,
    );
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

    if (order.providerName.length === 0)
      return window.alert("Ingrese el nombre del proveedor");

    if (order.contact.length === 0)
      return window.alert("Ingrese el contacto del proveedor");
    if (order.address.length === 0)
      return window.alert("Ingrese la dirección del proveedor");

    try {
      await createBuy(order);

      window.alert("Compra realizada exitosamente");
      setOrder({ products: [], providerName: "", contact: "", address: "" });
      //window.location.reload();
    } catch (error) {
      console.error(error);
      window.alert("Error al realizar la compra");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(order)
    setOrder({ ...order, [name]: value });
  };

  return (
    <div className="boardManageBuy">
      <div className="manageBuy">
        <div className="Columna-1">
          <ProductsOrder order={order} onDeleteProduct={deleteProduct} showActualMoney />
        </div>
        <div className="Columna-2">
          <h1 className="compras-titulo">Compras </h1>
          <SelectProductOrder onAddProduct={addProduct} price actualOrder = {order} />

          <div >
            <form className="contendorProveedor">
              <input
                type="text"
                name="providerName"
                value={order.providerName.length === 0 ? "" : order.providerName}
                placeholder="Nombre del proveedor"
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="contact"
                placeholder="Contacto"
                value={order.contact.length === 0 ? "" : order.contact}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="address"
                value={order.address.length === 0 ? "" : order.address}
                placeholder="Dirección"
                onChange={handleInputChange}
              />
              <button className="buttonA" type="button" onClick={handleSubmit}>
                Enviar
              </button>
            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
};
