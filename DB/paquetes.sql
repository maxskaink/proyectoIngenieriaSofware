CREATE OR REPLACE PACKAGE paquete_gestionContable AS
  --Función que reciba como parámetro el id del cliente y devuelva el porcentaje de descuento total que se le puede hacer por fidelización
  FUNCTION descuentoCliente(p_clienteId CLIENTE.CEDULACLIENTE%type)
    RETURN number;
  --Procedimiento que reciba como parámetro el porcentaje que se le quiere subir o bajar el precio a todos los productos de una sucursal.
  PROCEDURE cambiarPreciosTodo(p_cambio number);
end;


CREATE OR REPLACE PACKAGE BODY paquete_gestionContable AS
  --Función que reciba como parámetro el id del cliente y devuelva el porcentaje de descuento total que se le puede hacer por fidelización
  FUNCTION descuentoCliente(p_clienteId CLIENTE.CEDULACLIENTE%type)
    RETURN number
  IS
    v_fechaNacimiento number;
  BEGIN
    select FECHANACIMIENTO 
    into v_fechaNacimiento
    from CLIENTE 
    where CEDULACLIENTE = p_clienteId;
    
    IF (to_char(v_fechaNacimiento, 'DD/MM') like to_char(SYSDATE, 'DD/MM') ) THEN 
      RETURN 0.15;
    ELSE 
      RETURN  0;
    END IF;
  END;
    
  --Procedimiento que reciba como parámetro el porcentaje que se le quiere subir o bajar el precio a todos los productos de una sucursal.
  PROCEDURE cambiarPreciosTodo(p_porcentajeCambio number) IS
  BEGIN 
    UPDATE Producto  set PrecioActual = PrecioActual*(1-p_porcentajeCambio);
  END;
END;

--Hacer triger de pedido para calcular el descuento si la compra se realizo en el cumple del cliente
CREATE OR REPLACE TRIGGER prom_productoVenta
AFTER INSERT ON productoventa 
FOR EACH ROW 
DECLARE
  v_sumaProductos number;
  v_idCliente CLIENTE.CEDULACLIENTE%type;
BEGIN
  SELECT SUM(preciounitario)
  INTO v_sumaProductos
  FROM productoventa 
  WHERE codigoventa = :NEW.codigoventa;
  
  SELECT CEDULACLIENTE 
  INTO v_idCliente
  FROM PEDIDO
  WHERE :NEW.codigoventa;
  
  UPDATE PEDIDO SET PRECIOTOTAL = v_sumaProductos(1- paquete_gestionContable.descuentoCliente(v_idCliente));
END;