/**
 * Moon phase calculation based on the synodic cycle.
 * Reference new moon: January 6, 2000 18:14 UTC
 */

const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0); // Jan 6, 2000 18:14 UTC
const SYNODIC_PERIOD = 29.53058770576; // days
const MS_PER_DAY = 86400000;

export interface MoonPhaseData {
  /** Phase index 0-7 */
  phase: number;
  /** Phase name in English */
  name: string;
  /** Phase name in Korean */
  nameKo: string;
  /** Days into the current synodic cycle (0 - ~29.53) */
  dayInCycle: number;
  /** Illumination percentage 0-100 */
  illumination: number;
  /** Next full moon date */
  nextFullMoon: Date;
}

const PHASE_NAMES: Array<{ name: string; nameKo: string }> = [
  { name: "New Moon", nameKo: "\uC0AD" },
  { name: "Waxing Crescent", nameKo: "\uCD08\uC2B9\uB2EC" },
  { name: "First Quarter", nameKo: "\uC0C1\uD604\uB2EC" },
  { name: "Waxing Gibbous", nameKo: "\uCC28\uC624\uB974\uB294 \uB2EC" },
  { name: "Full Moon", nameKo: "\uBCF4\uB984\uB2EC" },
  { name: "Waning Gibbous", nameKo: "\uAE30\uC6B0\uB294 \uB2EC" },
  { name: "Last Quarter", nameKo: "\uD558\uD604\uB2EC" },
  { name: "Waning Crescent", nameKo: "\uADF8\uBB3C\uB2EC" },
];

export function getMoonPhase(date: Date = new Date()): MoonPhaseData {
  const diffMs = date.getTime() - KNOWN_NEW_MOON;
  const diffDays = diffMs / MS_PER_DAY;
  const dayInCycle = ((diffDays % SYNODIC_PERIOD) + SYNODIC_PERIOD) % SYNODIC_PERIOD;

  // Divide the cycle into 8 phases
  const phaseIndex = Math.floor((dayInCycle / SYNODIC_PERIOD) * 8) % 8;

  // Calculate illumination: 0 at new moon (0), 100 at full moon (0.5 cycle), 0 at next new moon
  const cycleProgress = dayInCycle / SYNODIC_PERIOD;
  const illumination = Math.round((1 - Math.cos(cycleProgress * 2 * Math.PI)) / 2 * 100);

  // Calculate next full moon
  const fullMoonDayInCycle = SYNODIC_PERIOD / 2;
  let daysUntilFull: number;
  if (dayInCycle < fullMoonDayInCycle) {
    daysUntilFull = fullMoonDayInCycle - dayInCycle;
  } else {
    daysUntilFull = SYNODIC_PERIOD - dayInCycle + fullMoonDayInCycle;
  }
  const nextFullMoon = new Date(date.getTime() + daysUntilFull * MS_PER_DAY);

  return {
    phase: phaseIndex,
    name: PHASE_NAMES[phaseIndex].name,
    nameKo: PHASE_NAMES[phaseIndex].nameKo,
    dayInCycle,
    illumination,
    nextFullMoon,
  };
}
