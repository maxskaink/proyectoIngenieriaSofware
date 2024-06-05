CREATE OR REPLACE FUNCTION ObtenerProductoMasVendido(p_semana IN VARCHAR2)
RETURN NUMBER
IS
    v_idProducto NUMBER;
BEGIN
    BEGIN
        SELECT idProducto INTO v_idProducto
        FROM ProductosVenta pv
        JOIN venta v ON pv.codigoVenta = v.codigoVenta
        WHERE TO_CHAR(v.fecha, 'IYYY-IW') = p_semana
        GROUP BY idProducto
        ORDER BY SUM(cantidad) DESC
        FETCH FIRST 1 ROWS ONLY;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            v_idProducto := NULL;
    END;

    RETURN v_idProducto;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
/

CREATE OR REPLACE FUNCTION ObtenerProductoMenosVendido(p_semana IN VARCHAR2)
RETURN NUMBER
IS
    v_idProducto NUMBER;
BEGIN
    BEGIN
        SELECT idProducto INTO v_idProducto
        FROM ProductosVenta pv
        JOIN venta v ON pv.codigoVenta = v.codigoVenta
        WHERE TO_CHAR(v.fecha, 'IYYY-IW') = p_semana
        GROUP BY idProducto
        ORDER BY SUM(cantidad) ASC
        FETCH FIRST 1 ROWS ONLY;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            v_idProducto := NULL;
    END;

    RETURN v_idProducto;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
/

CREATE OR REPLACE FUNCTION ObtenerProductoMasComprado(p_semana IN VARCHAR2)
RETURN NUMBER
IS
    v_idProducto NUMBER;
BEGIN
    BEGIN
        SELECT idProducto INTO v_idProducto
        FROM ProductosCompra pc
        JOIN compra c ON pc.codigoCompra = c.codigoCompra
        WHERE TO_CHAR(c.fecha, 'IYYY-IW') = p_semana
        GROUP BY idProducto
        ORDER BY SUM(cantidad) DESC
        FETCH FIRST 1 ROWS ONLY;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            v_idProducto := NULL;
    END;

    RETURN v_idProducto;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
/

CREATE OR REPLACE FUNCTION ObtenerProductoMenosComprado(p_semana IN VARCHAR2)
RETURN NUMBER
IS
    v_idProducto NUMBER;
BEGIN
    BEGIN
        SELECT idProducto INTO v_idProducto
        FROM ProductosCompra pc
        JOIN compra c ON pc.codigoCompra = c.codigoCompra
        WHERE TO_CHAR(c.fecha, 'IYYY-IW') = p_semana
        GROUP BY idProducto
        ORDER BY SUM(cantidad) ASC
        FETCH FIRST 1 ROWS ONLY;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            v_idProducto := NULL;
    END;

    RETURN v_idProducto;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
/

CREATE OR REPLACE FUNCTION ObtenerTotalGastadoEnCompras(p_semana IN VARCHAR2)
RETURN NUMBER
IS
    v_totalGastado NUMBER;
BEGIN
    BEGIN
        SELECT SUM(precioTotalCompra) INTO v_totalGastado
        FROM compra
        WHERE TO_CHAR(fecha, 'IYYY-IW') = p_semana;
        
        -- Si no hay compras en la semana especificada, asignar cero al total gastado
        IF v_totalGastado IS NULL THEN
            v_totalGastado := 0;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            v_totalGastado := NULL;
    END;

    RETURN v_totalGastado;
END;

/
CREATE OR REPLACE FUNCTION ObtenerTotalGeneradoEnVentas(p_semana IN VARCHAR2)
RETURN NUMBER
IS
    v_totalGenerado NUMBER;
BEGIN
    BEGIN
        SELECT SUM(precioTotalVenta) INTO v_totalGenerado
        FROM venta
        WHERE TO_CHAR(fecha, 'IYYY-IW') = p_semana;

        -- Si no hay ventas en la semana especificada, asignar cero al total generado
        IF v_totalGenerado IS NULL THEN
            v_totalGenerado := 0;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            v_totalGenerado := NULL;
    END;

    RETURN v_totalGenerado;
END;

/
CREATE OR REPLACE FUNCTION ObtenerNumeroVentas(p_semana IN VARCHAR2)
RETURN NUMBER
IS
    v_numeroVentas NUMBER;
