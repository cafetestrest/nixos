import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import FontIcon from '../misc/FontIcon.js';
import Progress from '../misc/Progress.js';
import Indicator from '../services/onScreenIndicator.js';

export const OnScreenIndicator = ({ height = 48, width = 300 } = {}) => Widget.Box({
    class_name: 'indicator',
    css: 'padding: 1px;',
    child: Widget.Revealer({
        transition: width <= height ? 'slide_left' : 'slide_down',
        setup: self => self.hook(Indicator, (_, value) => {
            self.reveal_child = value > -1;
        }),
        child: Progress({
            width,
            height,
            vertical: width <= height ? true : false,
            setup: self => self.hook(Indicator, (_, value) => self.attribute(value)),
            child: Widget.Stack({
                vpack: 'start',
                hpack: 'center',
                hexpand: false,
                children: {
                    true: Widget.Icon({
                        hpack: 'center',
                        size: width <= height ? width : height,
                        setup: w => w.hook(Indicator, (_, _v, name) => w.icon = name || ''),
                    }),
                    false: FontIcon({
                        hpack: 'center',
                        hexpand: true,
                        css: width <= height ? `font-size: ${width}px;` : `font-size: ${height}px;`,
                        setup: w => w.hook(Indicator, (_, _v, name) => w.label = name || ''),
                    }),
                },
                setup: self => self.hook(Indicator, (_, _v, name) => {
                    self.shown = `${!!Utils.lookUpIcon(name)}`;
                }),
            }),
        }),
    }),
});

/** @param {number} monitor */
export default monitor => Widget.Window({
    name: `indicator${monitor}`,
    monitor,
    class_name: 'indicator',
    layer: 'overlay',
    anchor: ['top', 'right'],
    child: OnScreenIndicator(),
});
