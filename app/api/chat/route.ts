import { NextRequest } from "next/server";
import OpenAI from "openai";
import { METROPOLITANO_SYSTEM_PROMPT } from "@/app/lib/metropolitano-data";
import { STATIONS } from "@/app/lib/stations";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "buscar_estacion_cercana",
      description:
        "Busca la estación del Metropolitano más cercana a un lugar, dirección o punto de interés en Lima. Usa esto cuando el usuario mencione un destino u origen que NO es una estación del Metropolitano (universidades, centros comerciales, hospitales, clínicas, restaurantes, parques, etc.).",
      parameters: {
        type: "object",
        properties: {
          lugar: {
            type: "string",
            description:
              "El nombre del lugar para buscar en el mapa. Usa el nombre COMPLETO sin repetir la sigla. Ejemplos: si el usuario dice 'UTEC' → busca 'Universidad de Ingenieria y Tecnologia'. Si dice 'UPC' → 'Universidad Peruana de Ciencias Aplicadas'. Si dice 'PUCP' → 'Pontificia Universidad Catolica del Peru'. Otros ejemplos: 'Jockey Plaza', 'Hospital Rebagliati', 'Plaza San Martin'.",
          },
        },
        required: ["lugar"],
      },
    },
  },
];

function findNearest(lat: number, lng: number) {
  let nearest = STATIONS[0];
  let minDist = Infinity;
  for (const s of STATIONS) {
    const d = Math.sqrt((s.lat - lat) ** 2 + (s.lng - lng) ** 2);
    if (d < minDist) {
      minDist = d;
      nearest = s;
    }
  }
  const distKm = Math.round(minDist * 111 * 10) / 10;
  return { station: nearest, distanceKm: distKm };
}

// Lima metro area bounding box (viewbox) to prioritize results in Lima
const LIMA_VIEWBOX = "-77.2,-12.3,-76.8,-11.8";

// Center of Lima's Metropolitano corridor for ranking results
const LIMA_CENTER = { lat: -12.06, lng: -77.035 };

async function nominatimSearch(query: string) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&viewbox=${LIMA_VIEWBOX}&bounded=1`,
    { headers: { "User-Agent": "WariMetropolitano/1.0" } }
  );
  let data = await res.json();
  if (!data.length) {
    const res2 = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5`,
      { headers: { "User-Agent": "WariMetropolitano/1.0" } }
    );
    data = await res2.json();
  }
  if (!data.length) return [];
  // Pick the result closest to Lima's Metropolitano corridor
  data.sort((a: { lat: string; lon: string }, b: { lat: string; lon: string }) => {
    const da = Math.sqrt((parseFloat(a.lat) - LIMA_CENTER.lat) ** 2 + (parseFloat(a.lon) - LIMA_CENTER.lng) ** 2);
    const db = Math.sqrt((parseFloat(b.lat) - LIMA_CENTER.lat) ** 2 + (parseFloat(b.lon) - LIMA_CENTER.lng) ** 2);
    return da - db;
  });
  return [data[0]];
}

async function geocode(lugar: string) {
  const queries = [
    lugar + ", Lima, Peru",
    lugar + ", Lima",
    lugar,
    // Strip acronyms in parentheses or after the name
    lugar.replace(/\s*\(.*?\)\s*/g, "").replace(/\s+[A-Z]{2,}$/g, "") + ", Lima, Peru",
  ];

  for (const q of queries) {
    const data = await nominatimSearch(q.trim());
    if (data.length) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        display: data[0].display_name,
      };
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  // Guardrails: limit message count and length to prevent abuse
  if (!Array.isArray(messages) || messages.length > 30) {
    return new Response(JSON.stringify({ type: "message", content: "Demasiados mensajes. Inicia una nueva conversacion." }), { status: 400 });
  }
  const lastMsg = messages[messages.length - 1];
  if (lastMsg?.content && typeof lastMsg.content === "string" && lastMsg.content.length > 500) {
    return new Response(JSON.stringify({ type: "message", content: "Tu mensaje es muy largo. Preguntame algo mas corto, como: ¿Como llego de Naranjal a Angamos?" }), { status: 400 });
  }

  const now = new Date().toLocaleString("es-PE", {
    timeZone: "America/Lima",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const systemWithTime = `${METROPOLITANO_SYSTEM_PROMPT}\n\nFECHA Y HORA ACTUAL EN LIMA: ${now}. Usa esto para filtrar rutas disponibles.`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) =>
        controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));

      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4.1-mini",
          messages: [
            { role: "system", content: systemWithTime },
            ...messages,
          ],
          tools,
          temperature: 0.3,
          max_tokens: 800,
        });

        const choice = response.choices[0];

        if (
          choice.finish_reason === "tool_calls" &&
          choice.message.tool_calls?.length
        ) {
          const tc = choice.message.tool_calls[0];
          if (tc.type !== "function") throw new Error("Unexpected tool call type");
          const args = JSON.parse(tc.function.arguments);

          send({ type: "tool_call", name: tc.function.name, lugar: args.lugar });

          const geo = await geocode(args.lugar);
          let toolResult: string;

          if (!geo) {
            toolResult = JSON.stringify({
              error: `No encontré "${args.lugar}" en Lima. Pide al usuario que especifique la estación más cercana.`,
            });
            send({ type: "tool_result", error: true, lugar: args.lugar });
          } else {
            const { station, distanceKm } = findNearest(geo.lat, geo.lng);
            toolResult = JSON.stringify({
              lugar_buscado: args.lugar,
              coordenadas: { lat: geo.lat, lng: geo.lng },
              estacion_cercana: station.name,
              distrito: station.district,
              zona: station.zone,
              distancia_km: distanceKm,
            });
            send({
              type: "tool_result",
              error: false,
              lugar: args.lugar,
              estacion: station.name,
              distrito: station.district,
              distancia: distanceKm,
            });
          }

          const followUp = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
              { role: "system", content: systemWithTime },
              ...messages,
              choice.message,
              { role: "tool", tool_call_id: tc.id, content: toolResult },
            ],
            temperature: 0.3,
            max_tokens: 800,
          });

          send({
            type: "message",
            content: followUp.choices[0].message.content,
          });
        } else {
          send({ type: "message", content: choice.message.content });
        }
      } catch {
        send({ type: "message", content: "Error de conexion. Intenta de nuevo." });
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "application/x-ndjson" },
  });
}
