export class Product {
  constructor([id, nombre, descripcion, precio, activado, categoria, idSucursal, cantidad]) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.activado = activado;
    this.categoria = categoria;
    this.idSucursal = idSucursal;
    this.cantidad = cantidad;
  }
  isActive() {
    return this.activado === 1;
  }
}
 