import { NextResponse } from "next/server";

// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// --- SIMULACIÓN DE BACKEND ---
// Almacén en memoria para simular la base de datos
// En producción esto se reiniciará cada vez que se reinicie el servidor
let mockCart = [
    {
        id: 101,
        name: "Producto de Prueba 1",
        price: 15000,
        quantity: 2,
        imageUrl: "https://via.placeholder.com/100?text=Prod+1"
    },
    {
        id: 102,
        name: "Producto de Prueba 2",
        price: 25000,
        quantity: 1,
        imageUrl: "https://via.placeholder.com/100?text=Prod+2"
    }
];

// Helper para simular delay de red
const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 500));
// -----------------------------

// get carrito por id
export async function GET(request) {
    try {
        const url = new URL(request.url);
        const id = url.searchParams.get("id");

        // Simulación: ignoramos el ID real y devolvemos el carrito mockeado
        // En un caso real validaríamos el ID
        if (!id) {
            return NextResponse.json(
                { error: "id carrito not found" },
                { status: 400 }
            );
        }

        await simulateDelay();

        // Simular respuesta del backend
        // El frontend espera un array o un objeto con propiedad 'productos'
        // Devolvemos el array directamente para simplificar
        return NextResponse.json(mockCart, { status: 200 });

        /* LÓGICA REAL COMENTADA
        const res = await fetch(
            `${API_BASE}/carrito/obtenerCarro/${encodeURIComponent(id)}`
        );
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
        */
    } catch (error) {
        return NextResponse.json(
            { error: error?.message || "Unexpected error" },
            { status: 500 }
        );
    }
}

// DELETE unificado: eliminar producto específico o vaciar carrito completo
export async function DELETE(request) {
    try {
        const url = new URL(request.url);
        const compradorId = url.searchParams.get("compradorId"); // ID del comprador
        const productId = url.searchParams.get("productId"); // ID del producto (opcional)
        const cantidad = url.searchParams.get("cantidad"); // Cantidad a eliminar (opcional, default 1)

        if (!compradorId) {
            return NextResponse.json(
                { error: "compradorId not found" },
                { status: 400 }
            );
        }

        await simulateDelay();

        // Si se proporciona productId, eliminar/reducir ese producto específico
        if (productId) {
            const prodIdInt = parseInt(productId);
            const cantInt = cantidad ? parseInt(cantidad) : 1;

            const itemIndex = mockCart.findIndex(item => item.id === prodIdInt);

            if (itemIndex !== -1) {
                if (mockCart[itemIndex].quantity > cantInt) {
                    mockCart[itemIndex].quantity -= cantInt;
                } else {
                    // Si la cantidad a eliminar es mayor o igual, quitamos el item
                    mockCart = mockCart.filter(item => item.id !== prodIdInt);
                }
            }

            console.log("DELETE simulado: producto eliminado/reducido", productId);
        }
        // Si NO se proporciona productId, vaciar el carrito completo
        else {
            mockCart = [];
            console.log("DELETE simulado: carrito vaciado");
        }

        return NextResponse.json({ success: true, message: "Operación exitosa (Simulada)" }, { status: 200 });

        /* LÓGICA REAL COMENTADA
        let res;
        let backendUrl;
        let bodyData;

        // Si se proporciona productId, eliminar/reducir ese producto específico
        if (productId) {
            backendUrl = `${API_BASE}/carrito/eliminarProducto`;
            bodyData = {
                compradorId: String(compradorId),
                productoId: parseInt(productId),
                cantidad: cantidad ? parseInt(cantidad) : 1, // Default: elimina 1 unidad
            };
            console.log("DELETE producto del carrito:", backendUrl, bodyData);

            res = await fetch(backendUrl, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });
        }
        // Si NO se proporciona productId, vaciar el carrito completo
        else {
            backendUrl = `${API_BASE}/carrito/eliminarCarrito`;
            bodyData = {
                compradorId: String(compradorId),
            };
            console.log("DELETE carrito completo:", backendUrl, bodyData);

            res = await fetch(backendUrl, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });
        }

        console.log("Respuesta del backend:", res.status);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Error del backend:", errorText);
            return NextResponse.json(
                {
                    error: `Error del backend: ${res.status}`,
                    details: errorText,
                },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
        */
    } catch (error) {
        console.error("Error en DELETE:", error);
        return NextResponse.json(
            { error: error?.message || "Unexpected error" },
            { status: 500 }
        );
    }
}

// POST para agregar/incrementar cantidad de un producto en el carrito
export async function POST(request) {
    try {
        const body = await request.json();
        const { compradorId, productoId, cantidad } = body;

        if (!compradorId || !productoId || !cantidad) {
            return NextResponse.json(
                { error: "compradorId, productoId y cantidad son requeridos" },
                { status: 400 }
            );
        }

        await simulateDelay();

        const prodIdInt = parseInt(productoId);
        const cantInt = parseInt(cantidad);

        const existingItemIndex = mockCart.findIndex(item => item.id === prodIdInt);

        if (existingItemIndex !== -1) {
            mockCart[existingItemIndex].quantity += cantInt;
        } else {
            // Si es un producto nuevo, lo agregamos con datos dummy
            // En una app real, buscaríamos los datos del producto en la BD
            mockCart.push({
                id: prodIdInt,
                name: `Producto Nuevo ${prodIdInt}`,
                price: 10000 + (prodIdInt * 100), // Precio dummy variable
                quantity: cantInt,
                imageUrl: "https://via.placeholder.com/100?text=New"
            });
        }

        console.log("POST simulado: producto agregado/incrementado", productoId);

        return NextResponse.json({ success: true, message: "Producto agregado (Simulado)" }, { status: 200 });

        /* LÓGICA REAL COMENTADA
        const backendUrl = `${API_BASE}/carrito/agregarProductos`;
        const bodyData = {
            compradorId: String(compradorId), // Debe ser string según el DTO
            productoId: parseInt(productoId),
            cantidad: parseInt(cantidad),
        };

        console.log("POST agregar/incrementar producto:", backendUrl, bodyData);

        const res = await fetch(backendUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
        });

        console.log("Respuesta del backend POST:", res.status);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Error del backend POST:", errorText);
            return NextResponse.json(
                {
                    error: `Error del backend: ${res.status}`,
                    details: errorText,
                },
                { status: res.status }
            );
        }

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
        */
    } catch (error) {
        console.error("Error en POST:", error);
        return NextResponse.json(
            { error: error?.message || "Unexpected error" },
            { status: 500 }
        );
    }
}