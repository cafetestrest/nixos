import CpuUsage from "../../usage/CpuUsage";
import RamUsage from "../../usage/RamUsage";
import DiskUsage from "../../usage/DiskUsage";
import BluetoothPowerUsage from "../../usage/BluetoothPowerUsage";
import { BarUsageWidgets, config } from "../../../lib/config";

export default () => {
    const widgetMap: Record<BarUsageWidgets, JSX.Element> = {
        Cpu: CpuUsage(),
        Ram: RamUsage(),
        Disk: DiskUsage(),
        BluetoothPower: BluetoothPowerUsage(),
    };

    const renderWidgets = (widgetKeys: BarUsageWidgets[]) => {
        return widgetKeys.map(key => {
            const widget = widgetMap[key];
            return widget ? widget : null;
        });
    };

    return (
        <box class={"usage-box"} spacing={config.usage.barUsageSpacing}>
            {renderWidgets(config.usage.layout)}
        </box>
    );
}
