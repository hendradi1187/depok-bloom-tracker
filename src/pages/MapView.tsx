import Layout from "@/components/Layout";
import { useEffect, useRef, useState } from "react";
import { Layers, Eye, EyeOff } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MOCK_PLANTS } from "@/data/mockData";

const DEPOK_CENTER: [number, number] = [-6.4025, 106.7942];

// Approximate lat/lng for mock plant locations
const plantCoordinates: Record<string, [number, number]> = {
  "1": [-6.422, 106.813], // Pancoran Mas
  "2": [-6.383, 106.853], // Sukmajaya
  "3": [-6.395, 106.822], // Beji
  "4": [-6.361, 106.893], // Cimanggis
  "5": [-6.406, 106.776], // Limo
  "6": [-6.448, 106.744], // Sawangan
};

// 11 Kecamatan Kota Depok (simplified polygons)
const kecamatanZones = [
  {
    name: "Kec. Sawangan",
    color: "#22c55e",
    luasKm2: "26.56",
    bounds: [[-6.430, 106.708], [-6.430, 106.780], [-6.466, 106.780], [-6.466, 106.708]] as [number, number][],
  },
  {
    name: "Kec. Bojongsari",
    color: "#16a34a",
    luasKm2: "16.59",
    bounds: [[-6.415, 106.740], [-6.415, 106.795], [-6.455, 106.795], [-6.455, 106.740]] as [number, number][],
  },
  {
    name: "Kec. Limo",
    color: "#15803d",
    luasKm2: "16.07",
    bounds: [[-6.380, 106.750], [-6.380, 106.800], [-6.430, 106.800], [-6.430, 106.750]] as [number, number][],
  },
  {
    name: "Kec. Cinere",
    color: "#4ade80",
    luasKm2: "8.40",
    bounds: [[-6.360, 106.763], [-6.360, 106.815], [-6.400, 106.815], [-6.400, 106.763]] as [number, number][],
  },
  {
    name: "Kec. Beji",
    color: "#86efac",
    luasKm2: "14.43",
    bounds: [[-6.375, 106.800], [-6.375, 106.845], [-6.420, 106.845], [-6.420, 106.800]] as [number, number][],
  },
  {
    name: "Kec. Depok",
    color: "#34d399",
    luasKm2: "16.31",
    bounds: [[-6.378, 106.810], [-6.378, 106.855], [-6.418, 106.855], [-6.418, 106.810]] as [number, number][],
  },
  {
    name: "Kec. Pancoran Mas",
    color: "#10b981",
    luasKm2: "21.30",
    bounds: [[-6.400, 106.790], [-6.400, 106.840], [-6.445, 106.840], [-6.445, 106.790]] as [number, number][],
  },
  {
    name: "Kec. Cipayung",
    color: "#059669",
    luasKm2: "15.00",
    bounds: [[-6.400, 106.820], [-6.400, 106.870], [-6.445, 106.870], [-6.445, 106.820]] as [number, number][],
  },
  {
    name: "Kec. Sukmajaya",
    color: "#047857",
    luasKm2: "17.35",
    bounds: [[-6.365, 106.830], [-6.365, 106.880], [-6.415, 106.880], [-6.415, 106.830]] as [number, number][],
  },
  {
    name: "Kec. Cimanggis",
    color: "#065f46",
    luasKm2: "30.12",
    bounds: [[-6.319, 106.865], [-6.319, 106.933], [-6.400, 106.933], [-6.400, 106.865]] as [number, number][],
  },
  {
    name: "Kec. Tapos",
    color: "#064e3b",
    luasKm2: "31.27",
    bounds: [[-6.370, 106.870], [-6.370, 106.933], [-6.440, 106.933], [-6.440, 106.870]] as [number, number][],
  },
];

