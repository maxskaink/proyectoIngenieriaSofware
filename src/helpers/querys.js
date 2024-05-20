import axios from "axios";
import { API } from "../constants/API";
import { Product } from "../class/product";

const defaultProduct = new Product(["", "", "", "", "", ""]);

/* Funcion que nos permite resibir el producto que se quiere actualizar com objeto para luego utilizar la api */
export const updateProduct = async (producto) => {
  if (!window.confirm("¿Estás seguro de modificar el producto?"))
    return window.alert("a modificación fue cancelada.");
  const newProduct = { ...producto, activado: 1 };
  return await axios.put(API.actualizarProducto, newProduct);
};
/* Nos permite recibir el producto como objeto para enviarlo a la api y agregarlo */
export const addProduct = async (producto) => {
  return await axios.post(API.agregarProducto, producto);
};

/* Nos permite resibir el producto seleccionado para hace su acutalizacion clocando el activado en ce ro */
export const deleteProduct = async (producto = defaultProduct) => {
  if (!window.confirm("¿Estas seguro que deseas eliminar el producto?")) 
    return window.alert("La eliminación fue cancelada");

  const newProduct = { ...producto, activado: 0 };
  if (newProduct.cantidadStock > 0) {
    alert("No se puede eliminar este producto. La cantidad de unidades existentes del producto es diferente de 0.");
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

export const getInforms = async () => {
  return await axios.get(API.consultarInformes).then((res) => res);
}

export const getCategories = async () => {
  return await axios.get(API.obtenerCategorias).then((res) => res);
}
export const addProvider = async (provider) =>  await axios.post(API.agregarProveedor, provider);

export const getProviders = async () => await axios.get(API.consultarProveedores).then((res) => res.data);

export const updateProvider = async (provider) => await axios.put(API.actualizarProveedor, provider);

export const addClient = async (client) => await axios.post(API.agregarCliente, client);

export const getClients = async () => await axios.get(API.consultarClientes).then((res) => res.data);

export const updateClient = async (client) => await axios.put(API.actualizarCliente, client);

export const addBranch = async (branch) => await axios.post(API.agregarSucursal, branch);

export const addMoneyBranch = async (info) => await axios.put(API.agregarDineroSucursal, info);

export const getBranchs = async () => await axios.get(API.consultarSucursales).then((res) => res.data);

export const updateBranch = async (branch) => await axios.put(API.actualizarSucursal, branch);

export const getMoneyBranch = async (idSucursal) => {
  return await axios
    .get(API.consultarDineroSucursal, { params: { idSucursal } })
    .then((res) => res);
};;

export const updateStateSale = async (info) => 
  await axios.put(API.actualizarEstadoVenta, { info });

export const addLot = async (lot) => await axios.post(API.agregarLote, lot);

export const getLots = async () => await axios.get(API.obtenerLotes).then((res) => res.data);

export const getProductsBranch = async (idSucursal) => {
  return await axios
    .get(API.consultarProductosSucursal, { params: { idSucursal } })
    .then((res) => res);
};

export const getWorkers = async () => await axios.get(API.obtenerTrabajadores).then((res) => res.data);

export const addWorker = async (worker) => await axios.post(API.agregarTrabajador, worker);

export const updateWorker = async (worker) => await axios.put(API.actualizarTrabajador, worker);
