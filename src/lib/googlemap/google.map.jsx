"use client";

import React, { useState, useCallback, useMemo } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "220px",
  borderRadius: "0.75rem",
};

const indiaCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

const LIBRARIES = ["places"];

function parseSafeCoordinate(val, fallback) {
  if (typeof val === "number" && Number.isFinite(val)) return val;
  const parsed = parseFloat(val);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function reverseGeocode(lat, lng, callback) {
  if (typeof window === "undefined" || !window.google || !window.google.maps) return;
  const geocoder = new window.google.maps.Geocoder();
  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    if (status === "OK" && results[0]) {
      callback({
        latitude: lat,
        longitude: lng,
        address: results[0].formatted_address,
        city:
          results[0].address_components?.find((c) =>
            c.types.includes("locality"),
          )?.long_name || "",
        state:
          results[0].address_components?.find((c) =>
            c.types.includes("administrative_area_level_1"),
          )?.long_name || "",
        country:
          results[0].address_components?.find((c) =>
            c.types.includes("country"),
          )?.long_name || "",
        pincode:
          results[0].address_components?.find((c) =>
            c.types.includes("postal_code"),
          )?.long_name || "",
      });
    }
  });
}

export default function GoogleMapComponent({
  onLocationChange,
  initialLocation,
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: LIBRARIES,
  });

  const safeInitial = useMemo(() => {
    return {
      lat: parseSafeCoordinate(initialLocation?.lat, indiaCenter.lat),
      lng: parseSafeCoordinate(initialLocation?.lng, indiaCenter.lng),
    };
  }, [initialLocation?.lat, initialLocation?.lng]);

  const [markerPosition, setMarkerPosition] = useState(safeInitial);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(12);

  const handleZoomChanged = useCallback(() => {
    if (map) {
      setZoom(map.getZoom());
    }
  }, [map]);

  const [prevInitialLocation, setPrevInitialLocation] = useState(safeInitial);

  // Sync state if initialLocation changes
  if (
    Math.abs(prevInitialLocation.lat - safeInitial.lat) > 0.00001 ||
    Math.abs(prevInitialLocation.lng - safeInitial.lng) > 0.00001
  ) {
    setPrevInitialLocation(safeInitial);
    setMarkerPosition(safeInitial);
  }

  React.useEffect(() => {
    if (map && safeInitial.lat && safeInitial.lng) {
      map.panTo(safeInitial);
    }
  }, [safeInitial, map]);

  const onMapLoad = useCallback(
    (mapInstance) => {
      setMap(mapInstance);
      // Auto detect current location if map is at default indiaCenter
      if (
        safeInitial.lat === indiaCenter.lat &&
        safeInitial.lng === indiaCenter.lng
      ) {
        if (typeof window !== "undefined" && navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const newLat = position.coords.latitude;
              const newLng = position.coords.longitude;
              const pos = { lat: newLat, lng: newLng };
              setMarkerPosition(pos);
              mapInstance.panTo(pos);
              mapInstance.setZoom(15);
              if (onLocationChange) {
                reverseGeocode(newLat, newLng, onLocationChange);
              }
            },
            (error) => {
              console.error("Error getting location:", error);
            },
          );
        }
      }
    },
    [safeInitial, onLocationChange],
  );

  const handleMarkerDragEnd = useCallback(
    (e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();

      setMarkerPosition({
        lat: newLat,
        lng: newLng,
      });

      if (onLocationChange) {
        reverseGeocode(newLat, newLng, onLocationChange);
      }
    },
    [onLocationChange],
  );

  const handleMapClick = useCallback(
    (e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();

      setMarkerPosition({
        lat: newLat,
        lng: newLng,
      });

      if (onLocationChange) {
        reverseGeocode(newLat, newLng, onLocationChange);
      }
    },
    [onLocationChange],
  );

  const validPosition = useMemo(() => ({
    lat: parseSafeCoordinate(markerPosition?.lat, indiaCenter.lat),
    lng: parseSafeCoordinate(markerPosition?.lng, indiaCenter.lng),
  }), [markerPosition?.lat, markerPosition?.lng]);

  if (loadError) {
    return (
      <div className="w-full h-[220px] bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center justify-center p-4 text-center">
        <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
          Error loading Google Maps. Please check your API key or network connection.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-[220px] bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center animate-pulse text-xs text-slate-400 font-bold">
        Loading Map...
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={validPosition}
        zoom={zoom}
        onZoomChanged={handleZoomChanged}
        onLoad={onMapLoad}
        onClick={handleMapClick}
        options={{
          gestureHandling: "greedy",
          zoomControl: true,
          fullscreenControl: true,
          scrollwheel: true,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        <Marker
          position={validPosition}
          draggable={true}
          onDragEnd={handleMarkerDragEnd}
          title="Drag to change location or click on map"
        />
      </GoogleMap>
    </div>
  );
}

