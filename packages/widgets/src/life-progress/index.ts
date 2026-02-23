import { registerWidget } from "@nw/widget-core";
import { LifeProgressWidget } from "./widget";

export { ProgressBar } from "./progress-bar";
export { LifeProgressWidget } from "./widget";

registerWidget({
  meta: {
    id: "life-progress",
    name: "Life Progress",
    description: "Progress bars for year, month, quarter, and custom target",
  },
  component: LifeProgressWidget,
});
