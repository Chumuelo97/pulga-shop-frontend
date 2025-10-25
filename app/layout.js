import './globals.css' 
export const metadata = {
  title: 'Mi Tienda Next.js',
  description: 'Creada con Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}