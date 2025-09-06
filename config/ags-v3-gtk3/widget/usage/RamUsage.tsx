import GTop from "gi://GTop";
import { createPoll } from "ags/time";
import { config } from "../../lib/config";

const memory = createPoll(new GTop.glibtop_mem(), config.usage.ramUsagePoolRate, () => {
	const memory = new GTop.glibtop_mem();
	GTop.glibtop_get_mem(memory);
	return memory;
});

export function formatSize(bytes: number) {
	if (bytes === 0) return '0B';
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	const size = (bytes / 1024 ** i).toFixed(config.usage.ramUsageDecimals); // Format with X decimal places

	return `${size}${units[i]}`;
}

// cpu and ram usage from: https://github.com/coffeeispower/ags-desktop
export default () => {
    if (config.bar.enableBarUsageRam === false) {
        return (
            <box visible={false} />
        );
    }

    return (
        <box class={"ram usage"} spacing={config.usage.ramUsageSpacing}>
            <label class={"ram icon"} label="" />
            <label
                label={memory(
                    memory =>
                        `${formatSize(memory.user)}`,
                )}
            />
        </box>
    );
}
