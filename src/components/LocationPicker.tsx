import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { MapPin, Crosshair, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const DEPOK_CENTER: [number, number] = [-6.4025, 106.7942]

// Custom marker icon
function createPickerIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:36px;height:36px;
      display:flex;align-items:center;justify-content:center;
      transform:translate(-50%, -100%);
    ">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#16a34a" stroke="#fff" stroke-width="1.5"/>
        <circle cx="12" cy="9" r="2.5" fill="#fff"/>
      </svg>
    </div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
  })
}

interface LocationPickerProps {
  latitude: number | null
  longitude: number | null
  onChange: (lat: number, lng: number) => void
  className?: string
}

export default function LocationPicker({
  latitude,
  longitude,
  onChange,
  className = "",
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)

  // Koordinat awal: dari props atau default Depok
  const initialLat = latitude ?? DEPOK_CENTER[0]
  const initialLng = longitude ?? DEPOK_CENTER[1]

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      center: [initialLat, initialLng],
      zoom: latitude && longitude ? 16 : 13,
      zoomControl: false,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OSM",
      maxZoom: 19,
    }).addTo(map)

    // Zoom control di kanan bawah
    L.control.zoom({ position: "bottomright" }).addTo(map)

    // Marker draggable
    const marker = L.marker([initialLat, initialLng], {
      icon: createPickerIcon(),
      draggable: true,
    }).addTo(map)

    // Update koordinat saat marker di-drag
    marker.on("dragend", () => {
      const pos = marker.getLatLng()
      onChange(pos.lat, pos.lng)
    })

    // Klik pada peta untuk pindahkan marker
    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng)
      onChange(e.latlng.lat, e.latlng.lng)
    })

    mapInstance.current = map
    markerRef.current = marker

    return () => {
      map.remove()
      mapInstance.current = null
      markerRef.current = null
    }
  }, [])

  // Update marker position when props change (external update)
  useEffect(() => {
    if (markerRef.current && latitude !== null && longitude !== null) {
      const currentPos = markerRef.current.getLatLng()
      if (currentPos.lat !== latitude || currentPos.lng !== longitude) {
        markerRef.current.setLatLng([latitude, longitude])
        mapInstance.current?.setView([latitude, longitude], 16)
      }
    }
  }, [latitude, longitude])

  // Gunakan GPS device
  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung geolokasi")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords
        onChange(lat, lng)
        markerRef.current?.setLatLng([lat, lng])
        mapInstance.current?.setView([lat, lng], 16)
      },
      (error) => {
        alert("Gagal mendapatkan lokasi: " + error.message)
      },
      { enableHighAccuracy: true }
    )
  }

  // Cari lokasi dengan Nominatim (OpenStreetMap Geocoding)
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const query = encodeURIComponent(searchQuery + ", Depok, Indonesia")
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`
      )
      const results = await response.json()

      if (results.length > 0) {
        const { lat, lon } = results[0]
        const latitude = parseFloat(lat)
        const longitude = parseFloat(lon)
        onChange(latitude, longitude)
        markerRef.current?.setLatLng([latitude, longitude])
        mapInstance.current?.setView([latitude, longitude], 16)
      } else {
        alert("Lokasi tidak ditemukan")
      }
    } catch (error) {
      alert("Gagal mencari lokasi")
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari alamat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9 h-9"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSearch}
          disabled={searching}
          className="h-9"
        >
          {searching ? "..." : "Cari"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseMyLocation}
          className="h-9"
          title="Gunakan lokasi saya"
        >
          <Crosshair className="h-4 w-4" />
        </Button>
      </div>

      {/* Map container */}
      <div
        ref={mapRef}
        className="w-full h-[250px] rounded-lg border border-border overflow-hidden"
      />

      {/* Koordinat display */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="h-3.5 w-3.5 text-green-600" />
        <span>
          {latitude !== null && longitude !== null
            ? `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
            : "Klik pada peta atau drag marker untuk memilih lokasi"}
        </span>
      </div>
    </div>
  )
}