// RTH (Ruang Terbuka Hijau) notable areas
const rthAreas = [
  {
    name: "Situ Cilodong",
    jenis: "Situ / Danau",
    color: "#0ea5e9",
    bounds: [[-6.390, 106.828], [-6.390, 106.835], [-6.398, 106.835], [-6.398, 106.828]] as [number, number][],
  },
  {
    name: "Situ Pengasinan",
    jenis: "Situ / Danau",
    color: "#0ea5e9",
    bounds: [[-6.435, 106.758], [-6.435, 106.768], [-6.443, 106.768], [-6.443, 106.758]] as [number, number][],
  },
  {
    name: "Situ Citayam",
    jenis: "Situ / Danau",
    color: "#0ea5e9",
    bounds: [[-6.438, 106.818], [-6.438, 106.826], [-6.446, 106.826], [-6.446, 106.818]] as [number, number][],
  },
  {
    name: "Situ Rawa Besar",
    jenis: "Situ / Danau",
    color: "#0ea5e9",
    bounds: [[-6.398, 106.818], [-6.398, 106.825], [-6.405, 106.825], [-6.405, 106.818]] as [number, number][],
  },
  {
    name: "Taman Kota Depok",
    jenis: "Taman Kota",
    color: "#84cc16",
    bounds: [[-6.393, 106.818], [-6.393, 106.823], [-6.398, 106.823], [-6.398, 106.818]] as [number, number][],
  },
  {
    name: "Hutan Kota Mekarsari",
    jenis: "Hutan Kota",
    color: "#166534",
    bounds: [[-6.350, 106.895], [-6.350, 106.910], [-6.362, 106.910], [-6.362, 106.895]] as [number, number][],
  },
];

// Category icon config
const categoryIcons: Record<string, { color: string; symbol: string; label: string }> = {
  "Pohon Hias":         { color: "#16a34a", symbol: "P", label: "Pohon Hias" },
  "Perdu":              { color: "#4ade80", symbol: "S", label: "Perdu" },
  "Bunga Potong":       { color: "#f43f5e", symbol: "B", label: "Bunga Potong" },
  "Tanaman Merambat":   { color: "#f97316", symbol: "M", label: "Tanaman Merambat" },
  "Sukulen":            { color: "#84cc16", symbol: "U", label: "Sukulen" },
  "Tanaman Air":        { color: "#0ea5e9", symbol: "A", label: "Tanaman Air" },
  default:              { color: "#22c55e", symbol: "T", label: "Tanaman" },
};

