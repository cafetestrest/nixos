import { bind, Variable } from "astal";
import { enableBarUsageBluetooth } from "../common/Variables";

type UpowerProps = {
	model: string;
	iconName: string;
	batteryPercentage: number;
};

export const upower = Variable<Array<UpowerProps>>([]).poll(
	5000,
	"upower -d",
	(out) => {
	// Split the string into lines for easy processing
	const lines = out.split('\n');

	let devices = [];
	let currentDevice = { model:'', iconName:'', batteryPercentage:0, };

	// Loop through each line and process the device data
	lines.forEach(line => {
		line = line.trim(); // Remove leading/trailing whitespace

		// Check for new device block
		if (line.startsWith('Device:')) {
			// If there's already a device stored, push it to the list
			if (Object.keys(currentDevice).length > 0) {
				devices.push(currentDevice);
			}
			// Start processing a new device
			currentDevice = { iconName: '', batteryPercentage: 0, model:'' };
		}

		// Check for device model
		if (line.startsWith('model:')) {
			currentDevice.model = line.split(':')[1].trim();
		}

		// Check for device type and assign iconName
		if (line.includes('keyboard_')) {
			currentDevice.iconName = 'input-keyboard-symbolic';
		} else if (line.includes('mouse_')) {
			currentDevice.iconName = 'input-mouse-symbolic';
		} else if (line.includes('headset_')) {
			currentDevice.iconName = 'audio-headset-symbolic';
		}

		// Check for battery percentage
		if (line.startsWith('percentage:')) {
			const batteryPercentage = parseInt(line.split(':')[1].trim(), 10);
			if (batteryPercentage > 0) {
				currentDevice.batteryPercentage = batteryPercentage;
			}
		}
	});

	// Skip unwanted devices
	if (currentDevice.model != '') {
		devices.push(currentDevice);
	}

	return devices;
});

export default () => {
    if (enableBarUsageBluetooth === false) {
        return (
            <box visible={false} />
        );
    }

	return (
        <box className={"btwrapper"} spacing={5} onDestroy={() => upower.drop()}>
            {bind(upower).as(arr => arr.map(power => {
                if (!power.model || !power.batteryPercentage || !power.iconName) {
                    return "";
                }

                return (<box className={"bt-usage"} spacing={5}>
                    <icon icon={power.iconName} className={"bt-icon"}/>
                    <label label={power.batteryPercentage + "%"}/>
                </box>)
                }
            ))}
        </box>
	);
};
