import { For } from "ags/gtk4"
import { bind, Poll } from "ags/state";

export default () => {
    const upower = new Poll(
        [{
            model: "string",
            iconName: "string",
            batteryPercentage: 0
        }],
        5000,
        "bash -c 'upower -d'",
        (stdout) => {
            // Split the string into lines for easy processing
            const lines = stdout.split('\n');

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
        },
    )

    return (
        <box
            cssClasses={["btwrapper"]}
            // spacing={5}
            $destroy={() => upower.destroy()}
        >
            <For each={bind(upower)}>
                {(power) => {
                    if (!power.model || !power.batteryPercentage || !power.iconName) {
                        return (
                            <box visible={false}/>
                        );
                    }

                    return (
                        <box
                            cssClasses={["bt-usage"]}
                            // spacing={5}
                        >
                            <image
                                cssClasses={["bt-icon"]}
                                iconName={power.iconName}
                            />
                            <label label={power.batteryPercentage + "%"} />
                        </box>
                    );
                }}
            </For>
        </box>
    );
}
