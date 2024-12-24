import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Header from './widgets/Header.js';
import PopupWindow from '../misc/PopupWindow.js';
import { VolumeWithoutPercent, Volume, Microhone, SinkSelector, AppMixer } from './widgets/Volume.js';
import { NetworkToggle, WifiSelection } from './widgets/Network.js';
import { BluetoothToggle, BluetoothDevices } from './widgets/Bluetooth.js';
import { ThemeToggle, ThemeSelector } from './widgets/Theme.js';
import { ProfileToggle, ProfileSelector } from './widgets/AsusProfile.js';
import Media from './widgets/Media.js';
import Brightness from './widgets/Brightness.js';
import DND from './widgets/DND.js';
import MicMute from './widgets/MicMute.js';
import options from '../options.js';

import { IdleToggle } from './widgets/Idle.js';
import { NightlightToggle } from './widgets/NightLight.js';
import { SysProgress } from '../dashboard/DateColumn.js';
import { Tooltip } from '../bar/buttons/Weather.js';
import { ScreenRecordToggle, ScreenRecordSelector } from './widgets/ScreenRecord.js';

const Row = (toggles = [], menus = []) => Widget.Box({
    vertical: true,
    children: [
        Widget.Box({
            class_name: 'row horizontal',
            children: toggles,
        }),
        ...menus,
    ],
});

const Homogeneous = toggles => Widget.Box({
    homogeneous: true,
    children: toggles,
});

export default () => PopupWindow({
    name: 'quicksettings',
    exclusivity: "exclusive",
    anchor: ['top', 'right'],
    setup: self => self.hook(options.bar.position, () => {
        self.anchor = ['right', options.bar.position.value];
        if (options.bar.position.value === 'top')
            self.transition = 'slide_down';

        if (options.bar.position.value === 'bottom')
            self.transition = 'slide_up';
    }),
    child: Widget.Box({
        vertical: true,
        // children: [
        //     Header(),
        //     Widget.Box({
        //         class_name: 'sliders-box vertical',
        //         vertical: true,
        //         children: [
        //             Row(
        //                 [Volume()],
        //                 [SinkSelector(), AppMixer()],
        //             ),
        //             Microhone(),
        //             // Brightness(),
        //         ],
        //     }),
        //     Row(
        //         [Homogeneous([NetworkToggle(), BluetoothToggle()]), DND()],
        //         [
        //             // WifiSelection(), 
        //             BluetoothDevices()
        //         ],
        //     ),
        //     Row(
        //         [Homogeneous([ProfileToggle(), ThemeToggle()]), MicMute()],
        //         [ProfileSelector(), ThemeSelector()],
        //     ),
        //     Media(),
        // ],

        children: [
            // Header(),
            Row(
                [
                    Homogeneous([
                        BluetoothToggle(),
                        IdleToggle(),
                        // NetworkToggle(),
                        // Widget.Box({ class_name: 'button-spacing' }),
                    ]),
                ],
                [
                    // WifiSelection(),
                    BluetoothDevices(),
                ],
            ),
            Row(
                [
                    Homogeneous([
                        NightlightToggle(),
                        ScreenRecordToggle()
                        // Widget.Box({ class_name: 'button-spacing' }),
                    ]),
                ],
                [
                    // ProfileSelector(),
                    ScreenRecordSelector(),
                ],
            ),
            Row(
                [
                    Homogeneous([
                        DND(),
                        ThemeToggle(),
                        // Widget.Box({ class_name: 'button-spacing' }),
                        // MicMute(),
                    ]),
                ],
                [
                    // ProfileSelector(),
                    ThemeSelector(),
                ],
            ),
            Row([Widget.Box({
                class_name: 'qsvolume',
                vertical: true,
                children: [
                    Row(
                        [
                            VolumeWithoutPercent(),
                        ],
                        [
                            SinkSelector(),
                            AppMixer()
                        ],
                    ),
                    // Row(
                    //     [
                    //         // Brightness(),
                    //         Microhone(),
                    //     ],
                    // ),
                ],
            })]),
            Row(
                [
                    Widget.Box({
                        class_name: 'system-info',
                        children: [
                            SysProgress('cpu', 'Cpu', '%'),
                            Widget.Box({ class_name: 'system-info-spacing' }),
                            SysProgress('ram', 'Ram', '%'),
                            Widget.Box({ class_name: 'system-info-spacing' }),
                            SysProgress('disk', 'Disk', '%'),
                            // Widget.Box({ class_name: 'system-info-spacing' }),
                            // SysProgress('temp', 'Temperature', '°'),
                        ],
                    }),
                ],
            ),
            Media(),
            Tooltip(5),
        ],
    }),
});
