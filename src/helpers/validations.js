/* eslint-disable no-case-declarations */

class Response{
    constructor(message, isValid){
        this.message = message
        this.isValid = isValid
    }
}

export const infoForCreateProductoValid = (atributo, valor) => {

    switch (atributo) {
        case 'id':
            console.log(valor.toString().length)
            if( valor.toString().length === 0)
                return new Response('Ingrese al menos un id', true)
            const id = parseFloat(valor, 10);

            if((isNaN(id) || !id) )
                return new Response('Ingrese en id solo numeros y no letras o caracteres especiales', false)

            if(id.toString().length !== valor.toString().length)
                return new Response('Ingrese en id solo numeros y no letras o caracteres especiales', false)

            if( id < 0)
                return new Response('Ingrese id mayor a cero', false)

            return new Response('todo ok', true)

        case 'precio':
            if( valor.toString().length === 0)
                return new Response('Ingrese al menos un precio', true)
            const precio = parseInt(valor, 10);

            if(isNaN(precio) || !precio)
                return new Response('Ingrese un precio de solo numeros y no letras o caracteres especiales', false)
            
            if(precio.toString().length !== valor.toString().length)
                return new Response('Ingrese un precio solo numeros y no letras o caracteres especiales', false)
            if( precio < 0)
                return new Response('Ingrese un precio mayor a cero', false)

            return new Response('todo ok', true)
    }
    return new Response('todo ok', true)
}