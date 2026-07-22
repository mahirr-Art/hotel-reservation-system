'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Heart Marker
const createHeartIcon = () => {
  return L.divIcon({
    className: 'custom-heart-marker',
    html: `<div style="font-size: 24px; filter: drop-shadow(0 0 8px rgba(225, 29, 72, 0.8)); animation: pulse 2s infinite;">❤️</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

// Component to handle auto-fitting bounds
function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, positions]);
  return null;
}

export default function LoveMapInner() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add custom styles for the map animations
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
      }
      .leaflet-container {
        background: #0a0c10;
        font-family: inherit;
        z-index: 10;
      }
      .custom-popup .leaflet-popup-content-wrapper {
        background: rgba(10, 12, 16, 0.8);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 12px;
      }
      .custom-popup .leaflet-popup-tip {
        background: rgba(10, 12, 16, 0.8);
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  if (!mounted) return null;

  const loc1: [number, number] = [42.0283, 35.1533]; // Sinop
  const loc2: [number, number] = [41.0082, 28.9784]; // Istanbul
  const positions = [loc1, loc2];

  const heartIcon = createHeartIcon();

  return (
    <div className="w-full h-[300px] md:h-[450px] relative z-0">
      <MapContainer 
        center={[41.5182, 32.0658]} 
        zoom={6} 
        scrollWheelZoom={false}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        <FitBounds positions={positions} />
        
        <Marker position={loc1} icon={heartIcon}>
          <Popup className="custom-popup">
            <div className="font-bold text-center">Sen ❤️</div>
          </Popup>
        </Marker>
        
        <Marker position={loc2} icon={heartIcon}>
          <Popup className="custom-popup">
            <div className="font-bold text-center">O ❤️</div>
          </Popup>
        </Marker>
        
        <Polyline 
          positions={positions} 
          pathOptions={{ 
            color: '#e11d48', 
            weight: 3, 
            dashArray: '10, 10',
            opacity: 0.7,
            className: 'animate-pulse'
          }} 
        />
      </MapContainer>
    </div>
  );
}
