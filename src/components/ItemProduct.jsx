import '../styles/ItemProduct.css'

// eslint-disable-next-line react/prop-types
export const ItemProduct = ({ producto, onClick }) => {

    const handleClick = () => {
        onClick(producto)
    }

    return (
        // eslint-disable-next-line react/no-unknown-property
        <li key={producto[0]} className='catalogo-producto' onClick={handleClick}>
            <strong>ID:</strong> {producto[0]}, <strong>Nombre:</strong> {producto[1]}, <strong>Descripción:</strong> {producto[2]}, <strong>Precio:</strong> {producto[3]}
        </li>
    );

};