function createPlantIcon(category?: string) {
  const cfg = categoryIcons[category ?? ""] ?? categoryIcons.default;
  return L.divIcon({
    className: "",
    html: `<div style="
      width:26px;height:26px;border-radius:50%;
      background:${cfg.color}33;border:2px solid ${cfg.color};
      display:flex;align-items:center;justify-content:center;
      color:${cfg.color};font-size:11px;font-weight:700;font-family:monospace;
    ">${cfg.symbol}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -14],
  });
}

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const layerGroups = useRef<Record<string, L.LayerGroup>>({});

  const [layers, setLayers] = useState({
    kecamatan: true,
    rth: true,
    tanaman: true,
  });

  // Initialize map once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      center: DEPOK_CENTER,
      zoom: 13,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);

    // -- Kecamatan layer
    const kecGroup = L.layerGroup();
    kecamatanZones.forEach((zone) => {
      L.polygon(zone.bounds as L.LatLngExpression[], {
        color: zone.color,
        fillColor: zone.color,
        fillOpacity: 0.12,
        weight: 2,
        dashArray: "6,4",
      })
        .bindPopup(`<b>${zone.name}</b><br/>Luas: ±${zone.luasKm2} km²`)
        .addTo(kecGroup);
    });
    kecGroup.addTo(map);
    layerGroups.current.kecamatan = kecGroup;

    // -- RTH layer
    const rthGroup = L.layerGroup();
    rthAreas.forEach((area) => {
      L.polygon(area.bounds as L.LatLngExpression[], {
        color: area.color,
        fillColor: area.color,
        fillOpacity: 0.35,
        weight: 2,
      })
        .bindPopup(`<b>${area.name}</b><br/>Jenis: ${area.jenis}`)
        .addTo(rthGroup);
    });
    rthGroup.addTo(map);
    layerGroups.current.rth = rthGroup;

    // -- Tanaman layer (mock plants with approximate coordinates)
    const tanamanGroup = L.layerGroup();
    MOCK_PLANTS.forEach((plant) => {
      const coords = plantCoordinates[plant.id];
      if (!coords) return;
      const icon = createPlantIcon(plant.category);
      L.marker(coords, { icon })
        .bindPopup(
          `<div style="min-width:140px">
            <p style="font-weight:700;margin:0 0 2px">${plant.common_name}</p>
            <p style="font-style:italic;font-size:11px;color:#6b7280;margin:0 0 4px">${plant.latin_name}</p>
            <p style="font-size:12px;margin:0 0 4px">${plant.location}</p>
            <a href="/plant/${plant.id}" style="font-size:12px;color:#16a34a;">Lihat detail →</a>
          </div>`
        )
        .addTo(tanamanGroup);
    });
    tanamanGroup.addTo(map);
    layerGroups.current.tanaman = tanamanGroup;

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  // Toggle layer visibility
  useEffect(() => {
    if (!mapInstance.current) return;
    Object.entries(layers).forEach(([key, visible]) => {
      const group = layerGroups.current[key];
      if (!group) return;
      if (visible) mapInstance.current!.addLayer(group);
      else mapInstance.current!.removeLayer(group);
    });
  }, [layers]);

  const toggleLayer = (key: keyof typeof layers) =>
    setLayers((prev) => ({ ...prev, [key]: !prev[key] }));

  const layerConfig = [
    { key: "kecamatan" as const, label: "Kecamatan",  color: "#22c55e" },
    { key: "rth"       as const, label: "RTH / Situ", color: "#0ea5e9" },
    { key: "tanaman"   as const, label: "Tanaman",     color: "#f97316" },
  ];

  return (
    <Layout>
      <div className="relative" style={{ height: "calc(100vh - 64px)" }}>
        {/* Map container */}
        <div ref={mapRef} className="w-full h-full z-0" />

        {/* Header info */}
        <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur rounded-xl shadow px-4 py-2">
          <p className="font-semibold text-sm text-gray-800">Peta Hijau Kota Depok</p>
          <p className="text-xs text-gray-500">11 Kecamatan · RTH · Tanaman Terdaftar</p>
        </div>

        {/* Layer controls */}
        <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur rounded-xl shadow p-3 space-y-1.5 w-44">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-2">
            <Layers className="h-3.5 w-3.5 text-green-600" />
            Layer
          </div>
          {layerConfig.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => toggleLayer(key)}
              className="flex items-center gap-2 w-full text-xs py-1 px-1 rounded hover:bg-gray-100 transition-colors"
            >
              {layers[key] ? (
                <Eye className="h-3.5 w-3.5" style={{ color }} />
              ) : (
                <EyeOff className="h-3.5 w-3.5 text-gray-400" />
              )}
              <span className={layers[key] ? "text-gray-700" : "text-gray-400"}>
                {label}
              </span>
              {key === "tanaman" && (
                <span className="ml-auto text-[10px] text-gray-400">
                  {MOCK_PLANTS.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-4 z-[1000] bg-white/90 backdrop-blur rounded-xl shadow p-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mb-2">
            Legenda Tanaman
          </p>
          <div className="space-y-1.5">
            {Object.entries(categoryIcons).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-content:center text-[9px] font-bold font-mono flex-shrink-0 flex items-center justify-center"
                  style={{ background: `${cfg.color}33`, border: `1.5px solid ${cfg.color}`, color: cfg.color }}
                >
                  {cfg.symbol}
                </div>
                <span className="text-[11px] text-gray-600">{cfg.label}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 my-1.5 pt-1.5 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-3 rounded flex-shrink-0" style={{ background: "#22c55e33", border: "1.5px dashed #22c55e" }} />
                <span className="text-[11px] text-gray-600">Kecamatan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-3 rounded flex-shrink-0" style={{ background: "#0ea5e955", border: "1.5px solid #0ea5e9" }} />
                <span className="text-[11px] text-gray-600">RTH / Situ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-3 rounded flex-shrink-0" style={{ background: "#84cc1655", border: "1.5px solid #84cc16" }} />
                <span className="text-[11px] text-gray-600">Taman Kota</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
