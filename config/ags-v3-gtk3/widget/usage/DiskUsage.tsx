import { createPoll } from "ags/time";
import { diskUsageSpacing, diskUsagePoolRate, enableBarUsageDisk } from "../common/Variables";

const disk = createPoll(
	"",
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
		<box class={"disk usage"} spacing={diskUsageSpacing}>
			<label label={""} class={"disk icon"}/>
			<label
				label={disk}
			/>
		</box>
	);
};
