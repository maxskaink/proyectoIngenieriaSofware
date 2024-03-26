import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { test, describe, vi, beforeEach, expect } from "vitest";
import { CatalogoManager } from "../components/CatalogoManager";


describe("Agregar Form", () => {
  const onSubmit = vi.fn();

  beforeEach(() => {
    onSubmit.mockClear();
  });

  render(<CatalogoManager onSubmit={onSubmit} />);

  test("onsSubmit is called with the correct values", async () => {
    fireEvent.input(getNombre(), { target: { value: "Nombre del producto3" } });
    fireEvent.input(getDescripcion(), {
      target: { value: "Descripción del producto3" },
    });
    fireEvent.input(getPrecio(), { target: { value: "27003" } });

    fireEvent.click(getButton());

    await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(0);
    });

    expect(onSubmit).toHaveBeenCalledWith({lazy:true});

  });


  function getNombre() {
    const elementsByRole = screen.getAllByRole("textbox", { name: /nombre:/i });

    for (let i = 0; i < elementsByRole.length; i++) {
      if (elementsByRole[i].getAttribute("data-testid") === "addProduct") {
        return elementsByRole[i];
      }
    }

  }
  function getDescripcion() {
    const elementsByRole = screen.getAllByRole('textbox', {
        name: /descripción:/i
      })

    for (let i = 0; i < elementsByRole.length; i++) {
      if (elementsByRole[i].getAttribute("data-testid") === "addProduct") {
        return elementsByRole[i];
      }
    }
  }
  function getPrecio() { 
    const elementsByRole = screen.getAllByRole("spinbutton", {
        name: /precio:/i,
      });

    for (let i = 0; i < elementsByRole.length; i++) {
      if (elementsByRole[i].getAttribute("data-testid") === "addProduct") {
        return elementsByRole[i];
      }
    }
  }
  function getButton() {
    const elementsByRole = screen.getAllByRole("button", {
        name: /agregar producto/i
      });

    for (let i = 0; i < elementsByRole.length; i++) {
      if (elementsByRole[i].getAttribute("data-testid") === "addProduct") {
        return elementsByRole[i];
      }
    }
  }
});
