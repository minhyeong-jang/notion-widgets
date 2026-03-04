"use client";

import { useState, useEffect, useCallback } from "react";
import { resolveColors } from "@nw/widget-core";
import type { WeatherParams } from "./schema";
import { getWeatherInfo } from "./weather-codes";

interface WeatherData {
  city: string;
  temperature: number;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
}

function convertTemp(celsius: number, units: string): number {
  if (units === "F") return Math.round(celsius * 9 / 5 + 32);
  return Math.round(celsius);
}

export function WeatherWidget({ params }: { params: WeatherParams }) {
  const c = resolveColors(params);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Geocode the city
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(params.city)}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("City not found");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name } = geoData.results[0];

      // Fetch weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
      );
      const weatherData = await weatherRes.json();

      setWeather({
        city: name,
        temperature: weatherData.current.temperature_2m,
        weatherCode: weatherData.current.weather_code,
        tempMax: weatherData.daily.temperature_2m_max[0],
        tempMin: weatherData.daily.temperature_2m_min[0],
      });
      setLoading(false);
    } catch {
      setError("Failed to fetch");
      setLoading(false);
    }
  }, [params.city]);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000); // Refresh every 10 minutes
    return () => clearInterval(interval);
  }, [fetchWeather]);

  const bgStyle = c.bg === "transparent" ? undefined : { backgroundColor: c.bg };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center w-full ${c.bg === "transparent" ? "bg-transparent" : ""}`}
        style={bgStyle}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: c.accent, borderTopColor: "transparent" }}
          />
          <span className="text-sm opacity-60" style={{ color: c.text }}>
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center w-full ${c.bg === "transparent" ? "bg-transparent" : ""}`}
        style={bgStyle}
      >
        <span className="text-sm opacity-60" style={{ color: c.text }}>
          {error ?? "No data"}
        </span>
      </div>
    );
  }

  const info = getWeatherInfo(weather.weatherCode);
  const temp = convertTemp(weather.temperature, params.units);
  const high = convertTemp(weather.tempMax, params.units);
  const low = convertTemp(weather.tempMin, params.units);
  const unit = params.units === "F" ? "\u00B0F" : "\u00B0C";

  if (params.style === "card") {
    return (
      <div
        className={`min-h-screen flex items-center justify-center w-full ${c.bg === "transparent" ? "bg-transparent" : ""}`}
        style={bgStyle}
      >
        <div
          className="rounded-2xl p-6 w-full max-w-xs"
          style={{
            backgroundColor: c.accent + "1a",
            border: `1px solid ${c.border}`,
            borderRadius: c.radius,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium opacity-80" style={{ color: c.text }}>
              {weather.city}
            </span>
            <span className="text-2xl">{info.emoji}</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-5xl font-bold" style={{ color: c.text }}>
              {temp}
            </span>
            <span className="text-lg opacity-60" style={{ color: c.text }}>
              {unit}
            </span>
          </div>
          <div className="text-sm mb-3" style={{ color: c.accent }}>
            {info.label}
          </div>
          <div className="flex gap-4 text-xs opacity-60" style={{ color: c.text }}>
            <span>H: {high}{unit}</span>
            <span>L: {low}{unit}</span>
          </div>
        </div>
      </div>
    );
  }

  // Minimal style
  return (
    <div
      className={`min-h-screen flex items-center justify-center w-full ${c.bg === "transparent" ? "bg-transparent" : ""}`}
      style={bgStyle}
    >
      <div className="flex flex-col items-center gap-1">
        <span className="text-5xl mb-1">{info.emoji}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold" style={{ color: c.text }}>
            {temp}
          </span>
          <span className="text-lg opacity-60" style={{ color: c.text }}>
            {unit}
          </span>
        </div>
        <span className="text-xs opacity-50" style={{ color: c.text }}>
          {weather.city}
        </span>
      </div>
    </div>
  );
}
