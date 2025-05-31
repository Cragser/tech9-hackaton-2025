"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

interface MapDisplayProps {
  lat: number;
  lng: number;
  address?: string;
  height?: string;
  zoom?: number;
}

// Custom marker icon using DivIcon
const createCustomIcon = () => {
  if (typeof window !== 'undefined') {
    const L = require('leaflet');
    return L.divIcon({
      html: `<div style="
        background-color: #2563eb; 
        width: 20px; 
        height: 20px; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg); 
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>`,
      className: 'custom-marker-display',
      iconSize: [20, 20],
      iconAnchor: [10, 20],
      popupAnchor: [0, -20]
    });
  }
  return null;
};

export default function MapDisplay({ 
  lat, 
  lng, 
  address, 
  height = "200px",
  zoom = 15 
}: MapDisplayProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const customIcon = createCustomIcon();

  if (!isClient) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="w-6 h-6 text-gray-400 mx-auto mb-1" />
          <p className="text-gray-500 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div 
        className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
        style={{ height }}
      >
        <MapContainer
          center={[lat, lng]}
          zoom={zoom}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          boxZoom={false}
          keyboard={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {customIcon && <Marker position={[lat, lng]} icon={customIcon} />}
        </MapContainer>
      </div>
      
      {address && (
        <div className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs">
          <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-gray-700">{address}</span>
        </div>
      )}
    </div>
  );
} 