import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

//get carrito por id
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "id carrito not found" },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${API_BASE}/carrito/obtenerCarro/${encodeURIComponent(id)}`
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
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
  } catch (error) {
    console.error("Error en POST:", error);
    return NextResponse.json(
      { error: error?.message || "Unexpected error" },
      { status: 500 }
    );
  }
}
