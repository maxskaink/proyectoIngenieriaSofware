import { Catalogo } from "../components/Catalogo";
import { render, screen } from "@testing-library/react";

it("always true test", () => {
    expect(true).toBe(true);
});

it("renders<agregar producto>", () => {
    render(<Catalogo />);
    const myElement = screen.getByText(/Lista de Productos/);
    expect(myElement).toBeInTheDocument();
});


