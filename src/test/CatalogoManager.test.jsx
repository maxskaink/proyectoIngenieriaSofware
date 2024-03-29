import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { test, describe, vi, beforeEach, expect } from "vitest";
import { CatalogoManager } from "../components/CatalogoManager";

const onSubmit = vi.fn();

beforeEach(() => {
  onSubmit.mockClear();
});

render(<CatalogoManager onSubmit={onSubmit}/>);

(async () => { await waitFor(async () => {
describe("Agregar producto", () => {
  test("Se agrega un nuevo producto con datos validos", async () => {
    fireEvent.input(getNombre("addProduct"), { target: { value: "Nombre de producto" } });
    fireEvent.input(getDescripcion("addProduct"), {
      target: { value: "Descripción de  producto" },
    });
    fireEvent.input(getPrecio("addProduct"), { target: { value: "1111" } });

    fireEvent.click(getAddButton());

    expect(screen.getByTestId("result-message").className).toBe("manageProduct-message");

    clean("addProduct");

    await waitFor(() => {
      expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
    });



    expect(screen.getAllByText(/Descripción de producto/i)).toBeDefined();
    expect(screen.getAllByText(/1111/i)).toBeDefined();
  });

  test("Se agrega un nuevo producto sin nombre", async () => {
    fireEvent.input(getNombre("addProduct"), { target: { value: "" } });
    fireEvent.input(getDescripcion("addProduct"), {
      target: { value: "Descripción del producto sin nombre" },
    });
    fireEvent.input(getPrecio("addProduct"), { target: { value: "1112" } });

    fireEvent.click(getAddButton());

    expect(screen.getByTestId("result-message").className).toBe("manageProduct-message-error");

    clean("addProduct");

    await waitFor(() => {
      expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
    });

    expect(screen.queryByText(/Descripción del producto sin nombre/i)).toBeNull();
  });

  test("Se agrega un nuevo producto sin descripcion", async () => {
    fireEvent.input(getNombre("addProduct"), { target: { value: "Producto sin una descripcion" } });
    fireEvent.input(getDescripcion("addProduct"), {
      target: { value: "" },
    });
    fireEvent.input(getPrecio("addProduct"), { target: { value: "1112" } });

    fireEvent.click(getAddButton());

    expect(screen.getByTestId("result-message").className).toBe("manageProduct-message-error");

    clean("addProduct");

    await waitFor(() => {
      expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
    });
    expect(screen.queryByText(/Producto sin una descripcion:/i)).toBeNull();
  });
  
  test("Se agrega un nuevo producto sin precio", async () => {
    fireEvent.input(getNombre("addProduct"), { target: { value: "Producto sin precio" } });
    fireEvent.input(getDescripcion("addProduct"), {
      target: { value: "Descripción del producto sin precio" },
    });

    fireEvent.input(getPrecio("addProduct"), { target: { value: "" } });

    fireEvent.click(getAddButton());

    expect(screen.getByTestId("result-message").className).toBe("manageProduct-message-error");

    clean("addProduct");

    await waitFor(() => {
      expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
    });
    expect(screen.queryByText(/Descripción del producto sin precio/i)).toBeNull();
    expect(screen.queryByText(/Producto sin precio/i)).toBeNull();
  });
  
  test("Prueba de límites de longitud de nombre", async () => {
    const longName = 'a'.repeat(100); // Asume que 100 supera el límite
    const longDescription = "Descripcion normal";
    const longPrice = 2000;

    fireEvent.input(getNombre("addProduct"), { target: { value: longName } });
    fireEvent.input(getDescripcion("addProduct"), { target: { value: longDescription } });
    fireEvent.input(getPrecio("addProduct"), { target: { value: longPrice } });

    fireEvent.click(getAddButton())

    expect(screen.getByTestId("result-message").className).toBe("manageProduct-message-error");

    clean("addProduct");

    await waitFor(() => {
      expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
    });

    expect(screen.queryByText('a'.repeat(100))).toBeNull();
  });

  test("Prueba de límites de longitud de descripcion", async () => {
    const longName = "Producto con descripción demasiado larga"
    const longDescription = 'b'.repeat(2500);// Asume que 2500 supera el límite
    const longPrice = 2000;

    fireEvent.input(getNombre("addProduct"), { target: { value: longName } });
    fireEvent.input(getDescripcion("addProduct"), { target: { value: longDescription } });
    fireEvent.input(getPrecio("addProduct"), { target: { value: longPrice } });

    fireEvent.click(getAddButton())

    expect(screen.getByTestId("result-message").className).toBe("manageProduct-message-error");

    clean("addProduct");

    await waitFor(() => {
      expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
    });

    expect(screen.queryByText("Producto con descripcion demasiado larga")).toBeNull();
  });

  test("Prueba de límites de longitud de precio", async () => {
    const longName = "Producto con precio largo"
    const longDescription = "Descripcion normal"
    const longPrice = '1'.repeat(20); // Asume que 20 supera el límite

    fireEvent.input(getNombre("addProduct"), { target: { value: longName } });
    fireEvent.input(getDescripcion("addProduct"), { target: { value: longDescription } });
    fireEvent.input(getPrecio("addProduct"), { target: { value: longPrice } });

    fireEvent.click(getAddButton())

    expect(screen.getByTestId("result-message").className).toBe("manageProduct-message-error");

    clean("addProduct");

    await waitFor(() => {
      expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
    });

    expect(screen.queryByText("Producto con precio largo")).toBeNull();
  });

  test("Prueba del rechazo de productos duplicados", async () => {
    const name = "Producto duplicado";
    const description = "Descripcion normal";
    const price = 2000;

    fireEvent.input(getNombre("addProduct"), { target: { value: name } });
    fireEvent.input(getDescripcion("addProduct"), { target: { value: description } });
    fireEvent.input(getPrecio("addProduct"), { target: { value: price } });

    fireEvent.click(getAddButton());

    expect(screen.getByTestId("result-message").className).toBe("manageProduct-message");

    clean("addProduct");

    await waitFor(() => {
      expect(screen.getByText(/Producto duplicado/i)).toBeDefined();
    });

    fireEvent.input(getNombre("addProduct"), { target: { value: name } });
    fireEvent.input(getDescripcion("addProduct"), { target: { value: description } });
    fireEvent.input(getPrecio("addProduct"), { target: { value: price } });

    fireEvent.click(getAddButton());
    await waitFor(() => {
    expect(screen.getByTestId("result-message").className).toBe("manageProduct-message-error");
    });

    clean("addProduct");

    expect(screen.getByText(/Producto duplicado/i)).toBeDefined();
  });



});
  });
})();

