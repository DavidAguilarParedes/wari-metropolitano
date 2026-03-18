"use client";

import { useState, useRef, useEffect } from "react";
import { Station, findNearestStation } from "@/app/lib/stations";

interface ToolData {
  lugar: string;
  estacion?: string;
  distrito?: string;
  distancia?: number;
  error?: boolean;
}

interface Message {
  role: "user" | "assistant" | "tool_result";
  content: string;
  toolData?: ToolData;
}

interface ActiveToolCall {
  lugar: string;
}

interface ChatProps {
  onLocationFound: (lat: number, lng: number, station: Station) => void;
  stationFromMap: Station | null;
  onStationFromMapConsumed: () => void;
}

const SUGGESTIONS = [
  { text: "Estoy en Naranjal, quiero ir a Angamos", icon: "🚌", label: "Ruta directa" },
  { text: "Quiero ir a la UTEC desde Naranjal", icon: "🏫", label: "Busca estacion" },
  { text: "De Canaval y Moreyra a Caqueta", icon: "🔄", label: "Sur a Norte" },
];

export default function Chat({ onLocationFound, stationFromMap, onStationFromMapConsumed }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [activeToolCall, setActiveToolCall] = useState<ActiveToolCall | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, activeToolCall]);

  useEffect(() => {
    if (stationFromMap) {
      setInput((p) => p.trim() === "" ? `Estoy en ${stationFromMap.name}, quiero ir a ` : p);
      onStationFromMapConsumed();
    }
  }, [stationFromMap, onStationFromMapConsumed]);

  function handleLocate() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const nearest = findNearestStation(latitude, longitude);
        onLocationFound(latitude, longitude, nearest);
        setLocating(false);
        setMessages((p) => [...p, { role: "assistant", content: `📍 Estas cerca de **${nearest.name}** (${nearest.district}). ¿A donde quieres ir?` }]);
        setInput(`Estoy en ${nearest.name}, quiero ir a `);
      },
      () => {
        setLocating(false);
        setMessages((p) => [...p, { role: "assistant", content: "No pude obtener tu ubicacion. Dime en que estacion estas." }]);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function sendMessage(text?: string) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    const updated: Message[] = [...messages, { role: "user", content: msg }];
    setMessages(updated);
    setInput("");
    setLoading(true);
    setActiveToolCall(null);

    try {
      const apiMessages = updated
        .filter((m) => m.role !== "tool_result")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line);

          if (event.type === "tool_call") {
            setActiveToolCall({ lugar: event.lugar });
          } else if (event.type === "tool_result") {
            setActiveToolCall(null);
            if (!event.error) {
              setMessages((prev) => [
                ...prev,
                {
                  role: "tool_result",
                  content: `${event.lugar} → Est. ${event.estacion}`,
                  toolData: {
                    lugar: event.lugar,
                    estacion: event.estacion,
                    distrito: event.distrito,
                    distancia: event.distancia,
                  },
                },
              ]);
            }
          } else if (event.type === "message") {
            setMessages((prev) => [...prev, { role: "assistant", content: event.content }]);
          }
        }
      }
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Error de conexion. Intenta de nuevo." }]);
    } finally {
      setLoading(false);
      setActiveToolCall(null);
    }
  }

  function handleCopyShare(idx: number, content: string) {
    const shareText = `🚌 Wari me ayudo con mi ruta del Metropolitano:\n\n${content.replace(/\*\*/g, "").replace(/\*/g, "")}\n\n→ Pruebalo tu tambien #WariAI`;
    navigator.clipboard.writeText(shareText);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  }

  function fmt(t: string) {
    return t.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\*(.*?)\*/g, "<em>$1</em>").replace(/\n/g, "<br/>");
  }

  const showWelcome = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Chat sub-header */}
      <div className="px-4 py-2.5 border-b border-black/[0.04] flex items-center justify-between shrink-0">
        <span className="text-[11px] text-[#1e3a5f]/35 font-medium">Preguntame tu ruta</span>
        <button
          onClick={handleLocate}
          disabled={locating}
          className="flex items-center gap-1.5 text-[10px] text-white font-semibold bg-[#1e3a5f] hover:bg-[#162d4a] px-3 py-1.5 rounded-lg transition-all active:scale-[0.97] disabled:opacity-50"
        >
          {locating ? (
            <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          )}
          Mi ubicacion
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {/* Welcome */}
        {showWelcome && (
          <div className="flex flex-col items-center justify-center h-full animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-[#1e3a5f] flex items-center justify-center mb-5 animate-float shadow-lg shadow-[#1e3a5f]/10">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <p className="text-base font-bold text-[#1e3a5f] mb-1">¿A donde vas?</p>
            <p className="text-[11px] text-[#1e3a5f]/35 mb-6">Prueba una de estas rutas o escribe la tuya</p>

            <div className="w-full max-w-xs space-y-2 animate-stagger">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.text)}
                  className="w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl bg-white/50 border border-black/[0.04] hover:bg-white/80 hover:border-[#1e3a5f]/15 hover:shadow-md hover:shadow-[#1e3a5f]/[0.03] transition-all duration-300 group active:scale-[0.98]"
                >
                  <span className="text-base shrink-0 group-hover:scale-110 transition-transform duration-300">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-[12px] font-medium text-[#1e3a5f]/70 group-hover:text-[#1e3a5f] block leading-tight transition-colors">{s.text}</span>
                    <span className="text-[9px] text-[#1e3a5f]/25">{s.label}</span>
                  </div>
                  <svg className="w-3.5 h-3.5 text-[#1e3a5f]/15 group-hover:text-[#1e3a5f]/40 group-hover:translate-x-0.5 transition-all duration-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((m, i) =>
          m.role === "tool_result" && m.toolData ? (
            <div key={i} className="flex justify-start msg-left">
              <div className="tool-result-card max-w-[85%] bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/40 rounded-xl px-3.5 py-2.5 shadow-sm shadow-orange-500/5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-orange-700 leading-tight">
                      {m.toolData.lugar} → Est. {m.toolData.estacion}
                    </p>
                    <p className="text-[9px] text-orange-500/70 mt-0.5">
                      {m.toolData.distrito} · ~{m.toolData.distancia} km
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-emerald-500 shrink-0 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} ${m.role === "user" ? "msg-right" : "msg-left"}`}>
              <div className="max-w-[85%]">
                <div
                  className={`px-3.5 py-2.5 text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-[#1e3a5f] text-white rounded-2xl rounded-br-sm shadow-sm shadow-[#1e3a5f]/10"
                      : "bg-white/60 backdrop-blur text-[#1e3a5f]/80 rounded-2xl rounded-bl-sm border border-black/[0.04]"
                  }`}
                  dangerouslySetInnerHTML={{ __html: fmt(m.content) }}
                />
                {m.role === "assistant" && m.content.includes("🚌") && (
                  <button
                    onClick={() => handleCopyShare(i, m.content)}
                    className="mt-1.5 flex items-center gap-1 text-[9px] text-[#1e3a5f]/25 hover:text-[#1e3a5f]/60 transition-colors"
                  >
                    {copiedIdx === i ? (
                      <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copiado</>
                    ) : (
                      <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>Compartir</>
                    )}
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {/* Tool call loading */}
        {loading && activeToolCall && (
          <div className="flex justify-start msg-left">
            <div className="max-w-[85%] bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/30 rounded-xl px-3.5 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="relative w-7 h-7 shrink-0">
                  <span className="absolute inset-0 rounded-lg bg-orange-400/20 animate-ping" />
                  <div className="relative w-7 h-7 rounded-lg bg-orange-500/15 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-medium text-orange-700/80">
                    Buscando estacion cercana a <span className="font-bold">&quot;{activeToolCall.lugar}&quot;</span>
                  </p>
                  <p className="text-[9px] text-orange-400/70 mt-0.5" style={{ animation: "pulse-soft 1.5s ease-in-out infinite" }}>
                    Consultando mapa...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Normal loading */}
        {loading && !activeToolCall && (
          <div className="flex justify-start msg-left">
            <div className="bg-white/60 backdrop-blur rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2.5 border border-black/[0.04]">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-[#1e3a5f]/30 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-[#1e3a5f]/30 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-1.5 h-1.5 bg-[#1e3a5f]/30 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
              <span className="text-[10px] text-[#1e3a5f]/30" style={{ animation: "pulse-soft 1.5s ease-in-out infinite" }}>Wari esta pensando...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-2.5 border-t border-black/[0.04] flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="¿A donde quieres ir?"
          className="flex-1 bg-white/50 backdrop-blur rounded-xl px-3.5 py-2.5 text-sm text-[#1e3a5f] outline-none border border-black/[0.05] focus:border-[#1e3a5f]/20 focus:ring-2 focus:ring-[#1e3a5f]/5 focus:bg-white/80 transition-all placeholder:text-[#1e3a5f]/25"
          disabled={loading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          className="w-10 h-10 rounded-xl bg-[#1e3a5f] text-white flex items-center justify-center hover:bg-[#162d4a] active:scale-95 disabled:opacity-20 transition-all shadow-sm shadow-[#1e3a5f]/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
