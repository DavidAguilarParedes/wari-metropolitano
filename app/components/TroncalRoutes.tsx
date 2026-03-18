"use client";

import { useState } from "react";
import { TRONCAL_MAPS } from "@/app/lib/alimentadores";

const ROUTE_INFO: Record<string, { paradas: string; horario: string; tipo: "regular" | "expreso" | "super" }> = {
  "Ruta A": { paradas: "Naranjal ↔ Est. Central (Ramal A)", horario: "L-S 5:00-23:00, Dom 5:00-22:00", tipo: "regular" },
  "Ruta B": { paradas: "Chimpu Ocllo ↔ Est. Central (Ramal B)", horario: "L-S 5:00-23:00, Dom 5:00-22:00", tipo: "regular" },
  "Ruta C": { paradas: "R. Castilla ↔ Matellini", horario: "L-S 5:00-23:00, Dom 5:00-22:00", tipo: "regular" },
  "Ruta D": { paradas: "Naranjal ↔ Est. Central", horario: "L-V 5:00-10:30", tipo: "regular" },
  "Expreso 1 (N→S)": { paradas: "Est. Central → Estadio Nacional → J. Prado → Canaval → Angamos → 28 Jul → Balta → Union → Teran → Matellini", horario: "L-V 5:30-21:00, S-D 6:30-21:00", tipo: "expreso" },
  "Expreso 1 (S→N)": { paradas: "Matellini → Teran → Union → Balta → 28 Jul → Angamos → Canaval → J. Prado → Estadio Nacional → Est. Central", horario: "L-V 5:30-21:00, S-D 6:30-21:00", tipo: "expreso" },
  "Expreso 2 (N→S)": { paradas: "Naranjal → Canada → J. Prado → Ricardo Palma → 28 de Julio", horario: "L-S 5:00-9:00am", tipo: "expreso" },
  "Expreso 2 (S→N)": { paradas: "Ricardo Palma → J. Prado → Canada → Naranjal", horario: "L-S 5:00-9:00pm", tipo: "expreso" },
  "Expreso 3": { paradas: "Naranjal → (directo) → Angamos → Benavides → 28 de Julio", horario: "L-V 5:30-9:00am, Sab 6:00-9:00am", tipo: "expreso" },
  "Expreso 5": { paradas: "Naranjal → Izaguirre → Tomas Valle → UNI → Caqueta → Espana → Est. Central → Canada → J. Prado → Canaval → Angamos → R. Palma → P. Flores", horario: "L-V 9am-5pm, Sab 5:15am-8:20pm", tipo: "expreso" },
  "Expreso 6": { paradas: "Izaguirre → Independencia → Est. Central → J. Prado → Canaval → Angamos → Benavides", horario: "L-V 5:30-10:00am", tipo: "expreso" },
  "Expreso 7": { paradas: "Tomas Valle → Est. Central → J. Prado → Canaval → Angamos", horario: "L-V 5:30-9:00am", tipo: "expreso" },
  "Expreso 8": { paradas: "Izaguirre → Independencia → Tomas Valle → UNI → Est. Central → J. Prado → Canaval → Angamos → Benavides → P. Flores", horario: "L-V 5:00pm-9:00pm", tipo: "expreso" },
  "Expreso 9 (N→S)": { paradas: "UNI → Caqueta → Espana → Est. Central → J. Prado → Canaval → Angamos → Benavides", horario: "L-V 5:30-9:00am", tipo: "expreso" },
  "Expreso 9 (S→N)": { paradas: "P. Flores → Benavides → Angamos → Canaval → J. Prado → Est. Central → Espana → Caqueta → UNI", horario: "L-V 5:30-9:00am", tipo: "expreso" },
  "Expreso 10": { paradas: "Naranjal → Caqueta → R. Castilla → Tacna → J. Union → Colmena → 2 Mayo → Quilca → Espana → Est. Central", horario: "L-V 6:00-9:00am", tipo: "expreso" },
  "Expreso 12": { paradas: "Est. Central → Estadio Nacional → J. Prado → Canaval → Angamos → Benavides", horario: "L-V 5:45-10:00am", tipo: "expreso" },
  "Super Expreso SX": { paradas: "Naranjal → (directo) → Canaval → Aramburu → Angamos → Benavides → 28 de Julio", horario: "L-V 5:30-9:00am, Sab 6:00-9:00am", tipo: "super" },
  "Super Expreso SXN (S→N)": { paradas: "Est. Central → Espana → Quilca → 2 de Mayo → Caqueta → Naranjal", horario: "L-V 5:30-10:00am", tipo: "super" },
};

