import Variable from 'astal/variable';
import GTop from "gi://GTop";
import { cpuUsageSpacing, cpuUsagePoolRate, cpuUsageDecimals, enableBarUsageCpu } from '../common/Variables';

const cpu = Variable({ cpu: new GTop.glibtop_cpu(), load: 0 }).poll(
	cpuUsagePoolRate,
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
    if (enableBarUsageCpu === false) {
        return (
            <box visible={false} />
        );
    }

    return (
        <box className={"cpu usage"} spacing={cpuUsageSpacing}>
            <label className={"cpu icon"} label="" />
            <label
                label={cpu(cpu => `${(cpu.load * 100).toFixed(cpuUsageDecimals)}%`)}
                onDestroy={() => cpu.drop()}
            />
        </box>
    );
}
