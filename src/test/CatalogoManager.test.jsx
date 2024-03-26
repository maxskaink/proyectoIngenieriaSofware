import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { test, describe, vi, beforeEach, expect } from "vitest";
import { CatalogoManager } from "../components/CatalogoManager";

const onSubmit = vi.fn();

beforeEach(() => {
  onSubmit.mockClear();
});

render(<CatalogoManager onSubmit={onSubmit}/>);

(async () => { await waitFor(async () => {
describe("Agregar Form", () => {
  test("Se agrega un nuevo producto con datos validos", async () => {
    fireEvent.input(getNombre("addProduct"), { target: { value: "Nombre de producto" } });
    fireEvent.input(getDescripcion("addProduct"), {
      target: { value: "Descripción de  producto" },
    });
    fireEvent.input(getPrecio("addProduct"), { target: { value: "1111" } });

    fireEvent.click(getAddButton());

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

    clean("addProduct");

    await waitFor(() => {
      expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
    });

    expect(screen.queryByText(/Descripción del producto sin nombre/i)).toBeNull();
    expect(screen.queryByText(/1112/i)).toBeNull();
  });

  test("Se agrega un nuevo producto sin descripcion", async () => {
    fireEvent.input(getNombre("addProduct"), { target: { value: "Producto sin una descripcion" } });
    fireEvent.input(getDescripcion("addProduct"), {
      target: { value: "" },
    });
    fireEvent.input(getPrecio("addProduct"), { target: { value: "1112" } });

    fireEvent.click(getAddButton());

    clean("addProduct");

    await waitFor(() => {
      expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
    });
    expect(screen.queryByText(/Producto sin una descripcion:/i)).toBeNull();
    expect(screen.queryByText(/1112/i)).toBeNull();
  });
  
  test("Se agrega un nuevo producto sin precio", async () => {
    fireEvent.input(getNombre("addProduct"), { target: { value: "Producto sin precio" } });
    fireEvent.input(getDescripcion("addProduct"), {
      target: { value: "Descripción del producto sin precio" },
    });
    fireEvent.input(getPrecio("addProduct"), { target: { value: "" } });

    fireEvent.click(getAddButton());

    clean("addProduct");

    await waitFor(() => {
      expect(screen.getByText(/Nombre de producto/i)).toBeDefined();
    });
    expect(screen.queryByText(/Descripción del producto sin precio/i)).toBeNull();
    expect(screen.queryByText(/Producto sin precio/i)).toBeNull();
  });
  function getAddButton() {
    return screen.getByRole("button", {
        name: /agregar producto/i
      });
  
  }
});
  });
})();

(async () => { await waitFor(async () => {
  describe("Eliminar Form", () => {

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
})();




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
