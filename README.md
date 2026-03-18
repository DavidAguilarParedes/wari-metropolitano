# Wari — Tu guia inteligente del Metropolitano de Lima

Wari es un agente de IA que te ayuda a encontrar la mejor ruta en el Metropolitano de Lima. Nombrado en honor al **Imperio Wari** (600-1000 d.C.), que construyo la primera red de caminos a gran escala en los Andes conectando pueblos — igual que Wari conecta personas con su bus.

**Demo en vivo:** [wari-metropolitano.vercel.app](https://wari-metropolitano.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js) ![GPT-4.1-mini](https://img.shields.io/badge/GPT--4.1--mini-Tool_Use-green?logo=openai) ![Leaflet](https://img.shields.io/badge/Leaflet-Map-blue?logo=leaflet)

## Que hace

- **Rutas inteligentes**: Preguntale de donde a donde y te dice la mejor ruta, con alternativas
- **Filtrado por horario**: Solo recomienda rutas que operan en el momento actual
- **Tool Use (Agentic AI)**: Si mencionas un lugar que no es estacion (ej: "UTEC", "Jockey Plaza"), el agente busca automaticamente la estacion mas cercana usando geocoding
- **44 estaciones**, **18 rutas troncales**, **22 alimentadores** con datos oficiales de ATU
- **Mapa interactivo** con todas las estaciones y rutas de alimentadores
- **Mapas oficiales ATU** de cada ruta troncal y expresa

## Stack tecnico

| Componente | Tecnologia |
|-----------|-----------|
| Frontend | Next.js 16 + React 19 + Tailwind CSS v4 |
| AI | GPT-4.1-mini con Function Calling (Tool Use) |
| Mapa | Leaflet + React-Leaflet |
| Geocoding | Nominatim (OpenStreetMap) |
| Deploy | Vercel |

## Arquitectura

```
Usuario pregunta ruta
        |
   [GPT-4.1-mini]
   /            \
Sin tool call    Tool call: buscar_estacion_cercana
   |                    |
   |             [Nominatim API] → Geocoding
   |                    |
   |             [Calculo distancia] → Estacion mas cercana
   |                    |
   |             [GPT-4.1-mini] ← Tool result
   |                    |
   v                    v
     Respuesta con ruta optimizada
```

**Sin RAG, sin base de datos.** Todo el conocimiento del sistema (estaciones, rutas, horarios, tarifas) esta en un system prompt optimizado. El unico componente externo es Nominatim para geocoding de lugares.

## Como correrlo localmente

```bash
# Clonar
git clone https://github.com/DavidAguilarParedes/wari-metropolitano.git
cd wari-metropolitano

# Instalar dependencias
npm install

# Configurar API key de OpenAI
cp .env.example .env.local
# Editar .env.local con tu OPENAI_API_KEY

# Correr en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Variables de entorno

| Variable | Descripcion |
|----------|------------|
| `OPENAI_API_KEY` | API key de OpenAI (requerida) |

## Estructura del proyecto

```
app/
  api/chat/route.ts      # API con tool use (function calling)
  components/
    Chat.tsx              # Chat con streaming NDJSON + animaciones de tool call
    MetroMap.tsx          # Mapa interactivo Leaflet
    RoutesPanel.tsx       # Panel de alimentadores
    TroncalRoutes.tsx     # Rutas troncales con mapas ATU
  lib/
    metropolitano-data.ts # System prompt con toda la data del Metropolitano
    stations.ts           # 44 estaciones con coordenadas
    alimentadores.ts      # Alimentadores y mapas de rutas troncales
  page.tsx                # Landing page
  demo/page.tsx           # Demo interactiva
```

## Autor

**David Aguilar** — AI Engineer

- [GitHub](https://github.com/DavidAguilarParedes)

---

Construido con Next.js + GPT-4.1-mini + Leaflet
