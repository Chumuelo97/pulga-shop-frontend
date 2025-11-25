# Guía de Integración del Carrito de Compras

Esta guía explica cómo integrar el servicio de carrito de compras de **PulgaShop** en cualquier sitio web externo utilizando un `iframe`.

## Estructura del Proyecto

Hemos añadido dos componentes clave para esta funcionalidad:

1.  **Ruta de Embed (`/app/embed/cart/page.js`)**: Una página dedicada en la aplicación Next.js que renderiza solo el carrito y escucha mensajes externos.
2.  **Demo de Cliente Externo (`/external-client-demo/index.html`)**: Un ejemplo de cómo un sitio web de terceros puede integrar este carrito.

## Cómo Probar la Integración

1.  **Iniciar el Servidor de PulgaShop**:
    Asegúrate de que la aplicación Next.js esté corriendo en el puerto 3000.
    ```bash
    npm run dev
    ```

2.  **Abrir el Cliente Externo**:
    Abre el archivo `external-client-demo/index.html` en tu navegador.
    Puedes hacerlo simplemente arrastrando el archivo al navegador, o usando una extensión como "Live Server".

3.  **Interactuar**:
    - Verás una "Tienda Externa" con productos de ejemplo.
    - Haz clic en "Agregar al Carrito".
    - El carrito de PulgaShop debería abrirse (desde el iframe) y mostrar el producto agregado.

## Detalles Técnicos de la Integración

### 1. El Iframe
El sitio externo debe incluir un iframe que apunte a la ruta `/embed/cart` de la aplicación PulgaShop.

```html
<iframe id="cart-iframe" src="http://localhost:3000/embed/cart"></iframe>
```

Estilos recomendados para el iframe (para que flote sobre el contenido):
```css
#cart-iframe {
            position: fixed;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            border: none;
            z-index: 9999;
            pointer-events: none;
            /* Permite clicks en la página cuando el carrito está cerrado/transparente */
        }
```

### 2. Comunicación (PostMessage)
La comunicación entre el sitio externo y el carrito se realiza mediante `window.postMessage`.

**Para agregar un producto:**
```javascript
const cartIframe = document.getElementById('cart-iframe');
cartIframe.contentWindow.postMessage({
    type: 'ADD_TO_CART',
    product: {
        id: 123,
        name: "Nombre del Producto",
        price: 10000,
        quantity: 1,
        imageUrl: "..."
    },
    autoOpen: false // Opcional: false para no abrir el carrito automáticamente
}, 'http://localhost:3000');
```

**Para abrir el carrito manualmente (ej. botón flotante):**
```javascript
function openCart() {
    cartIframe.contentWindow.postMessage({
        type: 'OPEN_CART'
    }, 'http://localhost:3000');
}
```

**Manejo de Visibilidad (Pointer Events) y Actualizaciones:**

El iframe envía mensajes para informar sobre su estado (abierto/cerrado) y cuando el carrito cambia (para actualizar badges).

```javascript
window.addEventListener('message', (event) => {
    if (event.origin !== 'http://localhost:3000') return;
    
    // 1. Manejo de visibilidad (Pointer Events)
    if (event.data.type === 'CART_OPEN_STATUS') {
        if (event.data.isOpen) {
            cartIframe.style.pointerEvents = 'auto';
        } else {
            cartIframe.style.pointerEvents = 'none';
        }
    } 
    // 2. Actualización del carrito (Badge de notificación)
    else if (event.data.type === 'CART_UPDATED') {
        const count = event.data.totalItems;
        // Actualiza tu UI con la cantidad de items
        updateCartBadge(count); 
    }
});
```

## Consideraciones de Seguridad (CORS / Origin)
En un entorno de producción real:
1.  Asegúrate de configurar los encabezados `Content-Security-Policy` o `X-Frame-Options` en Next.js para permitir que el dominio externo incruste el iframe.
2.  En el código del `iframe` (`app/embed/cart/page.js`), valida `event.origin` para asegurarte de que solo dominios confiables puedan enviar productos al carrito.
