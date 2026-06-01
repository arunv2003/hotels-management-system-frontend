"use client";

import React, { useState, useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "350px",
};

const indiaCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

function reverseGeocode(lat, lng, callback) {
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
  initialLocation = indiaCenter,
}) {
  const [markerPosition, setMarkerPosition] = useState(initialLocation);
  const [map, setMap] = useState(null);
  const [zoom, setZoom] = useState(12);

  const handleZoomChanged = useCallback(() => {
    if (map) {
      setZoom(map.getZoom());
    }
  }, [map]);

  const [prevInitialLocation, setPrevInitialLocation] = useState(initialLocation);

  // Derive state during render instead of using useEffect to prevent cascading renders
  if (
    initialLocation.lat &&
    initialLocation.lng &&
    (Math.abs(prevInitialLocation.lat - initialLocation.lat) > 0.00001 ||
      Math.abs(prevInitialLocation.lng - initialLocation.lng) > 0.00001)
  ) {
    setPrevInitialLocation(initialLocation);
    setMarkerPosition({ lat: initialLocation.lat, lng: initialLocation.lng });
  }

  React.useEffect(() => {
    if (map && initialLocation.lat && initialLocation.lng) {
      map.panTo({ lat: initialLocation.lat, lng: initialLocation.lng });
    }
  }, [initialLocation.lat, initialLocation.lng, map]);

  const onMapLoad = useCallback(
    (mapInstance) => {
      setMap(mapInstance);
      // Auto detect current location if map is at default indiaCenter
      if (
        initialLocation.lat === indiaCenter.lat &&
        initialLocation.lng === indiaCenter.lng
      ) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const newLat = position.coords.latitude;
              const newLng = position.coords.longitude;
              setMarkerPosition({ lat: newLat, lng: newLng });
              mapInstance.panTo({ lat: newLat, lng: newLng });
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
    [initialLocation.lat, initialLocation.lng, onLocationChange],
  );

  const handleMarkerDragEnd = useCallback(
    (e) => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();

      setMarkerPosition({
        lat: newLat,
        lng: newLng,
      });

      // Call reverse geocoding to get address
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



  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={markerPosition}
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
        position={markerPosition}
        draggable={true}
        onDragEnd={handleMarkerDragEnd}
        title="Drag to change location or click on map"
      />
    </GoogleMap>
  );
}