/* (async () => { await waitFor(async () => {
  describe("Eliminar producto", () => {

    window.confirm = vi.fn(() => true);

    test("Se elimina un producto existente", async () => {

      fireEvent.click(screen.getByText(/Nombre de producto/i));
      await waitFor(() => {
        expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
      });

      fireEvent.click(getDeleteButton());

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith('¿Estas seguro que deseas eliminar el producto?');
      });

      expect(screen.queryByText(/Nombre de producto/i)).toBeNull();
      
      
    });

    function getDeleteButton() {
      return screen.getByRole("button", {
          name: /eliminar producto/i
        });
    
    }
  });
});
})(); */



(async () => { await waitFor(async () => {
  describe("Actualizar producto", () => {

    window.confirm = vi.fn(() => true);

    test("Se actualiza un producto existente", async () => {
      const name = "Producto sin actualizar";
      const description = "Descripcion";
      const price = 1500;
  
      fireEvent.input(getNombre("addProduct"), { target: { value: name } });
      fireEvent.input(getDescripcion("addProduct"), { target: { value: description } });
      fireEvent.input(getPrecio("addProduct"), { target: { value: price } });

      fireEvent.click(getAddButton());

      fireEvent.click(screen.getByText(/Producto sin actualizar/i));
      await waitFor(() => {
        expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
      });

      fireEvent.input(getNombre("updateProduct"), { target: { value: "Producto actualizado" } });
      fireEvent.input(getDescripcion("updateProduct"), { target: { value: "Descripción actualizada" } });
      fireEvent.input(getPrecio("updateProduct"), { target: { value: "2222" } });

      fireEvent.click(getUpdateButton());

      clean("updateProduct");

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith('¿Estas seguro que deseas actualizar el producto?');
      });

      expect(screen.queryByText(/Producto sin actualizar/i)).toBeNull();
      expect(screen.getByText(/Producto actualizado/i)).toBeDefined();
      
    });
    
    test("Se actualiza un producto con nombre vacio", async () => {
      const name = "Producto con nombre";
      const description = "Descripcion";
      const price = 1500;
  
      fireEvent.input(getNombre("addProduct"), { target: { value: name } });
      fireEvent.input(getDescripcion("addProduct"), { target: { value: description } });
      fireEvent.input(getPrecio("addProduct"), { target: { value: price } });

      fireEvent.click(getAddButton());

      fireEvent.click(screen.getByText(/Producto sin nombre/i));
      await waitFor(() => {
        expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
      });
    
      fireEvent.input(getNombre("updateProduct"), { target: { value: "" } });
      fireEvent.input(getDescripcion("updateProduct"), { target: { value: "Descripción actualizada" } });
      fireEvent.input(getPrecio("updateProduct"), { target: { value: "2222" } });

      fireEvent.click(getUpdateButton());

      clean("updateProduct");

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith('¿Estas seguro que deseas actualizar el producto?');
      });

      expect(screen.getByText(/Producto con nombre/i)).toBeDefined();
      
    });
    
    test("Se actualiza un producto con descripcion vacia", async () => {
      const name = "Producto con descripcion";
      const description = "Descripcion";
      const price = 1500;
  
      fireEvent.input(getNombre("addProduct"), { target: { value: name } });
      fireEvent.input(getDescripcion("addProduct"), { target: { value: description } });
      fireEvent.input(getPrecio("addProduct"), { target: { value: price } });

      fireEvent.click(getAddButton());

      fireEvent.click(screen.getByText(/Producto sin nombre/i));
      await waitFor(() => {
        expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
      });
    
      fireEvent.input(getNombre("updateProduct"), { target: { value: "Producto sin descripcion" } });
      fireEvent.input(getDescripcion("updateProduct"), { target: { value: "" } });
      fireEvent.input(getPrecio("updateProduct"), { target: { value: "2222" } });

      fireEvent.click(getUpdateButton());

      clean("updateProduct");

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith('¿Estas seguro que deseas actualizar el producto?');
      });

      expect(screen.getByText(/Producto con descripcion /i)).toBeDefined();
      expect(screen.queryByText(/Producto sin descripcion/i)).toBeNull();
      
    });

    test("Se actualiza un producto con precio vacio", async () => {
      const name = "Producto con precio";
      const description = "Descripcion";
      const price = 1500;
  
      fireEvent.input(getNombre("addProduct"), { target: { value: name } });
      fireEvent.input(getDescripcion("addProduct"), { target: { value: description } });
      fireEvent.input(getPrecio("addProduct"), { target: { value: price } });

      fireEvent.click(getAddButton());

      fireEvent.click(screen.getByText(/Producto sin nombre/i));
      await waitFor(() => {
        expect(screen.getAllByText(/Actualizar producto/i)).toBeDefined();
      });
    
      fireEvent.input(getNombre("updateProduct"), { target: { value: "Producto sin precio" } });
      fireEvent.input(getDescripcion("updateProduct"), { target: { value: "Descripcion" } });
      fireEvent.input(getPrecio("updateProduct"), { target: { value: "" } });

      fireEvent.click(getUpdateButton());

      clean("updateProduct");

      await waitFor(() => {
        expect(window.confirm).toHaveBeenCalledWith('¿Estas seguro que deseas actualizar el producto?');
      });

      expect(screen.getByText(/Producto con precio /i)).toBeDefined();
      expect(screen.queryByText(/Producto sin precio/i)).toBeNull();
      
    });

    test("")

  });
});
})();



function getAddButton() {
  return screen.getByRole("button", {
      name: /agregar producto/i
    });

}
function getUpdateButton() {
  return screen.getByRole("button", {
      name: /actualizar producto/i
    });

}
function clean(testid) {
  fireEvent.input(getNombre(testid), { target: { value: "" } });
  fireEvent.input(getDescripcion(testid), {
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
function getDescripcion(testid) {
  const elementsByRole = screen.getAllByRole('textbox', {
      name: /descripción:/i
    })

  for (let i = 0; i < elementsByRole.length; i++) {
    if (elementsByRole[i].getAttribute("data-testid") === testid) {
      return elementsByRole[i];
    }
  }
}
function getPrecio(testid) { 
  const elementsByRole = screen.getAllByRole("spinbutton", {
      name: /precio:/i,
    });

  for (let i = 0; i < elementsByRole.length; i++) {
    if (elementsByRole[i].getAttribute("data-testid") === testid) {
      return elementsByRole[i];
    }
  }
}
