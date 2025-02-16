import Variable from 'astal/variable';
import GTop from "gi://GTop";
import { ramUsageSpacing } from '../common/Variables';

const memory = Variable(new GTop.glibtop_mem()).poll(2000, () => {
	const memory = new GTop.glibtop_mem();
	GTop.glibtop_get_mem(memory);
	return memory;
});

export function formatSize(bytes: number) {
	if (bytes === 0) return '0B';
	const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

	const i = Math.floor(Math.log(bytes) / Math.log(1024));
	const size = (bytes / 1024 ** i).toFixed(1); // Format with X decimal places

	return `${size}${units[i]}`;
}

// cpu and ram usage from: https://github.com/coffeeispower/ags-desktop
export default () => {
    return (
        <box className={"ram usage"} spacing={ramUsageSpacing}>
            <label className={"ram icon"} label="" />
            <label
                label={memory(
                    memory =>
                        `${formatSize(memory.user)}`,
                )}
            />
        </box>
    );
}
