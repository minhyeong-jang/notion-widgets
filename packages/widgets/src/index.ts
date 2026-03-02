// Import each widget to trigger registration side effects
import "./flip-clock";
import "./life-progress";
import "./countdown";
import "./quote";
import "./pomodoro";
import "./analog-clock";

// Re-export for direct use
export { FlipCard, FlipClockWidget } from "./flip-clock";
export { ProgressBar, LifeProgressWidget } from "./life-progress";
export { CountdownWidget } from "./countdown";
export { QuoteWidget } from "./quote";
export { PomodoroWidget } from "./pomodoro";
export { AnalogClockWidget } from "./analog-clock";
