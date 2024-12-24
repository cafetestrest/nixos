import Variable from 'resource:///com/github/Aylur/ags/variable.js';
import GLib from 'gi://GLib';
import options from './options.js';

const intval = options.systemFetchInterval;

export const clock = Variable(GLib.DateTime.new_now_local(), {
    poll: [1000, () => GLib.DateTime.new_now_local()],
});

export const uptime = Variable('', {
    poll: [60_000, 'cat /proc/uptime', line => {
        const uptime = Number.parseInt(line.split('.')[0]) / 60;
        if (uptime > 18 * 60)
            return 'Go Sleep';

        const h = Math.floor(uptime / 60);
        const s = Math.floor(uptime % 60);
        return `${h}:${s < 10 ? '0' + s : s}`;
    }],
});

export const distro = GLib.get_os_info('ID');

export const distroIcon = (() => {
    switch (distro) {
        case 'fedora': return '';
        case 'arch': return '';
        case 'nixos': return '';
        case 'debian': return '';
        case 'opensuse-tumbleweed': return '';
        case 'ubuntu': return '';
        case 'endeavouros': return '';
        default: return '';
    }
})();

/** @type {function([string, string] | string[]): number} */
const divide = ([total, free]) => Number.parseInt(free) / Number.parseInt(total);

export const cpu = Variable(0, {
    poll: [intval, 'top -b -n 1', out => divide(['100', out.split('\n')
        .find(line => line.includes('Cpu(s)'))
        ?.split(/\s+/)[1]
        .replace(',', '.') || '0'])],
});

export const ram = Variable(0, {
    poll: [intval, 'free', out => divide(out.split('\n')
        .find(line => line.includes('Mem:'))
        ?.split(/\s+/)
        .splice(1, 2) || ['1', '1'])],
});

// export const temp = Variable(0, {
//     poll: [intval, 'cat ' + options.temperature, n => {
//         return Number.parseInt(n) / 100_000;
//     }],
// });

export const ramGB = Variable(0, {
    poll: [options.systemFetchInterval, "free --giga -h", out => out.split('\n')
        .find(line => line.includes('Mem:'))
        .split(/\s+/)
        .splice(2, 1)]
});

export const disk = Variable(0, {
    poll: [600_000, "df -h /", out => {
        const lines = out.split('\n');
        if (lines.length >= 2) {
            return lines[1].split(/\s+/)[4].replace('%', '') / 100;
        }
        return -1;
    }]
});

export const upower = Variable(0, {
    poll: [options.systemFetchInterval, "upower -d", out => {
        // Split the string into lines for easy processing
        const lines = out.split('\n');

        let devices = [];
        let currentDevice = {};

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
                currentDevice = { iconName: '', batteryPercentage: 0 };
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
        if (currentDevice.model) {
            devices.push(currentDevice);
        }

        return devices;
    }]
});
