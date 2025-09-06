import GTop from "gi://GTop";
import { createPoll } from 'ags/time';
import { config } from "../../lib/config";

const cpu = createPoll(
    { cpu: new GTop.glibtop_cpu(), load: 0 },
	config.usage.cpuUsagePoolRate,
	({ cpu: lastCpu }) => {
		const cpu = new GTop.glibtop_cpu();
		GTop.glibtop_get_cpu(cpu);

		const used = cpu.user + cpu.sys + cpu.nice + cpu.irq + cpu.softirq;
		const total = used + cpu.idle + cpu.iowait;

		const lastUsed =
			lastCpu.user + lastCpu.sys + lastCpu.nice + lastCpu.irq + lastCpu.softirq;
		const lastTotal = lastUsed + lastCpu.idle + lastCpu.iowait;

		const diffUsed = used - lastUsed;
		const diffTotal = total - lastTotal;

		return { cpu, load: diffTotal > 0 ? diffUsed / diffTotal : 0 };
	},
);

export default () => {
    if (config.bar.enableBarUsageCpu === false) {
        return (
            <box visible={false} />
        );
    }

    return (
        <box class={"cpu usage"} spacing={config.usage.cpuUsageSpacing}>
            <label class={"cpu icon"} label="" />
            <label
                label={cpu(cpu => `${(cpu.load * 100).toFixed(config.usage.cpuUsageDecimals)}%`)}
            />
        </box>
    );
}
