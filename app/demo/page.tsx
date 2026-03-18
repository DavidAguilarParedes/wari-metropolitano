"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import Chat from "@/app/components/Chat";
import RoutesPanel from "@/app/components/RoutesPanel";
import TroncalRoutes from "@/app/components/TroncalRoutes";
import { Station } from "@/app/lib/stations";

function WariLogo({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className={className}>
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path d="M10 16h10m0 0l-4-4m4 4l-4 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="8" cy="16" r="1.5" fill="white" opacity="0.5" />
    </svg>
  );
}

const MetroMap = dynamic(() => import("@/app/components/MetroMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#eef1f5] flex items-center justify-center">
      <div className="w-8 h-8 rounded-lg animate-shimmer" />
    </div>
  ),
});

export default function DemoPage() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearestStation, setNearestStation] = useState<Station | null>(null);
  const [stationFromMap, setStationFromMap] = useState<Station | null>(null);
  const [leftTab, setLeftTab] = useState<"mapa" | "rutas" | "alimentadores">("mapa");
  const [showMapOverlay, setShowMapOverlay] = useState(false);

  const handleLocationFound = useCallback((lat: number, lng: number, station: Station) => {
    setUserLocation({ lat, lng });
    setNearestStation(station);
  }, []);
  const handleStationClick = useCallback((station: Station) => setStationFromMap(station), []);
  const handleStationConsumed = useCallback(() => setStationFromMap(null), []);

  return (
    <div className="h-screen flex flex-col bg-[#eef1f5]">
      {/* Header */}
      <header className="shrink-0 animate-fade-in">
        <div className="m-2 sm:m-3 bg-white/70 backdrop-blur-2xl rounded-2xl border border-black/[0.05] shadow-sm">
          <div className="px-4 sm:px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/"
                className="w-9 h-9 rounded-xl bg-[#1e3a5f]/[0.06] hover:bg-[#1e3a5f]/[0.1] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                title="Volver a inicio"
              >
                <svg className="w-4 h-4 text-[#1e3a5f]/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div className="h-6 w-px bg-black/[0.06] hidden sm:block" />
              <div className="flex items-center gap-3">
                <WariLogo size={40} className="text-[#1e3a5f] shadow-md shadow-[#1e3a5f]/10 rounded-xl" />
                <div>
                  <h1 className="text-base sm:text-lg font-extrabold leading-none tracking-tight text-[#1e3a5f]">Wari</h1>
                  <p className="text-[10px] text-[#1e3a5f]/35 mt-0.5 font-medium">Tu guia del Metropolitano</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:flex items-center gap-4 text-[10px] text-[#1e3a5f]/35 font-medium">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1e3a5f]/40" />
                  44 estaciones
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500/60" />
                  18 rutas
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                  22 alimentadores
                </span>
              </div>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-600 px-3 py-1 rounded-full font-bold tracking-wide">LIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0 mx-2 sm:mx-3 mb-2 sm:mb-3 gap-2 sm:gap-3">
        {/* Left: Map / Routes (desktop) */}
        <div className="hidden lg:flex flex-col min-h-0 bg-white/70 backdrop-blur-xl rounded-2xl border border-black/[0.05] overflow-hidden shadow-sm">
          <div className="flex border-b border-black/[0.04] shrink-0 relative">
            <div
              className="absolute bottom-0 h-[2px] bg-[#1e3a5f] transition-all duration-300 ease-out rounded-full"
              style={{ width: "33.33%", left: leftTab === "mapa" ? "0%" : leftTab === "rutas" ? "33.33%" : "66.66%" }}
            />
            <button
              onClick={() => setLeftTab("mapa")}
              className={`flex-1 py-3 text-[11px] font-semibold transition-all ${leftTab === "mapa" ? "text-[#1e3a5f]" : "text-[#1e3a5f]/30"}`}
            >
              Mapa
            </button>
            <button
              onClick={() => setLeftTab("rutas")}
              className={`flex-1 py-3 text-[11px] font-semibold transition-all ${leftTab === "rutas" ? "text-[#1e3a5f]" : "text-[#1e3a5f]/30"}`}
            >
              Rutas
            </button>
            <button
              onClick={() => setLeftTab("alimentadores")}
              className={`flex-1 py-3 text-[11px] font-semibold transition-all ${leftTab === "alimentadores" ? "text-[#1e3a5f]" : "text-[#1e3a5f]/30"}`}
            >
              Alimentadores
            </button>
          </div>
          <div className="flex-1 min-h-0">
            {leftTab === "mapa" ? (
              <MetroMap userLocation={userLocation} nearestStation={nearestStation} onStationClick={handleStationClick} />
            ) : leftTab === "rutas" ? (
              <TroncalRoutes />
            ) : (
              <RoutesPanel />
            )}
          </div>
        </div>

        {/* Right: Chat */}
        <div className="flex flex-col min-h-0 bg-white/70 backdrop-blur-xl rounded-2xl border border-black/[0.05] overflow-hidden shadow-sm">
          <Chat onLocationFound={handleLocationFound} stationFromMap={stationFromMap} onStationFromMapConsumed={handleStationConsumed} />
        </div>
      </main>

      {/* Footer */}
      <footer className="shrink-0 px-5 py-2 flex items-center justify-between">
        <p className="text-[10px] text-[#1e3a5f]/25">
          Por <a href="https://www.linkedin.com/in/aguilardavidp/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1e3a5f]/40 hover:text-[#1e3a5f]/70 transition-colors">David Aguilar</a> · AI Engineer
        </p>
        <p className="text-[10px] text-[#1e3a5f]/25">Next.js + GPT-4.1-mini + Leaflet</p>
      </footer>

      {/* Mobile FAB */}
      <button
        onClick={() => setShowMapOverlay(true)}
        className="lg:hidden fixed bottom-12 right-4 z-40 w-13 h-13 rounded-2xl bg-[#1e3a5f] text-white shadow-xl shadow-[#1e3a5f]/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="Ver mapa"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </button>

      {/* Mobile Map Overlay */}
      {showMapOverlay && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#eef1f5] flex flex-col animate-slide-in-overlay">
          <div className="flex items-center justify-between px-4 py-3 shrink-0">
            <div className="flex items-center gap-1.5">
              <button onClick={() => setLeftTab("mapa")} className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all ${leftTab === "mapa" ? "bg-[#1e3a5f] text-white" : "text-[#1e3a5f]/40 hover:text-[#1e3a5f]/60"}`}>Mapa</button>
              <button onClick={() => setLeftTab("rutas")} className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all ${leftTab === "rutas" ? "bg-[#1e3a5f] text-white" : "text-[#1e3a5f]/40 hover:text-[#1e3a5f]/60"}`}>Rutas</button>
              <button onClick={() => setLeftTab("alimentadores")} className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all ${leftTab === "alimentadores" ? "bg-[#1e3a5f] text-white" : "text-[#1e3a5f]/40 hover:text-[#1e3a5f]/60"}`}>Alimentadores</button>
            </div>
            <button onClick={() => setShowMapOverlay(false)} className="w-8 h-8 rounded-full bg-white/60 hover:bg-white flex items-center justify-center transition-colors">
              <svg className="w-5 h-5 text-[#1e3a5f]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 min-h-0 mx-2 mb-2 rounded-2xl overflow-hidden border border-black/[0.05] bg-white">
            {leftTab === "mapa" ? (
              <MetroMap userLocation={userLocation} nearestStation={nearestStation} onStationClick={(s) => { handleStationClick(s); setShowMapOverlay(false); }} />
            ) : leftTab === "rutas" ? (
              <TroncalRoutes />
            ) : (
              <RoutesPanel />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
