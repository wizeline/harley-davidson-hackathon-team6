"use client";

import { useState, useEffect } from "react";
import {
    GoogleMap,
    LoadScript,
    DirectionsService,
    DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import Button from '../Button/Button';

const containerStyle = {
    width: "100%",
    height: "100vh",
};

const center = {
    lat: 21.8853, // Coordenadas aproximadas de Aguascalientes
    lng: -102.2916,
};

export default function Map() {
    const [inputText, setInputText] = useState("");
    const [route, setRoute] = useState(null);
    const [directions, setDirections] = useState(null);
    const [distance_km, setDistanceKm] = useState(0);
    const [estimated_time_min, setEstimatedTimeMin] = useState(0);

    const cleanJsonString = (rawString) => {
        const match = rawString.match(/\{[\s\S]*\}/);
        return match ? match[0] : null;
    };

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours > 0 ? hours + ' h ' : ''}${mins > 0 ? mins + ' min' : ''}`.trim();
      }

    const fetchRouteFromGemini = async () => {
        if (!inputText) return;

        try {
            const prompt = `
        Genera un objeto JSON sin texto adicional con la siguiente estructura:
        
        {
          "start": { "lat": number, "lng": number, "city": string, "state": string, "country": string },
          "end": { "lat": number, "lng": number, "city": string, "state": string, "country": string },
          "waypoints": [ { location:{ "lat": number, "lng": number }, "stopover": boolean } ],
          "distance_km": number,
          "estimated_time_min": number,
          "recommended_highways": [string],
          "extraInfo": string,
          "error": null | string
        }
        
        ### Reglas:
        - "waypoints" debe incluir puntos intermedios con lat, lng y stopover que indica que el punto de referencia es una parada en la ruta, lo cual tiene el efecto de dividirla en dos. .
        - "distance_km" y "estimated_time_min" deben indicar la distancia y duración aproximada en minutos.
        - "recommended_highways" debe listar carreteras sugeridas.
        - "extraInfo" debe ser una sola cadena de texto con información relevante sobre el viaje en moto, como clima, duración, precauciones y consejos.
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
            const { end, start, waypoints, distance_km, estimated_time_min } = jsonData;

            setRoute({ origin: start, destination: end, waypoints, });
            setDirections({ origin: start, destination: end });
            setDistanceKm(distance_km);
            setEstimatedTimeMin(formatTime(estimated_time_min));

        } catch (error) {
            console.error("Error consultando a Gemini:", error);
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
    <time>${new Date().toISOString()}</time>
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
                <h2 className="text-lg font-semibold mb-4">MY AWESOME RIDE</h2>
                <div>
                    <label>{estimated_time_min} - {distance_km} km</label>
                </div>
                <textarea

                    placeholder="Ej: Aguascalientes a León"
                    className="w-full p-2 border rounded mb-2 text-slate-700"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={4}
                />
                <Button onClick={fetchRouteFromGemini}>Create Ride from AI</Button>
                <Button onClick={exportToGPX}>Exportar GPX</Button>
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
                        {directions && (
                            <DirectionsService
                                options={{
                                    origin: directions.origin,
                                    destination: directions.destination,
                                    travelMode: "DRIVING",
                                    waypoints: route.waypoints,
                                }}
                                callback={(response) => response && setDirections(response)}
                            />
                        )}
                        {directions && <DirectionsRenderer directions={directions} />}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
}
