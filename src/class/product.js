export class Product {
  constructor([id, nombre, descripcion, precio, activado, categoria]) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.activado = activado;
    this.categoria = categoria;
  }
  isActive() {
    return this.activado === 1;
  }
}
 