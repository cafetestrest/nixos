import CpuUsage from "../../usage/CpuUsage";
import RamUsage from "../../usage/RamUsage";
import DiskUsage from "../../usage/DiskUsage";
import BluetoothPowerUsage from "../../usage/BluetoothPowerUsage";
import { config } from "../../../lib/config";

export default () => {
    return (
        <box class={"usage-box"} spacing={config.usage.barUsageSpacing}>
            <CpuUsage />
            <RamUsage />
            <DiskUsage />
            <BluetoothPowerUsage />
        </box>
    );
}
