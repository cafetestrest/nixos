import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js';
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import OverviewButton from './buttons/OverviewButton.js';
import Workspaces from './buttons/Workspaces.js';
import FocusedClient from './buttons/FocusedClient.js';
import MediaIndicator from './buttons/MediaIndicator.js';
import DateButton from './buttons/DateButton.js';
import NotificationIndicator from './buttons/NotificationIndicator.js';
import SysTray from './buttons/SysTray.js';
import ColorPicker from './buttons/ColorPicker.js';
import SystemIndicators from './buttons/SystemIndicators.js';
import PowerMenu from './buttons/PowerMenu.js';
import ScreenRecord from './buttons/ScreenRecord.js';
import BatteryBar from './buttons/BatteryBar.js';
import SubMenu from './buttons/SubMenu.js';
import Recorder from '../services/screenrecord.js';
// import * as System from './buttons/System.js';
import Taskbar from './buttons/Taskbar.js';
import options from '../options.js';

import * as Dock from '../dock/Dock.js';
import WorkspacesHypr from './buttons/WorkspacesHypr.js';
import { UsageCPU, UsageDisk, UsageRAM, UsagePower } from './buttons/Usage.js';
import Screenshot from './buttons/Screenshot.js';
import Note from './buttons/Note.js';
import BluetoothDevice from './buttons/BluetoothDevice.js';
import BluetoothDevices from './buttons/BluetoothDevices.js';
import BluetoothDevicesV2 from './buttons/BluetoothDevicesV2.js';
import { TemperatureIndicator } from './buttons/Weather.js';

const submenuItems = Variable(1);
SystemTray.connect('changed', () => {
    submenuItems.setValue(SystemTray.items.length + 1);
});

/**
 * @template {import('types/service').default} T
 * @param {T=} service
 * @param {(service: T) => boolean=} condition
 */
const SeparatorDot = (service, condition) => Widget.Separator({
    vpack: 'center',
    setup: self => {
        const visibility = () => {
            if (!options.bar.separators.value)
                return self.visible = false;

            self.visible = condition && service
                ? condition(service)
                : options.bar.separators.value;
        };

        if (service && condition)
            self.hook(service, visibility);

        self.on('draw', visibility);
        self.bind('visible', options.bar.separators);
    },
});

const Start = () => Widget.Box({
    class_name: 'start',
    children: [
        OverviewButton(),
        SeparatorDot(),
        Taskbar(),
        // SeparatorDot(),
        Workspaces(),
        // Dock.Taskbar(),
        // SeparatorDot(),
        // WorkspacesHypr(),
        SeparatorDot(),
        // FocusedClient(),
        Widget.Box({ hexpand: true }),
        MediaIndicator({ direction: 'left' }),
        SeparatorDot(Mpris, m => m.players.length > 0),
    ],
});

const Center = () => Widget.Box({
    class_name: 'center',
    children: [
        DateButton({ format: '%a %b %e   %H:%M:%S' }),
        TemperatureIndicator(),
    ],
});

const End = () => Widget.Box({
    class_name: 'end',
    children: [
        SeparatorDot(Notifications, n => n.notifications.length > 0 || n.dnd),
        NotificationIndicator({ direction: 'right' }),
        Widget.Box({ hexpand: true }),

        UsageCPU(),
        UsageRAM(),
        UsageDisk(),
        UsagePower(),
        // BluetoothDevice(),
        // BluetoothDevices(),
        // BluetoothDevicesV2(),
        SeparatorDot(),
        SysTray(),
        ColorPicker(),

        // SubMenu({
        //     items: submenuItems,
        //     children: [
        //         SysTray(),
        //         ColorPicker(),
        //     ],
        // }),

        SeparatorDot(),
        ScreenRecord(),
        SeparatorDot(Recorder, r => r.recording),

        Note(),
        Screenshot(),
        SeparatorDot(),

        SystemIndicators(),
        // SeparatorDot(Battery, b => b.available),
        // BatteryBar(),
        SeparatorDot(),
        PowerMenu(),
    ],
});

/** @param {number} monitor */
export default monitor => Widget.Window({
    name: `bar${monitor}`,
    class_name: 'transparent',
    exclusivity: 'exclusive',
    monitor,
    anchor: options.bar.position.bind('value').transform(pos => ([
        pos, 'left', 'right',
    ])),
    child: Widget.CenterBox({
        class_name: 'panel',
        start_widget: Start(),
        center_widget: Center(),
        end_widget: End(),
    }),
});
