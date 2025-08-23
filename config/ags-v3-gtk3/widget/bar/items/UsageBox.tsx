import CpuUsage from "../../usage/CpuUsage";
import RamUsage from "../../usage/RamUsage";
import DiskUsage from "../../usage/DiskUsage";
import BluetoothPowerUsage from "../../usage/BluetoothPowerUsage";
import {
    barUsageSpacing,
    enableBarUsage
} from "../../common/Variables";

export default () => {
    if (!enableBarUsage) {
        return (<box visible={false} />);
    }

    return (
        <box class={"usage-box"} spacing={barUsageSpacing}>
            {/* <CpuUsage />
            <RamUsage />
            <DiskUsage /> */}
            {/* todo add gtop and uncomment */}
            <BluetoothPowerUsage />
        </box>
    );
}
