import { createPoll } from "ags/time";
import { config } from "../../lib/config";

const disk = createPoll(
	"",
	config.usage.diskUsagePoolRate,
	"df -h /",
	(out) => {
	const lines = out.split('\n');
	if (lines.length >= 2)
		return lines[1].split(/\s+/)[4];
	return "error";
});

export default () => {
	return (
		<box class={"disk usage"} spacing={config.usage.diskUsageSpacing}>
			<label label={""} class={"disk icon"}/>
			<label
				label={disk}
			/>
		</box>
	);
};
