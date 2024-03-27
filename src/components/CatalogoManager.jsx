import { addProduct, deleteProduct, updateProduct } from '../helpers/querys.js'
import '../styles/catalogoManager.css'
import {  Catalogo } from './Catalogo.jsx'
import { ManageProduct } from './ManageProduct.jsx'
import { useState } from "react"


/* Componente donde podreamos ver, agregar, modificar y eliminar los productos del catalogo */
export function CatalogoManager () {
    /* el productSelected tiene la informacion del producto que se halla seleccionado en esta seccion, ademas de darnos la funcin para actualizarlo */
    const [productSelected, setProductSelected] = useState([]);
    /* Definimos que hacer cuando se selecciona un producto */
    const handleSelectProduct = ( newProducto ) => {
        setProductSelected(newProducto)
    }
    /* Definimos la accion cuando presiona el boton para elimnar el producto */
    const handleDeleteProduct  = async() => {
        return await deleteProduct(productSelected)
            .then( (res) => {
                setProductSelected([])
                return res
            });
    }
    /* Definimos la accion cuando presiona el boton para agregar un producto */
    const handleAddProduct = async(producto) => {
        return await addProduct(producto)
            .then((res) => {
                setProductSelected([])
                return res
            })
    }
    /* Definimos la accion cuando presiona el boton para actualizar un producto */
    const handleUpdateProduct = async(producto) => {
        return await updateProduct(producto)
            .then( (res) => {
                setProductSelected([])
                return res
            });
    }
    return (
      <>
        <article className="containerManagment">
          <Catalogo
            productSelected={productSelected}
            handleSelectProduct={handleSelectProduct}
          />
          <div className="container-crud">
            <ManageProduct
              handleManagement={handleAddProduct}
              title="Agregar producto"
            />
            {productSelected.length > 0 && (
              <ManageProduct
                handleManagement={handleUpdateProduct}
                title="Actualizar producto"
                product={productSelected}
                key={productSelected[0]}
              >
                <button className="manageProduct-button-eliminar" onClick={handleDeleteProduct}>
                  Eliminar producto
                </button>
              </ManageProduct>
            )}
          </div>
        </article>
      </>
    );
}