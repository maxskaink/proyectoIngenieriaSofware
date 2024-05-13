export class Provider {
    constructor([nit, nombre, telefono, direccion = '']) {
        this.nit = nit;
        this.nombre = nombre;
        this.telefono = telefono;
        this.direccion = direccion;
    }

}