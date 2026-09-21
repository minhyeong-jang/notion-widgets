// Sunrise / sunset / golden-hour calculation.
// Compact port of the astronomical algorithm used by SunCalc (BSD-2, Vladimir Agafonkin).
// Everything is pure math — no network, no timezone data needed for the *instants*.
// Returned Date objects are absolute UTC instants, so comparing them to Date.now()
// works correctly for any location on earth.

const PI = Math.PI;
const rad = PI / 180;
const dayMs = 1000 * 60 * 60 * 24;
const J1970 = 2440588;
const J2000 = 2451545;

const e = rad * 23.4397; // obliquity of the Earth

function toJulian(date: Date): number {
  return date.valueOf() / dayMs - 0.5 + J1970;
}
function fromJulian(j: number): Date {
  return new Date((j + 0.5 - J1970) * dayMs);
}
function toDays(date: Date): number {
  return toJulian(date) - J2000;
}

function declination(l: number, b: number): number {
  return Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l));
}
function solarMeanAnomaly(d: number): number {
  return rad * (357.5291 + 0.98560028 * d);
}
function eclipticLongitude(M: number): number {
  const C = rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M));
  const P = rad * 102.9372; // perihelion of the Earth
  return M + C + P + PI;
}

const J0 = 0.0009;
function julianCycle(d: number, lw: number): number {
  return Math.round(d - J0 - lw / (2 * PI));
}
function approxTransit(Ht: number, lw: number, n: number): number {
  return J0 + (Ht + lw) / (2 * PI) + n;
}
function solarTransitJ(ds: number, M: number, L: number): number {
  return J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
}
function hourAngle(h: number, phi: number, dec: number): number {
  return Math.acos((Math.sin(h) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec)));
}

export interface SunTimes {
  sunrise: Date | null;
  sunset: Date | null;
  solarNoon: Date;
  goldenHourEveningStart: Date | null; // evening golden hour begins
  goldenHourMorningEnd: Date | null; // morning golden hour ends
  /** true when the sun stays above the horizon all day (polar day) */
  polarDay: boolean;
  /** true when the sun never rises (polar night) */
  polarNight: boolean;
}

/**
 * Compute the sun event instants for the solar day surrounding `date`
 * at the given latitude / longitude (decimal degrees).
 */
export function getSunTimes(date: Date, lat: number, lng: number): SunTimes {
  const lw = rad * -lng;
  const phi = rad * lat;
  const d = toDays(date);
  const n = julianCycle(d, lw);
  const ds = approxTransit(0, lw, n);
  const M = solarMeanAnomaly(ds);
  const L = eclipticLongitude(M);
  const dec = declination(L, 0);
  const Jnoon = solarTransitJ(ds, M, L);
  const solarNoon = fromJulian(Jnoon);

  function eventPair(altitudeDeg: number): [Date, Date] | null {
    const h = altitudeDeg * rad;
    const cosW = (Math.sin(h) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec));
    if (cosW <= -1 || cosW >= 1) return null; // never crosses this altitude
    const w = hourAngle(h, phi, dec);
    const a = approxTransit(w, lw, n);
    const Jset = solarTransitJ(a, M, L);
    const Jrise = Jnoon - (Jset - Jnoon);
    return [fromJulian(Jrise), fromJulian(Jset)];
  }

  const daylight = eventPair(-0.833); // official sunrise / sunset
  const golden = eventPair(6); // golden hour boundary (~6° altitude)

  let polarDay = false;
  let polarNight = false;
  if (!daylight) {
    // Sun altitude at noon decides which polar case we are in.
    const noonAltitude = Math.asin(
      Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec),
    );
    if (noonAltitude > -0.833 * rad) polarDay = true;
    else polarNight = true;
  }

  return {
    sunrise: daylight ? daylight[0] : null,
    sunset: daylight ? daylight[1] : null,
    solarNoon,
    goldenHourMorningEnd: golden ? golden[0] : null,
    goldenHourEveningStart: golden ? golden[1] : null,
    polarDay,
    polarNight,
  };
}
