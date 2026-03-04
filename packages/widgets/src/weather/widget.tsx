"use client";

import { useState, useEffect, useCallback } from "react";
import { WidgetShell } from "../widget-shell";
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

  const accentColor = "#" + params.color;

  if (loading) {
    return (
      <WidgetShell params={params}>
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: accentColor, borderTopColor: "transparent" }}
          />
          <span className="text-sm opacity-60" style={{ color: accentColor }}>
            Loading...
          </span>
        </div>
      </WidgetShell>
    );
  }

  if (error || !weather) {
    return (
      <WidgetShell params={params}>
        <span className="text-sm opacity-60" style={{ color: accentColor }}>
          {error ?? "No data"}
        </span>
      </WidgetShell>
    );
  }

  const info = getWeatherInfo(weather.weatherCode);
  const temp = convertTemp(weather.temperature, params.units);
  const high = convertTemp(weather.tempMax, params.units);
  const low = convertTemp(weather.tempMin, params.units);
  const unit = params.units === "F" ? "\u00B0F" : "\u00B0C";

  if (params.style === "card") {
    return (
      <WidgetShell params={params}>
        <div
          className="rounded-2xl p-6 w-full max-w-xs"
          style={{
            backgroundColor: accentColor + "1a",
            border: `var(--w-border-width) solid ${accentColor}33`,
            borderRadius: "var(--w-radius)",
            boxShadow: "var(--w-box-shadow)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium opacity-80" style={{ color: accentColor }}>
              {weather.city}
            </span>
            <span className="text-2xl">{info.emoji}</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span
              className="text-5xl font-bold"
              style={{
                color: accentColor,
                textShadow: "var(--w-text-shadow)",
              }}
            >
              {temp}
            </span>
            <span className="text-lg opacity-60" style={{ color: accentColor }}>
              {unit}
            </span>
          </div>
          <div className="text-sm mb-3" style={{ color: accentColor }}>
            {info.label}
          </div>
          <div className="flex gap-4 text-xs opacity-60" style={{ color: accentColor }}>
            <span>H: {high}{unit}</span>
            <span>L: {low}{unit}</span>
          </div>
        </div>
      </WidgetShell>
    );
  }

  // Minimal style
  return (
    <WidgetShell params={params}>
      <div className="flex flex-col items-center gap-1">
        <span className="text-5xl mb-1">{info.emoji}</span>
        <div className="flex items-baseline gap-1">
          <span
            className="text-4xl font-bold"
            style={{
              color: accentColor,
              textShadow: "var(--w-text-shadow)",
            }}
          >
            {temp}
          </span>
          <span className="text-lg opacity-60" style={{ color: accentColor }}>
            {unit}
          </span>
        </div>
        <span className="text-xs opacity-50" style={{ color: accentColor }}>
          {weather.city}
        </span>
      </div>
    </WidgetShell>
  );
}
