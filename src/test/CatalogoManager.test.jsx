import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { test, describe, vi, beforeEach, expect } from "vitest";
import { CatalogoManager } from "../components/CatalogoManager";

const confirmUpdate = "¿Estas seguro que deseas actualizar el producto?";
const confirmDelete = "¿Estas seguro que deseas eliminar el producto?";
const errorTag = "manageProduct-message-error";

window.confirm = vi.fn(() => true);

const sleepTime = 900;

const onSubmit = vi.fn();

beforeEach(() => {
  onSubmit.mockClear();
  fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
    target: { value: "" },
  });
});

render(<CatalogoManager onSubmit={onSubmit} />);

(async () => {
  await waitFor(async () => {
    describe("Agregar producto", () => {
      test("Se agrega un nuevo producto con datos validos", async () => {
        addProduct(
          "Nombre de producto",
          "Descripción de producto",
          "1111",
          "addProduct"
        );

        await sleep(sleepTime);

        await waitFor(() => {
          expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
        });

        expect(screen.getAllByText(/Descripción de producto/i)).toBeDefined();
        expect(screen.getAllByText(/1111/i)).toBeDefined();
      });

      test("Se agrega un nuevo producto sin nombre", async () => {
        inputData(
          "",
          "Descripción del producto sin nombre",
          "1112",
          "addProduct"
        );

        expect(screen.getByTestId("result-message").className).toBe(errorTag);

        clean("addProduct");

        await waitFor(() => {
          expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
        });

        expect(
          screen.queryByText(/Descripción del producto sin nombre/i)
        ).toBeNull();
      });

      test("Se agrega un nuevo producto sin descripción", async () => {
        inputData("Producto sin una descripción", "", "1112", "addProduct");

        expect(screen.getByTestId("result-message").className).toBe(errorTag);

        clean("addProduct");

        await waitFor(() => {
          expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
        });
        expect(screen.queryByText(/Producto sin una descripción:/i)).toBeNull();
      });

      test("Se agrega un nuevo producto sin precio", async () => {
        inputData(
          "Producto sin precio",
          "Descripción del producto sin precio",
          "",
          "addProduct"
        );

        expect(screen.getByTestId("result-message").className).toBe(errorTag);

        clean("addProduct");

        sleep(sleepTime);
          
        expect(screen.queryByText(/Producto sin precio/i)).toBeNull();
      });

      test("Prueba de límites de longitud de nombre", async () => {
        const longName = "a".repeat(100); // Asume que 100 supera el límite
        const longDescription = "Descripción normal";
        const longPrice = 2000;

        inputData(longName, longDescription, longPrice, "addProduct");

        await waitFor(() => {
          expect(screen.getByTestId("result-message").className).toBe(errorTag);
        });
        clean("addProduct");

        await waitFor(() => {
          expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
        });

        expect(screen.queryByText(longName)).toBeNull();
      });

      test("Prueba de límites de longitud de descripción", async () => {
        const longName = "Producto con descripción demasiado larga";
        const longDescription = "b".repeat(2500); // Asume que 2500 supera el límite
        const longPrice = 2000;

        inputData(longName, longDescription, longPrice, "addProduct");

        expect(screen.getByTestId("result-message").className).toBe(errorTag);

        clean("addProduct");

        await waitFor(() => {
          expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
        });

        expect(screen.queryByText(longName)).toBeNull();
      });

      test("Prueba de límites de longitud de precio", async () => {
        const longName = "Producto con precio largo";
        const longDescription = "Descripción normal";
        const longPrice = "1".repeat(20); // Asume que 20 supera el límite

        inputData(longName, longDescription, longPrice, "addProduct");

        await waitFor(() => {
          expect(screen.getByTestId("result-message").className).toBe(errorTag);
        });

        clean("addProduct");

        await waitFor(() => {
          expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
        });

        expect(screen.queryByText(longName)).toBeNull();
      });

      test("Prueba del rechazo de productos duplicados", async () => {
        const name = "Producto duplicado";
        const description = "Descripción normal";
        const price = 2000;

        inputData(name, description, price, "addProduct");

        clean("addProduct");

        await waitFor(() => {
          expect(screen.getByText(name)).toBeDefined();
        });

        inputData(name, description, price, "addProduct");

        await waitFor(() => {
          expect(screen.getByTestId("result-message").className).toBe(errorTag);
        });
      });

      test("Prueba agregar productos eliminados", async () => {
        const name = "Producto a eliminar";
        const description = "Descripción";
        const price = 1500;

        addProduct(name, description, price);

        await sleep(sleepTime);

        fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
          target: { value: name },
        });

        await waitFor(() => {
          expect(screen.getByText(name)).toBeDefined();
        });

        fireEvent.click(screen.getByText(name));

        await waitFor(() => {
          expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
        });

        fireEvent.click(getDeleteButton());

        await waitFor(() => {
          expect(window.confirm).toHaveBeenCalledWith(confirmDelete);
        });

        addProduct(name, description, price);

        await waitFor(() => {
          expect(screen.getByText(name)).toBeDefined();
        });

        clean("addProduct");

        expect(screen.getByText(name)).toBeDefined();
      });

      test("Agregar 2 veces un producto con el mismo nombre, colocando espacios al final del nombre", async () => {
        const name = "Producto espaciado";
        const name2 = "Producto espaciado ";
        const description = "Descripción";
        const price = 1500;

        inputData(name, description, price, "addProduct");

        clean("addProduct");

        await waitFor(() => {
          expect(screen.getByText(name)).toBeDefined();
        });

        inputData(name2, description, price, "addProduct");

        await waitFor(() => {
          expect(screen.getByTestId("result-message").className).toBe(errorTag);
        });

        sleep(sleepTime);

        fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
          target: { value: name },
        });

        expect(screen.getByText(name)).toBeDefined();
      });

      test("Agregar 2 veces un producto con el mismo nombre, colocando espacios al inicio del nombre", async () => {
        const name = "Producto con espacio";
        const name2 = " Producto con espacio";
        const description = "Descripción";
        const price = 1500;

        inputData(name, description, price, "addProduct");

        clean("addProduct");

        await waitFor(() => {
          expect(screen.getByText(name)).toBeDefined();
        });  

        inputData(name2, description, price, "addProduct");

        await waitFor(() => {
          expect(screen.getByTestId("result-message").className).toBe(errorTag);
        });

        sleep(sleepTime);

        fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
          target: { value: name },
        });

        expect(screen.getByText(name)).toBeDefined();
      });
    });
  });
})();

