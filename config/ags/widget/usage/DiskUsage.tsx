import { bind, Variable } from "astal";
import { diskUsageSpacing, diskUsagePoolRate, enableBarUsageDisk } from "../common/Variables";

const disk = Variable<string>("").poll(
	diskUsagePoolRate,
	"df -h /",
	(out) => {
	const lines = out.split('\n');
	if (lines.length >= 2)
		return lines[1].split(/\s+/)[4];
	return "error";
});

export default () => {
    if (enableBarUsageDisk === false) {
        return (
            <box visible={false} />
        );
    }

	return (
		<box className={"disk usage"} spacing={diskUsageSpacing}>
			<label label={""} className={"disk icon"}/>
			<label label={bind(disk)}/>
		</box>
	);
};
