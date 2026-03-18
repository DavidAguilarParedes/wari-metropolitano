"use client";

import { useState } from "react";
import { ALIMENTADORES } from "@/app/lib/alimentadores";

const TERMINALS = [
  { name: "Naranjal", zone: "norte" as const, color: "#1e3a5f" },
  { name: "Matellini", zone: "sur" as const, color: "#4a90d9" },
  { name: "Chimpu Ocllo", zone: "chimpu_ocllo" as const, color: "#8b5cf6" },
  { name: "Los Incas", zone: "los_incas" as const, color: "#e8792b" },
  { name: "Universidad", zone: "universidad" as const, color: "#059669" },
];

const ROADMAP = [
  { icon: "🗺️", text: "Rutas de alimentadores en el mapa", status: "soon" },
  { icon: "🚍", text: "Corredores complementarios de la ATU", status: "planned" },
  { icon: "⏱️", text: "Horarios en tiempo real", status: "planned" },
];

export default function RoutesPanel() {
  const [selectedMap, setSelectedMap] = useState<{ name: string; url: string } | null>(null);
  const [activeTerminal, setActiveTerminal] = useState<string | null>(null);

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="px-3 py-2.5 border-b border-black/[0.04] shrink-0">
          <span className="text-xs text-[#1e3a5f]/35 font-semibold">Alimentadores</span>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {TERMINALS.map((t) => {
            const routes = ALIMENTADORES.filter(
              (a) => a.zone === t.zone || a.terminal === t.name
            );
            if (routes.length === 0) return null;
            const isOpen = activeTerminal === t.name;
            return (
              <div key={t.name}>
                <button
                  onClick={() => setActiveTerminal(isOpen ? null : t.name)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ background: t.color }}
                    />
                    <span className="text-[13px] font-semibold text-[#1e3a5f]/70">
                      {t.name}
                    </span>
                    <span className="text-[10px] text-[#1e3a5f]/25 bg-[#1e3a5f]/[0.04] px-1.5 py-0.5 rounded-full">
                      {routes.length} rutas
                    </span>
                  </div>
                  <svg
                    className={`w-3.5 h-3.5 text-[#1e3a5f]/25 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`accordion-content ${isOpen ? "open" : ""}`}>
                  <div className="accordion-inner">
                    <div className="ml-5 mt-1 mb-2 space-y-0.5">
                      {routes.map((r) => (
                        <button
                          key={r.name}
                          onClick={() => setSelectedMap({ name: r.name, url: r.mapUrl })}
                          className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg hover:bg-white/60 transition-all text-left group"
                        >
                          <span className="text-[12px] text-[#1e3a5f]/40 group-hover:text-[#1e3a5f] transition-colors">
                            {r.name}
                          </span>
                          <svg className="w-3 h-3 text-[#1e3a5f]/10 group-hover:text-[#1e3a5f]/40 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/* Roadmap */}
        <div className="px-3 py-3 border-t border-black/[0.04] shrink-0 space-y-2">
          <div className="bg-[#1e3a5f]/[0.04] rounded-xl px-3 py-3">
            <p className="text-[10px] font-bold text-[#1e3a5f]/50 mb-2 uppercase tracking-wider">Proximamente</p>
            <div className="space-y-2">
              {ROADMAP.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs">{item.icon}</span>
                  <span className="text-[11px] text-[#1e3a5f]/50 flex-1">{item.text}</span>
                  <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${
                    item.status === "soon"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-[#1e3a5f]/[0.05] text-[#1e3a5f]/30"
                  }`}>
                    {item.status === "soon" ? "PRONTO" : "PLANEADO"}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[8px] text-[#1e3a5f]/20 text-center">
            Mapas oficiales de la ATU
          </p>
        </div>
      </div>

      {/* Map modal */}
      {selectedMap && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedMap(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-black/[0.04]">
              <div>
                <h3 className="text-sm font-bold text-[#1e3a5f]">
                  {selectedMap.name}
                </h3>
                <p className="text-[10px] text-[#1e3a5f]/30">Mapa de ruta del alimentador</p>
              </div>
              <button
                onClick={() => setSelectedMap(null)}
                className="w-7 h-7 rounded-full hover:bg-[#1e3a5f]/[0.05] flex items-center justify-center transition"
              >
                <svg className="w-4 h-4 text-[#1e3a5f]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-auto max-h-[calc(85vh-52px)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedMap.url}
                alt={`Mapa alimentador ${selectedMap.name}`}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
