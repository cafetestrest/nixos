import ScreenRecord from '../../services/screenrecord.js';
import { ArrowToggleButton, Menu, opened } from '../ToggleButton.js';
import icons from '../../icons.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const recorders = [
    {
        name: 'Screenshot',
        icon: icons.screenshot,
        click: () => ScreenRecord.screenshot(true),
    },
    {
        name: 'Screenshot Select',
        icon: icons.select,
        click: () => ScreenRecord.screenshot(),
    },
    {
        name: 'Screen Record',
        icon: icons.recorder.recording,
        click: () => ScreenRecord.start(),
    }
];

export const ScreenRecordToggle = () => ArrowToggleButton({
    name: 'screenrecord',
    icon: Widget.Icon(icons.screenshot),
    label: Widget.Label({ label: 'Screenshot', class_name: 'screen-record-toggle-label', }),
    connection: [opened, () => opened.value === 'screenrecord'],
    activate: () => opened.setValue('screenrecord'),
    activateOnArrow: false,
    deactivate: () => { },
});

export const ScreenRecordSelector = () => Menu({
    name: 'screenrecord',
    icon: Widget.Icon(icons.screenshot),
    title: Widget.Label('Screenrecord Selector'),
    content: [
        Widget.Box({
            vertical: true,
            children: recorders.map(({ name, icon, click }) => Widget.Button({
                hexpand: true,
                on_clicked: click,
                child: Widget.Box({
                    children: [
                        Widget.Icon(icon),
                        Widget.Label(name),
                    ],
                }),
            }))
        }),
    ]
});
