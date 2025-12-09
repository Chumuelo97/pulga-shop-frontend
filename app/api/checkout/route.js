import { NextResponse } from 'next/server';

const API_BASE = "http://nginx:80/api/v1";

export async function POST(request) {
    try {
        const body = await request.json();
        const { compradorId, carritoId, items } = body;

        /* --- SIMULACIÓN ---
        // Aquí iría la lógica real de procesamiento de pago o creación de orden
        console.log('Procesando orden para:', compradorId);
        console.log('Items:', items);

        // Simulamos un procesamiento exitoso y devolvemos la URL de redirección
        // En un caso real, esta URL vendría del proveedor de pagos (WebPay, MercadoPago, etc.)
        const mockPaymentUrl = `https://pago-seguro.ejemplo.com/pay?orderId=${crypto.randomUUID()}&amount=${items.reduce((sum, item) => sum + (item.price * item.quantity), 0)}`;

        return NextResponse.json({
            success: true,
            message: 'Redirigiendo a pago...',
            redirectUrl: mockPaymentUrl
        });
        */

        // --- LÓGICA REAL ---
        // Endpoint según Swagger: POST /ordenes/checkout/{carritoId}
        const response = await fetch(`${API_BASE}/ordenes/checkout/${carritoId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // El endpoint no requiere body según Swagger, pero enviamos items por si acaso o si cambia la spec.
            // Si da error 400 por body inesperado, se puede quitar.
            body: JSON.stringify({}),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error del backend: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error en checkout:', error);
        return NextResponse.json(
            { success: false, message: 'Error al procesar la orden', error: error.message },
            { status: 500 }
        );
    }
}