import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wari — Tu guia inteligente del Metropolitano de Lima",
  description: "Preguntale tu ruta al Metropolitano de Lima. Wari te dice que bus tomar, donde subirte y donde bajarte.",
  openGraph: {
    title: "Wari — Tu guia inteligente del Metropolitano de Lima",
    description: "Preguntale tu ruta al Metropolitano. 44 estaciones, 18 rutas, 22 alimentadores.",
    type: "website",
    locale: "es_PE",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
