import axios from "axios";
import { API } from "../constants/API";
import { Product } from "../class/product";

const defaultProduct = new Product(["", "", "", "", "", ""]);

/* Funcion que nos permite resibir el producto que se quiere actualizar com objeto para luego utilizar la api */
export const updateProduct = async (producto) => {
  if (!window.confirm("¿Estas seguro que deseas actualizar el producto?"))
    return;
  const newProduct = { ...producto, activado: 1 };
  return await axios.put(API.actualizarProducto, newProduct);
};
/* Nos permite resibir el producto como objeto para enviarlo a la api y agregarlo */
export const addProduct = async (producto) => {
  return await axios.post(API.agregarProducto, producto);
};

/* Nos permite resibir el producto seleccionado para hace su acutalizacion clocando el activado en ce ro */
export const deleteProduct = async (producto = defaultProduct) => {
  if (!window.confirm("¿Estas seguro que deseas eliminar el producto?")) return;

  const newProduct = { ...producto, activado: 0 };
  if (newProduct.cantidadStock > 0) {
    alert("No se puede eliminar un producto con stock");
    return;
  }

  return await axios.put(API.actualizarProducto, newProduct);
};

export const getProducts = async () => {
  return await axios.get(API.consultarProductos).then((res) => res);
};

export const getProductsId = async (id) => {
  return await axios
    .get(API.consultarProductoId, { params: { id: id } })
    .then((res) => res);
};
export const getActualMoney = async () => {
  return await axios.get(API.consultarDineroCaja).then((res) => res);
};

export const createBuy = async (order) => {
  return await axios.post(API.agregarCompra, order);
};

export const createSale = async (order) => {
  return await axios.post(API.agregarVenta, order);
};

export const addMoney = async (money) => {
  return await axios.post(API.agregarDinero, { dinero: money });
}