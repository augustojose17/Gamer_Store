document.addEventListener('DOMContentLoaded', () => {
    const carritoLink = document.getElementById('carrito-link');
    const carritoContenedor = document.getElementById('carrito-contenedor');
    const botonCerrar = document.getElementById('boton-cerrar');
    const cartItemsElement = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');
    let totalPrice = 0;
    let cart = [];

    // Mostrar/ocultar carrito al hacer clic en el enlace de carrito
    carritoLink.addEventListener('click', (e) => {
        e.preventDefault();
        carritoContenedor.classList.toggle('mostrar');
        updateCart();
    });

    // Cerrar carrito al hacer clic en el botón de cerrar
    botonCerrar.addEventListener('click', () => {
        carritoContenedor.classList.remove('mostrar');
    });

    // Agregar evento clic a todos los botones "Añadir al carrito"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.getAttribute('data-product-id');
            const productName = event.target.getAttribute('data-product-name');
            const productPrice = parseFloat(event.target.previousElementSibling.textContent.replace('Precio: L', '').replace(',', ''));
            const productImage = document.querySelector(`#product${productId} img`).src;

            addToCart(productId, productName, productPrice, productImage);
        });
    });

    // Función para añadir producto al carrito
    function addToCart(productId, productName, productPrice, productImage) {
        // Comprobar si el producto ya está en el carrito
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            // Si el producto ya está en el carrito, aumentar su cantidad
            existingItem.quantity++;
        } else {
            // Si es un nuevo producto, agregarlo al carrito
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                quantity: 1,
                image: productImage
            });
        }

        // Guardar el carrito en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Actualizar la visualización del carrito
        updateCart();
    }

    // Función para actualizar el carrito en la interfaz
    function updateCart() {
        cartItemsElement.innerHTML = '';
        totalPrice = 0;

        // Obtener el carrito desde localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = storedCart;

        // Recorrer cada elemento en el carrito
        cart.forEach(item => {
            // Crear contenedor de elemento de carrito
            const cartItemContainer = document.createElement('div');
            cartItemContainer.classList.add('cart-item-container');

            // Crear elemento de artículo de carrito
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');

            // Crear imagen de producto
            const productImage = document.createElement('img');
            productImage.src = item.image;
            productImage.classList.add('product-image');
            productImage.alt = item.name;

            // Crear detalles del artículo
            const itemDetails = document.createElement('div');

            // Crear nombre del artículo
            const itemName = document.createElement('h4');
            itemName.textContent = `${item.name} x${item.quantity}`;

            // Crear precio del artículo
            const itemPrice = document.createElement('p');
            const formattedPrice = formatPrice(item.price * item.quantity);
            itemPrice.textContent = formattedPrice;

            // Crear botón de aumento de cantidad
            const increaseButton = document.createElement('button');
            increaseButton.textContent = '+';
            increaseButton.classList.add('increase-button');
            increaseButton.addEventListener('click', () => {
                item.quantity++;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            });

            // Crear botón de disminución de cantidad
            const decreaseButton = document.createElement('button');
            decreaseButton.textContent = '-';
            decreaseButton.classList.add('decrease-button');
            decreaseButton.addEventListener('click', () => {
                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    const index = cart.indexOf(item);
                    cart.splice(index, 1);
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            });

            // Agregar elementos al contenedor de detalles del artículo
            itemDetails.appendChild(itemName);
            itemDetails.appendChild(itemPrice);
            itemDetails.appendChild(increaseButton);
            itemDetails.appendChild(decreaseButton);

            // Agregar imagen y detalles del artículo al contenedor de artículo de carrito
            cartItem.appendChild(productImage);
            cartItem.appendChild(itemDetails);
            cartItemContainer.appendChild(cartItem);

            // Agregar contenedor de artículo de carrito al elemento de lista de artículos de carrito
            cartItemsElement.appendChild(cartItemContainer);

            // Calcular el precio total
            totalPrice += item.price * item.quantity;
        });

        // Formatear y mostrar el precio total en la interfaz
        const formattedTotalPrice = formatPrice(totalPrice);
        totalPriceElement.textContent = `Total: ${formattedTotalPrice}`;
    }

    // Función para formatear el precio con comas y moneda
    function formatPrice(price) {
        return price.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' });
    }

    // Al cargar la página, asegúrate de mostrar los productos del carrito si hay alguno guardado
    updateCart();

    // Agregar evento para el botón de "Realizar Compra"
    const realizarCompraButton = document.querySelector('.realizar-compra');
    realizarCompraButton.addEventListener('click', vaciarCarrito);

    function vaciarCarrito() {
        // Vaciar el array del carrito
        cart = [];
        
        // Remover el carrito del localStorage
        localStorage.removeItem('cart');
        
        // Actualizar la visualización del carrito
        updateCart();

        // Mostrar mensaje de confirmación (opcional)
        alert('Compra realizada con éxito. El carrito ha sido vaciado.');
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const cartItemsElement = document.querySelector('#cart-items tbody');
    const totalPriceElement = document.getElementById('total-price');
    let totalPrice = 0;
    let cart = [];

    // Función para actualizar el carrito en la interfaz
    function updateCart() {
        cartItemsElement.innerHTML = '';
        totalPrice = 0;

        // Obtener el carrito desde localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = storedCart;

        // Recorrer cada elemento en el carrito
        cart.forEach(item => {
            // Crear fila de tabla para el artículo del carrito
            const row = document.createElement('tr');

            // Crear celda para la imagen del producto
            const imageCell = document.createElement('td');
            const productImage = document.createElement('img');
            productImage.src = item.image;
            productImage.classList.add('product-image');
            productImage.alt = item.name;
            imageCell.appendChild(productImage);

            // Crear celda para el nombre del producto
            const nameCell = document.createElement('td');
            const itemName = document.createElement('span');
            itemName.textContent = item.name;
            nameCell.appendChild(itemName);

            // Crear celda para el precio del producto
            const priceCell = document.createElement('td');
            const itemPrice = document.createElement('span');
            itemPrice.textContent = `L ${item.price.toFixed(2)}`;
            priceCell.appendChild(itemPrice);

            // Crear celda para la cantidad del producto
            const quantityCell = document.createElement('td');
            const itemQuantity = document.createElement('input');
            itemQuantity.type = 'number';
            itemQuantity.value = item.quantity;
            itemQuantity.min = 1;
            itemQuantity.addEventListener('change', () => {
                updateQuantity(item.id, itemQuantity.value);
            });
            quantityCell.appendChild(itemQuantity);

            // Crear celda para el subtotal del producto
            const subtotalCell = document.createElement('td');
            const itemSubtotal = document.createElement('span');
            itemSubtotal.textContent = `L ${(item.price * item.quantity).toFixed(2)}`;
            subtotalCell.appendChild(itemSubtotal);

            // Crear celda para el botón de eliminar
            const removeCell = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.textContent = '✖';
            removeButton.classList.add('remove-button');
            removeButton.addEventListener('click', () => {
                removeFromCart(item.id);
            });
            removeCell.appendChild(removeButton);

            // Añadir celdas a la fila
            row.appendChild(imageCell);
            row.appendChild(nameCell);
            row.appendChild(priceCell);
            row.appendChild(quantityCell);
            row.appendChild(subtotalCell);
            row.appendChild(removeCell);

            // Añadir fila a la tabla
            cartItemsElement.appendChild(row);

            // Calcular el precio total
            totalPrice += item.price * item.quantity;
        });

        // Actualizar el precio total en la interfaz
        totalPriceElement.textContent = `L ${totalPrice.toFixed(2)}`;
    }

    // Función para actualizar la cantidad de un producto en el carrito
    function updateQuantity(productId, newQuantity) {
        const updatedCart = cart.map(item => {
            if (item.id === productId) {
                item.quantity = parseInt(newQuantity);
            }
            return item;
        });

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Actualizar la visualización del carrito
        updateCart();
    }
// Función para formatear el precio con comas y moneda
function formatPrice(price) {
return price.toLocaleString('es-HN', { style: 'currency', currency: 'HNL' });
}

// Al cargar la página, asegúrate de mostrar los productos del carrito si hay alguno guardado
updateCart();

// Agregar evento para el botón de "Realizar Compra"
const realizarCompraButton = document.querySelector('.realizar-compra');
realizarCompraButton.addEventListener('click', vaciarCarrito);

function vaciarCarrito() {
// Vaciar el array del carrito
cart = [];

// Remover el carrito del localStorage
localStorage.removeItem('cart');

// Actualizar la visualización del carrito
updateCart();

// Mostrar mensaje de confirmación (opcional)
alert('Compra realizada con éxito. El carrito ha sido vaciado.');
}
// Función para eliminar un producto del carrito
    function removeFromCart(productId) {
        // Filtrar el producto del carrito
        cart = cart.filter(item => item.id !== productId);

        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Actualizar la visualización del carrito
        updateCart();
    }

    // Cargar el carrito desde localStorage al cargar la página
    updateCart();
});

