import { NextResponse } from 'next/server';
const mockProducts = [
    { 
        id: 1, 
        name: "Bolso", 
        price: 150000, 
        quantity: 1, 
        category: "Accesorios",
        imageUrl: "https://media.istockphoto.com/id/1365118618/es/foto/bolso-de-moda-azul-sobre-fondo-blanco-aislado.jpg?s=612x612&w=0&k=20&c=lBALJ59vd6DXiSwrm0umAOcKA03tk5flTAm2nCSC9Yc=" // <- NUEVO
    },
    { 
        id: 2, 
        name: "Zapatos", 
        price: 50000, 
        quantity: 1, 
        category: "Calzado",
        imageUrl: "https://sartorial.cl/cdn/shop/files/2_79a04769-dcf5-434c-8b18-a1d7004c3189.png?v=1720332661&width=1445" // <- NUEVO
    },
    {
        id: 3,
        name: "Chaqueta de Cuero",
        price: 100000,
        quantity: 1,
        category: "Ropa",
        imageUrl: "https://http2.mlstatic.com/D_NQ_NP_718439-CBT75520352336_042024-O-chaqueta-de-cuero-genuino-para-hombre-con-cremallera-negra.webp" // <- NUEVO
    }
];

export async function GET(request) {
    return NextResponse.json(mockProducts);
}