export default function TroncalRoutes() {
  const [selectedMap, setSelectedMap] = useState<{ name: string; url: string } | null>(null);
  const entries = Object.entries(TRONCAL_MAPS);

  const regulares = entries.filter(([k]) => k.startsWith("Ruta"));
  const expresos = entries.filter(([k]) => k.startsWith("Expreso"));
  const supers = entries.filter(([k]) => k.startsWith("Super"));

  function RouteCard({ name, url }: { name: string; url: string }) {
    const info = ROUTE_INFO[name];
    const typeColor = info?.tipo === "super" ? "bg-purple-500/10 text-purple-600" : info?.tipo === "expreso" ? "bg-orange-500/10 text-orange-600" : "bg-[#1e3a5f]/[0.08] text-[#1e3a5f]";
    const typeLabel = info?.tipo === "super" ? "SUPER" : info?.tipo === "expreso" ? "EXPRESO" : "REGULAR";

    return (
      <button
        onClick={() => setSelectedMap({ name, url })}
        className="w-full text-left p-3 rounded-xl bg-white/50 border border-black/[0.04] hover:bg-white/80 hover:shadow-md hover:shadow-[#1e3a5f]/[0.03] transition-all duration-300 group active:scale-[0.98]"
      >
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${typeColor}`}>{typeLabel}</span>
          <span className="text-[13px] font-bold text-[#1e3a5f] group-hover:text-[#1e3a5f]">{name}</span>
          <svg className="w-3 h-3 ml-auto text-[#1e3a5f]/15 group-hover:text-[#1e3a5f]/40 group-hover:translate-x-0.5 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
        {info && (
          <>
            <p className="text-[11px] text-[#1e3a5f]/40 leading-snug mb-1">{info.paradas}</p>
            <p className="text-[10px] text-[#1e3a5f]/25">⏰ {info.horario}</p>
          </>
        )}
      </button>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col">
        <div className="px-3 py-2.5 border-b border-black/[0.04] shrink-0 flex items-center justify-between">
          <span className="text-xs text-[#1e3a5f]/35 font-semibold">Rutas troncales</span>
          <span className="text-[9px] text-[#1e3a5f]/20 font-medium">{entries.length} con mapa ATU</span>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Regulares */}
          <div>
            <p className="text-[10px] font-bold text-[#1e3a5f]/30 uppercase tracking-wider mb-2 px-1">Regulares</p>
            <div className="space-y-1.5">
              {regulares.map(([name, url]) => <RouteCard key={name} name={name} url={url} />)}
            </div>
          </div>
          {/* Expresos */}
          <div>
            <p className="text-[10px] font-bold text-orange-500/60 uppercase tracking-wider mb-2 px-1">Expresos</p>
            <div className="space-y-1.5">
              {expresos.map(([name, url]) => <RouteCard key={name} name={name} url={url} />)}
            </div>
          </div>
          {/* Super Expresos */}
          {supers.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-purple-500/60 uppercase tracking-wider mb-2 px-1">Super Expresos</p>
              <div className="space-y-1.5">
                {supers.map(([name, url]) => <RouteCard key={name} name={name} url={url} />)}
              </div>
            </div>
          )}

          {/* Routes without maps */}
          <div className="bg-[#1e3a5f]/[0.03] rounded-xl px-3 py-3">
            <p className="text-[10px] font-bold text-[#1e3a5f]/30 mb-2">Sin mapa ATU disponible:</p>
            <div className="flex flex-wrap gap-1">
              {["Expreso 11", "Expreso 13"].map((name) => (
                <span key={name} className="text-[9px] text-[#1e3a5f]/25 bg-[#1e3a5f]/[0.04] px-2 py-0.5 rounded-full">{name}</span>
              ))}
            </div>
          </div>
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
                <h3 className="text-sm font-bold text-[#1e3a5f]">{selectedMap.name}</h3>
                <p className="text-[10px] text-[#1e3a5f]/30">Mapa oficial ATU</p>
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
                alt={`Mapa ${selectedMap.name}`}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
