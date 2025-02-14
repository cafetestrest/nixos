import { bind, Variable } from "astal";
import { diskUsageSpacing } from "../common/Variables";

export const disk = Variable<string>("").poll(
	600_000,
	"df -h /",
	(out) => {
	const lines = out.split('\n');
	if (lines.length >= 2)
		return lines[1].split(/\s+/)[4];
	return "error";
});

export default () => {
	return (
		<box className={"disk usage"} spacing={diskUsageSpacing}>
			<label label={""} className={"disk icon"}/>
			<label label={bind(disk)}/>
		</box>
	);
};
