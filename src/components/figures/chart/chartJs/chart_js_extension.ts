import * as ChartJS from "chart.js";
import { Registry } from "../../../../registries/registry";
const Chart = ChartJS.Chart;
export const chartJsExtensionRegistry = new Registry<{
  register: (chart: typeof Chart, ChartJS) => void;
  unregister: (chart: typeof Chart, ChartJS) => void;
}>();

export function areChartJSExtensionsLoaded() {
  return !!Chart.registry.plugins.get("chartShowValuesPlugin");
}

export function registerChartJSExtensions() {
  if (!Chart || areChartJSExtensionsLoaded()) {
    return;
  }
  for (const registryItem of chartJsExtensionRegistry.getAll()) {
    registryItem.register(Chart, ChartJS);
  }
}

export function unregisterChartJsExtensions() {
  if (!Chart) {
    return;
  }
  for (const registryItem of chartJsExtensionRegistry.getAll()) {
    registryItem.unregister(Chart, ChartJS);
  }
}
