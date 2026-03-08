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

  // Neon style: Teletext / Ceefax
  if (params.style === "neon") {
    // Map weather codes to ASCII symbols
    const getAsciiWeather = (code: number): string => {
      if (code === 0) return "*";                       // Clear
      if (code <= 2) return "~*";                       // Mostly clear / partly cloudy
      if (code === 3) return "~~~";                     // Overcast
      if (code >= 45 && code <= 48) return "===";       // Fog
      if (code >= 51 && code <= 57) return "' '";       // Drizzle
      if (code >= 61 && code <= 67) return "'''";       // Rain
      if (code >= 71 && code <= 77) return "* *";       // Snow
      if (code >= 80 && code <= 82) return ",',";       // Showers
      if (code >= 85 && code <= 86) return "*'*";       // Snow showers
      if (code >= 95) return "/\\/";                    // Thunderstorm
      return "?";
    };

    const asciiIcon = getAsciiWeather(weather.weatherCode);
    const cityStr = weather.city.toUpperCase();
    const tempStr = `${temp}${unit}`;
    const hiloStr = `H:${high} L:${low}`;
    const condStr = info.label.toUpperCase();

    const innerWidth = 21;
    const pad = (s: string) => {
      const left = Math.floor((innerWidth - s.length) / 2);
      const right = innerWidth - s.length - left;
      return " ".repeat(Math.max(0, left)) + s + " ".repeat(Math.max(0, right));
    };

    return (
      <WidgetShell params={params}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "12px",
            lineHeight: "1.5",
            color: accentColor,
            whiteSpace: "pre",
          }}
        >
          <div style={{ opacity: 0.4 }}>{"\u250C" + "\u2500".repeat(innerWidth) + "\u2510"}</div>
          <div>
            <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
            <span style={{ opacity: 0.5 }}>{pad(cityStr)}</span>
            <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
          </div>
          <div style={{ opacity: 0.4 }}>{"\u251C" + "\u2500".repeat(innerWidth) + "\u2524"}</div>
          <div>
            <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
            <span>{pad(asciiIcon)}</span>
            <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
          </div>
          <div>
            <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
            <span style={{ fontWeight: "bold", fontSize: "14px" }}>{pad(tempStr)}</span>
            <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
          </div>
          <div>
            <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
            <span style={{ opacity: 0.6 }}>{pad(condStr.length <= innerWidth ? condStr : condStr.slice(0, innerWidth))}</span>
            <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
          </div>
          <div style={{ opacity: 0.4 }}>{"\u251C" + "\u2500".repeat(innerWidth) + "\u2524"}</div>
          <div>
            <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
            <span style={{ opacity: 0.5 }}>{pad(hiloStr)}</span>
            <span style={{ opacity: 0.4 }}>{"\u2502"}</span>
          </div>
          <div style={{ opacity: 0.4 }}>{"\u2514" + "\u2500".repeat(innerWidth) + "\u2518"}</div>
        </div>
      </WidgetShell>
    );
  }

  if (params.variant === "card") {
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
