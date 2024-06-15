import { PopupContent } from '../bar/buttons/Weather.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import PopupWindow from '../misc/PopupWindow.js';
import options from '../options.js';

export default () => PopupWindow({
    name: 'weather',
    anchor: ['top'],
    setup: self => self.hook(options.bar.position, () => {
        self.anchor = [options.bar.position.value];
        if (options.bar.position.value === 'top')
            self.transition = 'slide_down';

        if (options.bar.position.value === 'bottom')
            self.transition = 'slide_up';
    }),
    child: Widget.Box({
        class_name: 'dashboard',
        children: [
            PopupContent(),
        ],
    }),
});
