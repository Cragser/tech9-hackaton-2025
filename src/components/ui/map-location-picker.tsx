"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { Button } from "./button";

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });

interface LocationData {
  lat: number;
  lng: number;
  address?: string;
}

interface MapLocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  initialLocation?: LocationData;
  height?: string;
}

// Custom marker icon using DivIcon
const createCustomIcon = () => {
  if (typeof window !== 'undefined') {
    const L = require('leaflet');
    return L.divIcon({
      html: `<div style="
        background-color: #dc2626; 
        width: 24px; 
        height: 24px; 
        border-radius: 50% 50% 50% 0; 
        transform: rotate(-45deg); 
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(45deg);">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>`,
      className: 'custom-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24]
    });
  }
  return null;
};

// Component to handle map clicks
function LocationMarker({ onLocationSelect, selectedLocation }: {
  onLocationSelect: (location: LocationData) => void;
  selectedLocation: LocationData | null;
}) {
  // Import useMapEvents dynamically inside the component
  const { useMapEvents } = require("react-leaflet");
  
  const map = useMapEvents({
    click: async (e: any) => {
      const { lat, lng } = e.latlng;
      
      // Reverse geocoding using Nominatim (OpenStreetMap's free geocoding service)
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        
        onLocationSelect({ lat, lng, address });
      } catch (error) {
        console.error("Error getting address:", error);
        onLocationSelect({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
      }
    },
  });

  const customIcon = createCustomIcon();

  return selectedLocation && customIcon ? (
    <Marker 
      position={[selectedLocation.lat, selectedLocation.lng]} 
      icon={customIcon}
    />
  ) : null;
}

export default function MapLocationPicker({ 
  onLocationSelect, 
  initialLocation,
  height = "400px" 
}: MapLocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    initialLocation || null
  );
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    onLocationSelect(location);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Get address for current location
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            const address = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
            
            handleLocationSelect({ lat, lng, address });
          } catch (error) {
            console.error("Error getting address:", error);
            handleLocationSelect({ lat, lng, address: `${lat.toFixed(6)}, ${lng.toFixed(6)}` });
          }
        },
        (error) => {
          console.error("Error getting current location:", error);
          alert("Could not get your current location. Please click on the map to select a location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser. Please click on the map to select a location.");
    }
  };

  // Default center (Mexico City)
  const defaultCenter: [number, number] = [19.4326, -99.1332];
  const center: [number, number] = selectedLocation 
    ? [selectedLocation.lat, selectedLocation.lng] 
    : defaultCenter;

  if (!isClient) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg"
        style={{ height }}
      >
        <div className="text-center">
          <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Select Location on Map
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          className="text-xs"
        >
          <MapPin className="w-3 h-3 mr-1" />
          Use Current Location
        </Button>
      </div>
      
      <div 
        className="border border-gray-300 rounded-lg overflow-hidden"
        style={{ height }}
      >
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker 
            onLocationSelect={handleLocationSelect}
            selectedLocation={selectedLocation}
          />
        </MapContainer>
      </div>
      
      {selectedLocation && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-green-800">Selected Location:</p>
              <p className="text-green-700">{selectedLocation.address}</p>
              <p className="text-green-600 text-xs">
                Coordinates: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        Click anywhere on the map to select a location, or use the "Use Current Location" button.
      </p>
    </div>
  );
} 