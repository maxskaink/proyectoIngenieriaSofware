export class Product{
    constructor([id, nombre, descripcion, precio, activado, cantidadStock]){
        this.id = id
        this.nombre = nombre
        this.descripcion = descripcion
        this.precio = precio
        this.activado = activado
        this.cantidadStock = cantidadStock
    }
    isActive(){
        return this.activado === 1
    }
}