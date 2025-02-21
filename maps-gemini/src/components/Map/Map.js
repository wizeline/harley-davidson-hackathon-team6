"use client";

import { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import Button from "../Button/Button";
import SmallButton from "../Button/SmallButton";
import Waypoints from "../Waypoints/Waypoints";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: 21.8853,
  lng: -102.2916,
};

export default function Map() {
  const [inputText, setInputText] = useState("");
  const [route, setRoute] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance_km, setDistanceKm] = useState();
  const [estimated_time_min, setEstimatedTimeMin] = useState("0 h");
  const [editMode, setEditMode] = useState(false);
  const [extraInfo, setExtraInfo] = useState("");
  const [weather, setWeather] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    setCurrentTime(new Date().toISOString());
  }, []);

  const cleanJsonString = (rawString) => {
    const match = rawString.match(/\{[\s\S]*\}/);
    return match ? match[0] : null;
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours > 0 ? hours + " h " : ""}${
      mins > 0 ? mins + " min" : ""
    }`.trim();
  };

  const fetchRouteFromGemini = async () => {
    if (!inputText) return;

    setIsLoading(true);

    try {
      const prompt = `
        Genera un objeto JSON sin texto adicional con la siguiente estructura:
        
        {
          "start": { "lat": number, "lng": number, "city": string, "state": string, "country": string },
          "end": { "lat": number, "lng": number, "city": string, "state": string, "country": string },
          "waypoints": [ { location:{ "lat": number, "lng": number, "city": string }, "stopover": boolean } ],
          "distance_km": number,
          "estimated_time_min": number,
          "recommended_highways": [string],
          "weather": string
          "extraInfo": string,
          "error": null | string
        }
        
        ### Reglas:
        - "waypoints" debe incluir puntos intermedios con lat, lng, nombre de ciudad y stopover que indica que el punto de referencia es una parada en la ruta, lo cual tiene el efecto de dividirla en dos. .
        - "distance_km" y "estimated_time_min" deben indicar la distancia y duración aproximada en minutos.
        - "recommended_highways" debe listar carreteras sugeridas.
        - "weather" debe ser una cadena de texto con información sobre el clima.
        - "extraInfo" debe ser una lista con información relevante sobre el viaje en moto, precauciones y consejos.
        - Si no puedes generar el JSON correctamente, devuelve el mismo formato pero con valores nulos y un mensaje en "error".
        
        Usa el siguiente contexto para generar los datos:
        "${inputText}"
        `.trim();

      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
        {
          params: { key: process.env.NEXT_PUBLIC_GEMINI_API_KEY },
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = response.data.candidates[0].content.parts[0].text;

      const jsonString = cleanJsonString(result);
      if (!jsonString) {
        console.error("No se encontró un JSON válido");
        return;
      }

      const jsonData = JSON.parse(jsonString);
      console.log(jsonData);
      const {
        end,
        start,
        waypoints,
        distance_km,
        estimated_time_min,
        extraInfo,
        weather,
      } = jsonData;

      setRoute({
        origin: { lat: start.lat, lng: start.lng, city: start.city },
        destination: { lat: end.lat, lng: end.lng, city: end.city },
        waypoints,
      });

      setDistanceKm(distance_km);
      setEstimatedTimeMin(formatTime(estimated_time_min));
      setExtraInfo(extraInfo);
      setWeather(weather);
      setEditMode(false);
    } catch (error) {
      console.error("Error consultando a Gemini:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToGPX = () => {
    if (!directions) return;

    const { origin, destination, waypoints } = route;
    let gpxData = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="RutaIA" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Ruta Generada</name>
    <desc>${inputText}</desc>
    <time>${currentTime}</time>
  </metadata>
  <rte>
    <name>Ruta en Moto</name>
    <rtept lat="${origin.lat}" lon="${origin.lng}">
      <name>Inicio - ${origin.city}</name>
    </rtept>
    ${waypoints
      .map(
        (wp) => `
    <rtept lat="${wp.location.lat}" lon="${wp.location.lng}">
      <name>${wp.name || "Punto Intermedio"}</name>
    </rtept>`
      )
      .join("")}
    <rtept lat="${destination.lat}" lon="${destination.lng}">
      <name>Destino - ${destination.city}</name>
    </rtept>
  </rte>
</gpx>`;

    const blob = new Blob([gpxData], { type: "application/gpx+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "ruta.gpx";
    link.click();
  };

  return (
    <div className="flex h-screen bg-[#202020]">
      {/* Sidebar */}
      <div className="w-1/4 p-4 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold mb-4">MY AWESOME RIDE</h2>
          {route && !editMode && (
            <SmallButton onClick={() => setEditMode(true)} width="w-1/4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 mr-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 3.487a2.25 2.25 0 113.182 3.182l-9.193 9.193a4.5 4.5 0 01-1.591 1.06l-3.25 1.3a.75.75 0 01-.964-.964l1.3-3.25a4.5 4.5 0 011.06-1.591l9.193-9.193z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 6.75L17.25 4.5m-2.25 2.25L4.5 17.25"
                />
              </svg>
              Edit
            </SmallButton>
          )}
        </div>
        {route && (
          <h3 className="font-bold">
            {route.origin.city} - {route.destination.city}
          </h3>
        )}

        <div className="mb-4">
          <label>
            {estimated_time_min} - {distance_km} km
          </label>
        </div>

        {(!route || editMode) && (
          <>
            <textarea
              placeholder="Ex: San Diego to Los Angeles"
              className="w-full p-2 border rounded mb-2 text-slate-700"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
            />
            <Button onClick={fetchRouteFromGemini} disabled={isLoading}>
              {isLoading ? "Loading..." : "Create Ride from AI"}
            </Button>
          </>
        )}
        {route && (
          <>
            <hr className="my-4 border-t-2 border-gray-600" />
            <Waypoints waypoints={route.waypoints} />
            <div className="text-base text-gray-300 h-[400px] overflow-y-auto">
              <h3 className="text-[#f60] font-semibold">WEATHER</h3>
              <p className="mb-4">{weather}</p>

              <h3 className="text-[#f60] font-semibold">RECOMMENDATIONS</h3>
              <p className="mb-4">{extraInfo}</p>
            </div>
          </>
        )}

        {route && !editMode && (
          <div className="flex flex-row gap-2 mt-4 font-semibold text-sm justify-end w-full">
            <SmallButton onClick={exportToGPX}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M12 3v12" />
                <path d="M16 11l-4 4-4-4" />
                <path d="M4 17h16" />
              </svg>
              Export GPX
            </SmallButton>
            <SmallButton onClick={() => alert("Saved Ride")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24"
                height="24"
                className="mr-1"
              >
                <path d="M17 3H5C3.9 3 3 3.9 3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H6V5h9v3z" />
              </svg>
              Save Ride
            </SmallButton>
          </div>
        )}
      </div>

      {/* Mapa */}
      <div className="w-3/4">
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={7}
          >
            {route?.origin && route?.destination && (
              <DirectionsService
                options={{
                  origin: route.origin,
                  destination: route.destination,
                  waypoints: route.waypoints,
                  travelMode: "DRIVING",
                }}
                callback={(result, status) => {
                  if (status === "OK" && result) {
                    setDirections(result); // ✅ Ahora sí pasamos un `DirectionsResult` válido
                  } else {
                    console.error("No se pudo obtener la ruta:", status);
                  }
                }}
              />
            )}
            {directions && <DirectionsRenderer directions={directions} />}
          </GoogleMap>
        </LoadScript>
      </div>
    </div>
  );
}