(async () => {
  await waitFor(async () => {
    describe("Actualizar producto", () => {
      test("Se actualiza un producto existente", async () => {
        const name = "Producto sin actualizar";
        const description = "Descripción";
        const price = 1500;

        const updatedName = "Producto actualizado";
        const updatedDescription = "Descripción actualizada";
        const updatedPrice = 2222;

        addProduct(name, description, price, "addProduct");

        fireEvent.click(screen.getByText(name));

        await waitFor(() => {
          expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
        });

        inputData(
          updatedName,
          updatedDescription,
          updatedPrice,
          "updateProduct" 
        );
  
        clean("updateProduct");

        await waitFor(() => {
          expect(window.confirm).toHaveBeenCalledWith(confirmUpdate);
        });

        await waitFor(() => {
          expect(screen.getByText(updatedName)).toBeDefined();
        });

        expect(screen.queryByText(name)).toBeNull();

      });

      test("Se actualiza un producto con nombre vacio", async () => {
        const name = "Producto con nombre";
        const description = "Descripción";
        const price = 1500;

        const updatedName = "";
        const updatedDescription = "Descripción actualizada";
        const updatedPrice = 2222;

        addProduct(name, description, price);

        fireEvent.click(screen.getByText(name));
        await waitFor(() => {
          expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
        });

        inputData(
          updatedName,
          updatedDescription,
          updatedPrice,
          "updateProduct"
        );

        clean("updateProduct");

        await waitFor(() => {
          expect(window.confirm).toHaveBeenCalledWith(confirmUpdate);
        });

        expect(screen.getByText(name)).toBeDefined();
      });

      test("Se actualiza un producto con descripción vacia", async () => {
        const name = "Producto con descripción";
        const description = "Descripción";
        const price = 1500;

        const updatedName = "Producto sin descripción";
        const updatedDescription = "";
        const updatedPrice = 2222;

        addProduct(name, description, price);

        fireEvent.click(screen.getByText(name));

        await waitFor(() => {
          expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
        });

        inputData(
          updatedName,
          updatedDescription,
          updatedPrice,
          "updateProduct"
        );

        clean("updateProduct");

        expect(screen.getByText(name)).toBeDefined();
        expect(screen.queryByText(updatedName)).toBeNull();
      });

      test("Se actualiza un producto con precio vacio", async () => {
        const name = "Producto con precio";
        const description = "Descripción";
        const price = 1500;

        const updatedName = "Producto sin precio";
        const updatedDescription = "Descripción";
        const updatedPrice = "";

        addProduct(name, description, price);

        await sleep(sleepTime);

        fireEvent.click(screen.getByText(name));

        await waitFor(() => {
          expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
        });

        inputData(
          updatedName,
          updatedDescription,
          updatedPrice,
          "updateProduct"
        );

        clean("updateProduct");

        expect(screen.getByText(name)).toBeDefined();
        expect(screen.queryByText(updatedName)).toBeNull();
      });

      test("Se actualiza un producto con un nombre existente", async () => {
        const name = "Producto existente";
        const description = "Descripción";
        const price = 1500;

        const name2 = "Producto actualizable";
        const description2 = "Otra descripción";
        const price2 = 2000;

        addProduct(name, description, price);
        addProduct(name2, description2, price2);

        await waitFor(() => {
          expect(screen.getByText(name2)).toBeDefined();
        });

        fireEvent.click(screen.getByText(name2));

        await waitFor(() => {
          expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
        });

        inputData(name, description, price, "updateProduct");

        clean("updateProduct");

        await waitFor(() => {
          expect(window.confirm).toHaveBeenCalledWith(confirmUpdate);
        });

        await waitFor(() => {
          expect(screen.getAllByTestId("result-message")[1].className).toBe(
            errorTag
          );
        });
        await waitFor(() => {
          expect(screen.getByText(name)).toBeDefined();
        });
        expect(screen.getByText(name2)).toBeDefined();
      });

      test("Se actualiza un producto con un nombre eliminado", async () => {
        const name = "Producto en existencia";
        const description = "Descripción";
        const price = 1500;

        const deletedName = "Producto no existente";
        const deletedDescription = "Descripción eliminada";
        const deletedPrice = 3333;

        addProduct(name, description, price);
        addProduct(deletedName, deletedDescription, deletedPrice);

        sleep(sleepTime);

        fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
          target: { value: deletedName },
        });

        await waitFor(() => {
          expect(screen.getByText(deletedName)).toBeDefined();
        });

        fireEvent.click(screen.getByText(deletedName));

        await waitFor(() => {
          expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
        });

        fireEvent.click(getDeleteButton());

        await waitFor(() => {
          expect(window.confirm).toHaveBeenCalledWith(confirmDelete);
        });

        fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
          target: { value: name },
        });

        fireEvent.click(screen.getByText(name));

        await waitFor(() => {
          expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
        });

        inputData(
          deletedName,
          deletedDescription,
          deletedPrice,
          "updateProduct"
        );

        await waitFor(() => {
          expect(window.confirm).toHaveBeenCalledWith(confirmUpdate);
        });

        expect(screen.queryByText(name)).toBeNull();
        expect(screen.getByText(deletedName)).toBeDefined();
      });

      test("Se actualiza un producto con un nombre existente, colocando espacio al final del nombre", async () => {
        const name = "Producto espaciado duplicado";
        const description = "Descripción";
        const price = 1500;

        const name2 = "Producto espaciado duplicado ";

        addProduct(name, description, price);

        sleep(sleepTime);

        fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
          target: { value: name },
        });
          

        await waitFor(() => {
          expect(screen.getByText(name)).toBeDefined();
        });


        fireEvent.click(screen.getByText(name));

        await waitFor(() => {
          expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
        });

        inputData(name2, description, price, "updateProduct");

        clean("updateProduct");

        await waitFor(() => {
          expect(window.confirm).toHaveBeenCalledWith(confirmUpdate);
        });


        fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
          target: { value: name[0] },
        });       
 
        await waitFor(() => {
          expect(screen.getByText(name)).toBeDefined();
        });
        expect(screen.queryByText(name2)).toBeNull();  
      });

      test("Se actualiza un producto con un nombre existente, colocando espacio al inicio del nombre", async () => {
        const name = "Producto espaciado repetido";
        const description = "Descripción";
        const price = 1500;

        const name2 = " Producto espaciado repetido";
      
        sleep(sleepTime);   

        addProduct(name, description, price);

        sleep(sleepTime);

        fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
          target: { value: name },  
        });
          

        await waitFor(() => {
          expect(screen.getByText(name)).toBeDefined();
        });   


        fireEvent.click(screen.getByText(name));

        await waitFor(() => {
          expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
        });

        inputData(name2, description, price, "updateProduct");

        clean("updateProduct");

        await waitFor(() => {
          expect(window.confirm).toHaveBeenCalledWith(confirmUpdate);
        });
        
        sleep(sleepTime);
 
        await waitFor(() => {
          expect(screen.getByText(name)).toBeDefined();
        });
      });

    });
  });
})();

