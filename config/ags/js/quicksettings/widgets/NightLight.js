import Nightlight from '../../services/nightlight.js';
import { SimpleToggleButton } from '../ToggleButton.js';
import icons from '../../icons.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

export const NightlightIndicator = () => Widget.Icon({
    setup: self => self.hook(Nightlight, () => {
        self.icon = icons.nightlight[Nightlight.mode];
    }),
});

export const NightlightToggle = () => SimpleToggleButton({
    icon: Widget.Box({
        children: [
            NightlightIndicator(),
            Widget.Label({
                setup: self => self.hook(Nightlight, () => {
                    let mode = Nightlight.mode;
                    let text;
                    if (mode === 'auto') {
                        text = 'Auto';
                    } else if (mode === 'on') {
                        text = 'Enabled';
                    } else {
                        text = 'Disabled';
                    }
                    self.label = text;
                }),
            }),
        ]
    }),
    toggle: () => {
        if (Nightlight.mode === "auto") {
            return Nightlight.mode = "on";
        } else if (Nightlight.mode === "on") {
            return Nightlight.mode = "off";
        } else {
            return Nightlight.mode = "auto";
        }
    },
    connection: [Nightlight, () => Nightlight.mode !== 'off']
});
