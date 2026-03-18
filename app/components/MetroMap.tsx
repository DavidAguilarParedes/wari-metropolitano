"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { STATIONS, Station } from "@/app/lib/stations";
import { ALIMENTADORES } from "@/app/lib/alimentadores";

interface MetroMapProps {
  userLocation: { lat: number; lng: number } | null;
  nearestStation: Station | null;
  onStationClick: (station: Station) => void;
}

const BLUE = "#1e3a5f";
const BLUE_LIGHT = "#4a90d9";
const ORANGE = "#e8792b";

const TERMINAL_ALIMENTADORES: Record<string, number> = {
  Naranjal: 7,
  Matellini: 44,
  "Chimpu Ocllo": 1,
  "Los Incas": 2,
  Universidad: 6,
};

export default function MetroMap({ userLocation, nearestStation, onStationClick }: MetroMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, { zoomControl: false }).setView([-12.05, -77.038], 12);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 19,
    }).addTo(map);

    const byId = (id: number) => STATIONS.find((s) => s.id === id)!;
    const coord = (s: Station): [number, number] => [s.lat, s.lng];
    const range = (from: number, to: number) =>
      STATIONS.filter((s) => s.id >= from && s.id <= to).map(coord);

    // Extension (dashed)
    L.polyline(range(1, 7), { color: BLUE, weight: 3, opacity: 0.4, dashArray: "6 5" }).addTo(map);
    // Norte
    L.polyline(range(7, 17), { color: BLUE, weight: 4, opacity: 0.8 }).addTo(map);
    // Ramal A
    L.polyline([coord(byId(17)), ...range(18, 21), coord(byId(25))], { color: ORANGE, weight: 4, opacity: 0.8 }).addTo(map);
    // Ramal B
    L.polyline([coord(byId(17)), ...range(22, 24), coord(byId(25))], { color: BLUE_LIGHT, weight: 4, opacity: 0.8 }).addTo(map);
    // Sur
    L.polyline(range(25, 44), { color: BLUE, weight: 4, opacity: 0.8 }).addTo(map);

    // Station markers
    const terminalIds = [1, 7, 25, 44];
    STATIONS.forEach((station) => {
      const isTerminal = terminalIds.includes(station.id);
      const sz = isTerminal ? 10 : 5;
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:${sz}px;height:${sz}px;background:${isTerminal ? "#fff" : BLUE};border:${isTerminal ? 3 : 2}px solid ${BLUE};border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.2);cursor:pointer;transition:transform 0.2s,box-shadow 0.2s" onmouseover="this.style.transform='scale(1.4)';this.style.boxShadow='0 0 0 4px rgba(30,58,95,0.15),0 2px 8px rgba(0,0,0,.2)'" onmouseout="this.style.transform='scale(1)';this.style.boxShadow='0 1px 4px rgba(0,0,0,.2)'"></div>`,
        iconSize: [sz + 6, sz + 6],
        iconAnchor: [(sz + 6) / 2, (sz + 6) / 2],
      });
      const m = L.marker([station.lat, station.lng], { icon }).addTo(map);
      m.bindTooltip(isTerminal ? `<b>${station.name}</b>` : station.name, {
        permanent: isTerminal,
        direction: station.zone === "centro_b" ? "left" : "right",
        offset: [8, 0],
        className: isTerminal ? "tt tt-term" : "tt",
      });
      m.on("click", () => onStationClick(station));
    });

    // Alimentador badges at terminals
    Object.entries(TERMINAL_ALIMENTADORES).forEach(([terminal, stationId]) => {
      const station = byId(stationId);
      const routes = ALIMENTADORES.filter(
        (a) => a.terminal === terminal
      );
      if (routes.length === 0) return;

      const icon = L.divIcon({
        className: "",
        html: `<div style="background:${ORANGE};color:#fff;font-size:9px;font-weight:700;padding:2px 6px;border-radius:10px;white-space:nowrap;box-shadow:0 2px 8px rgba(232,121,43,.35);border:2px solid #fff;cursor:pointer;transition:transform 0.2s" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">${routes.length} alimentadores</div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 20],
      });

      const m = L.marker([station.lat, station.lng], { icon, zIndexOffset: 900 }).addTo(map);

      const popupHtml = `
        <div style="min-width:180px">
          <div style="background:${BLUE};color:#fff;margin:-10px -12px 8px;padding:10px 12px;border-radius:8px 8px 0 0">
            <div style="font-weight:700;font-size:12px">Alimentadores</div>
            <div style="font-size:10px;opacity:0.8">Desde ${terminal}</div>
          </div>
          ${routes.map((r) =>
            `<div style="display:flex;align-items:center;gap:8px;padding:4px 0">
              <div style="width:6px;height:6px;background:${ORANGE};border-radius:50%;flex-shrink:0"></div>
              <span style="font-size:11px;color:#334155;font-weight:500">${r.name}</span>
            </div>`
          ).join("")}
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid #e2e8f0;font-size:9px;color:#94a3b8">
            Tarifa: S/ 1.00 - S/ 1.50 · Integrada: S/ 3.50
          </div>
        </div>
      `;

      m.bindPopup(popupHtml, {
        className: "alim-popup",
        maxWidth: 240,
      });
    });

    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;
    const icon = L.divIcon({
      className: "",
      html: `<div style="width:14px;height:14px;background:#3b82f6;border:3px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(59,130,246,.3)"></div>`,
      iconSize: [20, 20], iconAnchor: [10, 10],
    });
    const m = L.marker([userLocation.lat, userLocation.lng], { icon }).addTo(map);
    m.bindTooltip("Tu ubicacion", { permanent: true, direction: "top", offset: [0, -12], className: "tt tt-user" });
    map.setView([userLocation.lat, userLocation.lng], 14);
    return () => { map.removeLayer(m); };
  }, [userLocation]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !nearestStation) return;
    const icon = L.divIcon({
      className: "",
      html: `<div class="pulse-ring"></div>`,
      iconSize: [30, 30], iconAnchor: [15, 15],
    });
    const m = L.marker([nearestStation.lat, nearestStation.lng], { icon }).addTo(map);
    return () => { map.removeLayer(m); };
  }, [nearestStation]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      <style jsx global>{`
        .tt{background:#fff;border:none;border-radius:6px;padding:3px 8px;font-size:11px;font-weight:500;box-shadow:0 2px 8px rgba(0,0,0,.1);color:#334155}
        .tt-term{font-weight:700;background:${BLUE};color:#fff;border-radius:8px;padding:4px 10px;box-shadow:0 2px 10px rgba(30,58,95,.3)}
        .tt-user{background:#3b82f6;color:#fff;font-weight:600;border:none;border-radius:8px;box-shadow:0 2px 10px rgba(59,130,246,.3)}
        .pulse-ring{width:28px;height:28px;border-radius:50%;border:3px solid ${ORANGE};background:rgba(232,121,43,.15);animation:pa 1.5s cubic-bezier(0.22,1,0.36,1) infinite}
        @keyframes pa{0%,100%{transform:scale(.8);opacity:1}50%{transform:scale(1.4);opacity:.3}}
        .alim-popup .leaflet-popup-content-wrapper{border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.12);padding:0;overflow:hidden}
        .alim-popup .leaflet-popup-content{margin:10px 12px}
        .alim-popup .leaflet-popup-tip{box-shadow:0 2px 8px rgba(0,0,0,.08)}
      `}</style>
    </div>
  );
}