(async () => {
  await waitFor(async () => {
    describe("Eliminar producto", () => {
      test("Se elimina un producto existente", async () => {
        const name = "Producto existente a eliminar";

        addProduct(name, "Descripción", 1500);  

        await sleep(sleepTime);

        fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
          target: { value: name },
        });

        await waitFor(() => {
          expect(screen.getByText(name)).toBeDefined();
        });

        fireEvent.click(screen.getByText(name));

        await waitFor(() => {
          expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
        });

        fireEvent.click(getDeleteButton());

        await waitFor(() => {
          expect(window.confirm).toHaveBeenCalledWith(confirmDelete);
        });

        await waitFor(() => {
          expect(screen.queryByText(name)).toBeNull();
        });
      });

      test("Se elimina producto por segunda vez", async () => {
        const name = "Producto eliminable";

        for (let i = 0; i < 2; i++) {
          fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
            target: { value: "" },
          });

          addProduct(name, "Descripción", 1500);

          await sleep(sleepTime);

          fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
            target: { value: name },
          });

          await waitFor(() => {
            expect(screen.getByText(name)).toBeDefined();
          }); 

          fireEvent.click(screen.getByText(name));

          await waitFor(() => {
            expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
          });

          fireEvent.click(getDeleteButton());

          await waitFor(() => {
            expect(window.confirm).toHaveBeenCalledWith(confirmDelete);
          });

          await waitFor(() => {
            expect(screen.queryByText(name)).toBeNull();
          });
        }
      });

      test("Se elimina un producto con nombre vacio", async () => {
        const name = "Producto vacio";

        addProduct(name, "Descripción", 1500);

        await sleep(sleepTime);

        fireEvent.change(screen.getByPlaceholderText("Buscar..."), {
          target: { value: name },
        });

        await waitFor(() => {
          expect(screen.getByText(name)).toBeDefined();
        });

        fireEvent.click(screen.getByText(name));

        await waitFor(() => {
          expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
        });

        fireEvent.input(getNombre("updateProduct"), { target: { value: "" } });
        fireEvent.click(getDeleteButton());

        await waitFor(() => {
          expect(window.confirm).toHaveBeenCalledWith(confirmDelete);
        });

        await waitFor(() => {
          expect(screen.queryByText(name)).toBeNull();
        });
      });
    });
  });
})();


  
async function addProduct(name, description, price) {
  await waitFor(() => {
    screen.queryByText(name) !== null;
  });
  if (screen.queryByText(name) === null) {
    inputData(name, description, price, "addProduct");
    clean("addProduct");
  }
}
function getAddButton() {
  return screen.getByRole("button", {
    name: /agregar producto/i,
  });
}
function getUpdateButton() {
  return screen.getByRole("button", {
    name: /actualizar producto/i,
  });
}
function getDeleteButton() {
  return screen.getByRole("button", {
    name: /eliminar producto/i,
  });
}

