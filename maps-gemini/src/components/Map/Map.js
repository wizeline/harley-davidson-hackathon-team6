'use client';

import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import axios from 'axios';
import Button from '../Button/Button';

const containerStyle = {
    width: '100%',
    height: '100vh',
};

const center = {
    lat: 21.8853, // Coordenadas aproximadas de Aguascalientes
    lng: -102.2916,
};

export default function Map() {
    const [inputText, setInputText] = useState('');
    const [directions, setDirections] = useState(null);

    const fetchRouteFromGemini = async () => {
        if (!inputText) return;

        try {
            // const response = await axios.post(
            //     'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateText',
            //     {
            //         prompt: { text: `Genera una ruta en formato JSON con origen y destino basado en: ${inputText}` },
            //     },
            //     {
            //         params: { key: process.env.NEXT_PUBLIC_GEMINI_API_KEY },
            //         headers: { 'Content-Type': 'application/json' },
            //     }
            // );

            // const { start, end } = JSON.parse(response.data.candidates[0].output.text);

            const res = {
                start: {
                  "lat": 21.8853,
                  "lng": -102.2916,
                  "city": "Aguascalientes",
                  "state": "Aguascalientes",
                  "country": "Mexico"
                },
                "end": {
                  "lat": 21.1236,
                  "lng": -101.6861,
                  "city": "León",
                  "state": "Guanajuato",
                  "country": "Mexico"
                },
                "waypoints": [
                  {
                    "lat": 21.4844,
                    "lng": -102.0146,
                    "name": "San Francisco de los Romo"
                  },
                  {
                    "lat": 21.249,
                    "lng": -101.7395,
                    "name": "Silao"
                  }
                ],
                "distance_km": 140,
                "estimated_time_min": 120,
                "recommended_highways": [
                  "México 45D"
                ]
              }

              const { start, end } = res;

            setDirections({ origin: start, destination: end });
        } catch (error) {
            console.error('Error consultando a Gemini:', error);
        }
    };

    return (
        <div className="flex h-screen bg-[#202020]">
            {/* Sidebar */}
            <div className="w-1/4 p-4 text-white">
                <h2 className="text-lg font-semibold mb-4">MY AWESOME RIDE</h2>
                <textarea

                    placeholder="Ej: Aguascalientes a León"
                    className="w-full p-2 border rounded mb-2"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    rows={4}
                />
                {/* <button
                    className="w-full bg-blue-500 text-white py-2 rounded"
                    onClick={fetchRouteFromGemini}
                >
                    Obtener Ruta
                </button> */}
                <Button onClick={fetchRouteFromGemini}>Create Ride from AI</Button>
            </div>

            {/* Mapa */}
            <div className="w-3/4">
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
                        {directions && (
                            <DirectionsService
                                options={{
                                    origin: directions.origin,
                                    destination: directions.destination,
                                    travelMode: 'DRIVING',
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