BEGIN
    BEGIN
        SELECT COUNT(*) INTO v_numeroVentas
        FROM venta
        WHERE TO_CHAR(fecha, 'IYYY-IW') = p_semana;
        
        -- Si no hay ventas en la semana especificada, asignar cero al número de ventas
        IF v_numeroVentas IS NULL THEN
            v_numeroVentas := 0;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            v_numeroVentas := NULL;
    END;

    RETURN v_numeroVentas;
END;

/
CREATE OR REPLACE FUNCTION ObtenerNumeroCompras(p_semana IN VARCHAR2)
RETURN NUMBER
IS
    v_numeroCompras NUMBER;
BEGIN
    BEGIN
        SELECT COUNT(*) INTO v_numeroCompras
        FROM compra
        WHERE TO_CHAR(fecha, 'IYYY-IW') = p_semana;
        
        -- Si no hay compras en la semana especificada, asignar cero al número de compras
        IF v_numeroCompras IS NULL THEN
            v_numeroCompras := 0;
        END IF;
    EXCEPTION
        WHEN OTHERS THEN
            v_numeroCompras := NULL;
    END;

    RETURN v_numeroCompras;
END;
/

CREATE OR REPLACE FUNCTION ObtenerGananciaOPerdida(p_semana IN VARCHAR2)
RETURN NUMBER
IS
    v_totalIngresos NUMBER := ObtenerTotalGeneradoEnVentas(p_semana);
    v_totalGastos NUMBER := ObtenerTotalGastadoEnCompras(p_semana);
BEGIN
    -- Calcular el saldo final restando los gastos de las compras de los ingresos por ventas
    RETURN v_totalIngresos - v_totalGastos;
END;
/


CREATE OR REPLACE VIEW Vista_Resumen_Semanal AS
SELECT
    semana,
    ObtenerTotalGeneradoEnVentas(semana) AS ingresos_ventas,
    ObtenerNumeroVentas(semana) AS numero_ventas,
    CASE 
        WHEN ObtenerNumeroVentas(semana) = 0 THEN 0 -- Manejo de división por cero
        ELSE ROUND(ObtenerTotalGeneradoEnVentas(semana) / ObtenerNumeroVentas(semana), 2) -- Redondeo a dos decimales
    END AS precio_promedio_venta,
    ObtenerTotalGastadoEnCompras(semana) AS gastos_compras,
    ObtenerNumeroCompras(semana) AS numero_compras,
    AVG(CASE WHEN transaccion = 'compra' THEN precio ELSE NULL END) AS precio_promedio_compra,
    (SELECT nombre FROM Producto WHERE idProducto = ObtenerProductoMasVendido(semana)) AS producto_mas_vendido,
    (SELECT nombre FROM Producto WHERE idProducto = ObtenerProductoMenosVendido(semana)) AS producto_menos_vendido,
    (SELECT nombre FROM Producto WHERE idProducto = ObtenerProductoMasComprado(semana)) AS producto_mas_comprado,
    (SELECT nombre FROM Producto WHERE idProducto = ObtenerProductoMenosComprado(semana)) AS producto_menos_comprado,
    ObtenerGananciaOPerdida(semana) AS ganancia_perdida
FROM
    (
    SELECT
        TO_CHAR(fecha, 'IYYY-IW') AS semana,
        'venta' AS transaccion,
        fecha,
        preciototalventa AS total,
        precioUnitario AS precio,
        NULL AS producto_mas_vendido,
        NULL AS producto_menos_vendido,
        NULL AS producto_mas_comprado,
        NULL AS producto_menos_comprado,
        (SELECT SUM(dineroTotal) FROM Caja WHERE TO_CHAR(fecha, 'IYYY-IW') = TO_CHAR(V.fecha, 'IYYY-IW')) AS saldo_final_caja
    FROM venta V
    JOIN ProductosVenta ON V.codigoVenta = ProductosVenta.codigoVenta
    UNION ALL
    SELECT
        TO_CHAR(fecha, 'IYYY-IW'),
        'compra',
        fecha,
        preciototalcompra,
        precioUnitario,
        NULL,
        NULL,
        NULL,
        NULL,
        (SELECT SUM(dineroTotal) FROM Caja WHERE TO_CHAR(fecha, 'IYYY-IW') = TO_CHAR(C.fecha, 'IYYY-IW')) AS saldo_final_caja
    FROM compra C
    JOIN ProductosCompra ON C.codigoCompra = ProductosCompra.codigoCompra
    )
GROUP BY semana;
/
SELECT * FROM Vista_Resumen_Semanal;