function clean(testid) {
  fireEvent.input(getNombre(testid), { target: { value: "" } });
  fireEvent.input(getDescripción(testid), {
    target: { value: "" },
  });
  fireEvent.input(getPrecio(testid), { target: { value: "" } });
}
function getNombre(testid) {
  const elementsByRole = screen.getAllByRole("textbox", { name: /nombre:/i });

  for (let i = 0; i < elementsByRole.length; i++) {
    if (elementsByRole[i].getAttribute("data-testid") === testid) {
      return elementsByRole[i];
    }
  }
}
function getDescripción(testid) {
  const elementsByRole = screen.getAllByRole("textbox", {
    name: /descripción:/i,
  });

  for (let i = 0; i < elementsByRole.length; i++) {
    if (elementsByRole[i].getAttribute("data-testid") === testid) {
      return elementsByRole[i];
    }
  }
}
function getPrecio(testid) {
  const elementsByRole = screen.getAllByRole("textbox", {
    name: /precio:/i,
  });

  for (let i = 0; i < elementsByRole.length; i++) {
    if (elementsByRole[i].getAttribute("data-testid") === testid) {
      return elementsByRole[i];
    }
  }
}

function inputData(name, description, price, testid) {
  fireEvent.input(getNombre(testid), { target: { value: name } });
  fireEvent.input(getDescripción(testid), { target: { value: description } });
  fireEvent.input(getPrecio(testid), { target: { value: price } });

  if (testid === "addProduct") fireEvent.click(getAddButton());
  else if (testid === "updateProduct") fireEvent.click(getUpdateButton());
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
