export interface Station {
  id: number;
  name: string;
  zone: "extension" | "norte" | "centro_a" | "centro_b" | "sur";
  district: string;
  lat: number;
  lng: number;
}

// Real coords from mapcarta.com/OSM, interpolated for intermediate stations
export const STATIONS: Station[] = [
  // Extension Carabayllo
  { id: 1, name: "Chimpu Ocllo", zone: "extension", district: "Carabayllo", lat: -11.89695, lng: -77.03769 },
  { id: 2, name: "Los Incas", zone: "extension", district: "Comas", lat: -11.91300, lng: -77.04200 },
  { id: 3, name: "Andrés Belaúnde", zone: "extension", district: "Comas", lat: -11.92700, lng: -77.04600 },
  { id: 4, name: "22 de Agosto", zone: "extension", district: "Comas", lat: -11.94100, lng: -77.04900 },
  { id: 5, name: "Las Vegas", zone: "extension", district: "Comas", lat: -11.95500, lng: -77.05200 },
  { id: 6, name: "Universidad", zone: "extension", district: "Comas", lat: -11.96800, lng: -77.05500 },

  // Norte (Naranjal → Caquetá)
  { id: 7, name: "Naranjal", zone: "norte", district: "Independencia", lat: -11.98171, lng: -77.05884 },
  { id: 8, name: "Izaguirre", zone: "norte", district: "Independencia", lat: -11.98955, lng: -77.05702 },
  { id: 9, name: "Pacífico", zone: "norte", district: "Independencia", lat: -11.99400, lng: -77.05600 },
  { id: 10, name: "Independencia", zone: "norte", district: "Independencia", lat: -11.99800, lng: -77.05500 },
  { id: 11, name: "Los Jazmines", zone: "norte", district: "Independencia", lat: -12.00200, lng: -77.05450 },
  { id: 12, name: "Tomás Valle", zone: "norte", district: "San Martín de Porres", lat: -12.00653, lng: -77.05398 },
  { id: 13, name: "El Milagro", zone: "norte", district: "San Martín de Porres", lat: -12.01200, lng: -77.05250 },
  { id: 14, name: "Honorio Delgado", zone: "norte", district: "San Martín de Porres", lat: -12.01800, lng: -77.05100 },
  { id: 15, name: "UNI", zone: "norte", district: "Rímac", lat: -12.02405, lng: -77.04911 },
  { id: 16, name: "Parque del Trabajo", zone: "norte", district: "Rímac", lat: -12.03050, lng: -77.04650 },
  { id: 17, name: "Caquetá", zone: "norte", district: "Rímac", lat: -12.03653, lng: -77.04364 },

  // Centro Ramal A: Caquetá → R. Castilla → Tacna → J. de la Unión → Colmena → Est. Central
  // (por Lampa / Emancipación)
  { id: 18, name: "Ramón Castilla", zone: "centro_a", district: "Cercado de Lima", lat: -12.04361, lng: -77.04210 },
  { id: 19, name: "Tacna", zone: "centro_a", district: "Cercado de Lima", lat: -12.04637, lng: -77.03754 },
  { id: 20, name: "Jirón de la Unión", zone: "centro_a", district: "Cercado de Lima", lat: -12.04889, lng: -77.03340 },
  { id: 21, name: "Colmena", zone: "centro_a", district: "Cercado de Lima", lat: -12.05228, lng: -77.03284 },

  // Centro Ramal B: Caquetá → 2 de Mayo → Quilca → España → Est. Central
  // (por Alfonso Ugarte)
  { id: 22, name: "2 de Mayo", zone: "centro_b", district: "Cercado de Lima", lat: -12.04567, lng: -77.04281 },
  { id: 23, name: "Quilca", zone: "centro_b", district: "Cercado de Lima", lat: -12.05220, lng: -77.04226 },
  { id: 24, name: "España", zone: "centro_b", district: "Breña", lat: -12.05761, lng: -77.04179 },

  // Estación Central (donde convergen ambos ramales)
  { id: 25, name: "Estación Central", zone: "centro_a", district: "Cercado de Lima", lat: -12.05773, lng: -77.03598 },

  // Sur (Est. Central → Matellini)
  { id: 26, name: "Estadio Nacional", zone: "sur", district: "La Victoria", lat: -12.06853, lng: -77.03214 },
  { id: 27, name: "México", zone: "sur", district: "La Victoria", lat: -12.07400, lng: -77.03050 },
  { id: 28, name: "Canadá", zone: "sur", district: "La Victoria", lat: -12.08000, lng: -77.02800 },
  { id: 29, name: "Javier Prado", zone: "sur", district: "Lince", lat: -12.08935, lng: -77.02352 },
  { id: 30, name: "Canaval y Moreyra", zone: "sur", district: "San Isidro", lat: -12.09661, lng: -77.02499 },
  { id: 31, name: "Aramburú", zone: "sur", district: "San Isidro", lat: -12.10100, lng: -77.02550 },
  { id: 32, name: "Domingo Orué", zone: "sur", district: "Surquillo", lat: -12.10650, lng: -77.02580 },
  { id: 33, name: "Angamos", zone: "sur", district: "Surquillo", lat: -12.11321, lng: -77.02598 },
  { id: 34, name: "Ricardo Palma", zone: "sur", district: "Miraflores", lat: -12.11896, lng: -77.02593 },
  { id: 35, name: "Benavides", zone: "sur", district: "Miraflores", lat: -12.12400, lng: -77.02450 },
  { id: 36, name: "28 de Julio", zone: "sur", district: "Miraflores", lat: -12.12938, lng: -77.02284 },
  { id: 37, name: "Plaza de Flores", zone: "sur", district: "Barranco", lat: -12.13800, lng: -77.02100 },
  { id: 38, name: "Balta", zone: "sur", district: "Barranco", lat: -12.14450, lng: -77.01950 },
  { id: 39, name: "Bulevar", zone: "sur", district: "Barranco", lat: -12.14900, lng: -77.01800 },
  { id: 40, name: "Unión", zone: "sur", district: "Barranco", lat: -12.15400, lng: -77.01650 },
  { id: 41, name: "Escuela Militar", zone: "sur", district: "Chorrillos", lat: -12.15900, lng: -77.01500 },
  { id: 42, name: "Terán", zone: "sur", district: "Chorrillos", lat: -12.16500, lng: -77.01350 },
  { id: 43, name: "Rosario de Villa", zone: "sur", district: "Chorrillos", lat: -12.17200, lng: -77.01150 },
  { id: 44, name: "Matellini", zone: "sur", district: "Chorrillos", lat: -12.17911, lng: -77.00985 },
];

export function findNearestStation(lat: number, lng: number): Station {
  let nearest = STATIONS[0];
  let minDist = Infinity;
  for (const s of STATIONS) {
    const d = Math.sqrt((s.lat - lat) ** 2 + (s.lng - lng) ** 2);
    if (d < minDist) {
      minDist = d;
      nearest = s;
    }
  }
  return nearest;
}
