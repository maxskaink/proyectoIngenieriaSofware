/* eslint-disable no-case-declarations */

class Response {
  constructor(message, isValid) {
    this.message = message;
    this.isValid = isValid;
  }
}

export const infoFormanageProductoValid = (atributo, valor) => {
  if (valor.toString().length > 100)
    return new Response(
      "Ingrese un nombre de producto menor a 100 caracteres",
      false,
    );
  switch (atributo) {
    case "precio":
      if (valor.toString().length === 0)
        return new Response("Ingrese al menos un precio", true);
      if (valor.toString().length > 15) return;
      new Response("Ingrese un precio menor a 10 digitos", false);
      const precio = parseInt(valor, 10);

      if (isNaN(precio) || !precio)
        return new Response(
          "Ingrese un precio de solo numeros y no letras o caracteres especiales",
          false,
        );

      if (precio.toString().length !== valor.toString().length)
        return new Response(
          "Ingrese un precio solo numeros y no letras o caracteres especiales",
          false,
        );
      if (precio < 0)
        return new Response("Ingrese un precio mayor a cero", false);

      return new Response("todo ok", true);
    case "nombre":
      if (valor.toString().length === 0)
        return new Response(`Debe de ingresar un o una ${atributo}`, true);
      if (valor.toString().length >= 24)
        return new Response(
          `Ingrese un nombre de producto menor a 25 caracteres`,
          false,
        );
      return new Response("todo ok", true);
    default:
      if (valor.toString().length === 0)
        return new Response(`Debe de ingresar un o una ${atributo}`, true);
      return new Response("todo ok", true);
  }
};
