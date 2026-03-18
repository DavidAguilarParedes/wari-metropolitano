export interface Alimentador {
  name: string;
  terminal: string;
  zone: "sur" | "norte" | "los_incas" | "chimpu_ocllo" | "universidad";
  mapUrl: string;
}

const BASE = "https://portal.atu.gob.pe/QR/Alimentadores";

export const ALIMENTADORES: Alimentador[] = [
  // Sur (Matellini)
  { name: "América", terminal: "Matellini", zone: "sur", mapUrl: `${BASE}/AlimentadoresSur/America/America1.jpg` },
  { name: "Cedros de Villa", terminal: "Matellini", zone: "sur", mapUrl: `${BASE}/AlimentadoresSur/CedrosDeVilla/CedrosDeVilla1.jpg` },
  { name: "Los Próceres", terminal: "Matellini", zone: "sur", mapUrl: `${BASE}/AlimentadoresSur/LosProceres/LosProceres1.jpg` },
  { name: "Villa El Salvador", terminal: "Matellini", zone: "sur", mapUrl: `${BASE}/AlimentadoresSur/VillaElSalvador/VillaElSalvador1.jpg` },
  // Norte (Naranjal)
  { name: "Antúnez de Mayolo", terminal: "Naranjal", zone: "norte", mapUrl: `${BASE}/AlimentadoresNorte/AntunezDeMayolo/AntunezDeMayolo1.jpg` },
  { name: "Belaúnde", terminal: "Naranjal", zone: "norte", mapUrl: `${BASE}/AlimentadoresNorte/Belaunde/Belaunde1.jpg` },
  { name: "Bertello", terminal: "Naranjal", zone: "norte", mapUrl: `${BASE}/AlimentadoresNorte/Bertello/Bertello1.jpg` },
  { name: "Izaguirre", terminal: "Naranjal", zone: "norte", mapUrl: `${BASE}/AlimentadoresNorte/Izaguirre/Izaguirre1.jpg` },
  { name: "La Ensenada", terminal: "Naranjal", zone: "norte", mapUrl: `${BASE}/AlimentadoresNorte/LaEnsenada/LaEnsenada1.jpg` },
  { name: "Los Alisos", terminal: "Naranjal", zone: "norte", mapUrl: `${BASE}/AlimentadoresNorte/LosAlisos/LosAlisos1.jpg` },
  { name: "Los Olivos", terminal: "Naranjal", zone: "norte", mapUrl: `${BASE}/AlimentadoresNorte/LosOlivos/LosOlivos1.jpg` },
  { name: "Milagro de Jesús", terminal: "Naranjal", zone: "norte", mapUrl: `${BASE}/AlimentadoresNorte/MilagroDeJesus/MilagroDeJesus1.jpg` },
  { name: "Payet", terminal: "Naranjal", zone: "norte", mapUrl: `${BASE}/AlimentadoresNorte/Payet/Payet1.jpg` },
  { name: "Puente Piedra", terminal: "Naranjal", zone: "norte", mapUrl: `${BASE}/AlimentadoresNorte/PuentePiedra/PuentePiedra1.jpg` },
  { name: "Puno", terminal: "Naranjal", zone: "norte", mapUrl: `${BASE}/AlimentadoresNorte/Puno/Puno1.jpg` },
  { name: "Tahuantinsuyo", terminal: "Naranjal", zone: "norte", mapUrl: `${BASE}/AlimentadoresNorte/Tahuantinsuyo/Tahuantinsuyo1.jpg` },
  { name: "Trapiche", terminal: "Universidad", zone: "universidad", mapUrl: `${BASE}/AlimentadoresUniversidad/Trapiche/Trapiche1.jpg` },
  // Los Incas
  { name: "Carabayllo", terminal: "Los Incas", zone: "los_incas", mapUrl: `${BASE}/AlimentadoresLosIncas/Carabayllo/Carabayllo1.jpg` },
  { name: "Collique", terminal: "Los Incas", zone: "los_incas", mapUrl: `${BASE}/AlimentadoresLosIncas/Collique/Collique1.jpg` },
  { name: "Torre Blanca", terminal: "Los Incas", zone: "los_incas", mapUrl: `${BASE}/AlimentadoresLosIncas/TorreBlanca/TorreBlanca1.jpg` },
  // Chimpu Ocllo
  { name: "San Juan de Dios", terminal: "Chimpu Ocllo", zone: "chimpu_ocllo", mapUrl: `${BASE}/AlimentadoresChimpuOcllo/SanJuanDeDios/SanJuanDeDios1.jpg` },
  { name: "Universitaria", terminal: "Chimpu Ocllo", zone: "chimpu_ocllo", mapUrl: `${BASE}/AlimentadoresChimpuOcllo/Universitaria/Universitaria1.jpg` },
];

export const TRONCAL_MAPS: Record<string, string> = {
  "Ruta A": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/A-REGULAR.png",
  "Ruta B": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/nuevo-Regular-B-QR.jpg",
  "Ruta C": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/REGULAR-C-QR.png",
  "Ruta D": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/D-REGULAR.png",
  "Expreso 1 (N→S)": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/EXPRESO-1AN_NS.jpg",
  "Expreso 1 (S→N)": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/EXPRESO-1AN_SN.jpg",
  "Expreso 2 (N→S)": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/EXPRESO-2A_NS.jpg",
  "Expreso 2 (S→N)": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/EXPRESO-2A_SN.jpg",
  "Expreso 3": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/EXPRESO-3A.png",
  "Expreso 5": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/Nuevo-mapa-EX5_2024.jpg",
  "Expreso 6": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/EXPRESO-6.png",
  "Expreso 7": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/EXPRESO-7.png",
  "Expreso 8": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/nuevo-EX8-QR.jpg",
  "Expreso 9 (N→S)": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/EXPRESO-9N_NS.jpg",
  "Expreso 9 (S→N)": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/EXPRESO-9N_SN.jpg",
  "Expreso 10": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/EXPRESO-10.png",
  "Expreso 12": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/EX12.jpg",
  "Super Expreso SX": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/Nuevo-mapa-SX_2024.jpg",
  "Super Expreso SXN (S→N)": "https://portal.atu.gob.pe/QR/Metropolitano/imagenes/SXN-SN-M.png",
};
