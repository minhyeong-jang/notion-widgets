import { registerWidget } from "@nw/widget-core";
import { FlipClockWidget } from "./widget";

export { FlipCard } from "./flip-clock";
export { FlipClockWidget } from "./widget";

registerWidget({
  meta: {
    id: "flip-clock",
    name: "Flip Clock",
    description: "A retro flip-style clock showing hours and minutes",
  },
  component: FlipClockWidget,
});
