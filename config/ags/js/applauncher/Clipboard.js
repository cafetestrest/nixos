import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import PopupWindow from '../misc/PopupWindow.js';
import icons from '../icons.js';
import { launchApp } from '../utils.js';

const WINDOW_NAME = 'clipboard';

const Clipboard = () => {
    const mkItems = () => [
        // Widget.Separator({ hexpand: true }),
        ...Utils.exec(`/home/${Utils.USER}/.config/scripts/clipboardtoggle.sh`).split(/\r?\n/).map((app, index) => {
            return Widget.Revealer({
                setup: w => w.attribute = { app, revealer: w },
                child: Widget.Box({
                    vertical: true,
                    children: [
                        // Widget.Separator({ hexpand: true }),
                        Widget.Button({
                            class_name: 'app-item',
                            attribute: app,
                            child: Widget.Label({
                                class_name: 'title',
                                label: app,
                                xalign: 0,
                                vpack: 'center',
                                truncate: 'end',
                            }),
                            on_clicked: () => {
                                Utils.execAsync(`copyq select ${index}`)
                                App.closeWindow(WINDOW_NAME);
                            },
                        }),
                        // Widget.Separator({ hexpand: true }),
                    ],
                }),
            })
        }),
        // Widget.Separator({ hexpand: true }),
    ];

    let items = mkItems();

    const list = Widget.Box({
        class_name: 'app-list',
        vertical: true,
        children: items,
    });

    const entry = Widget.Entry({
        hexpand: true,
        primary_icon_name: icons.apps.search,

        // set some text so on-change works the first time
        text: '-',
        on_change: ({ text }) => items.map(item => {
            if (item.attribute) {
                const { app, revealer } = item.attribute;
                revealer.reveal_child = app.match(text);
            }
        }),
    });

    return Widget.Box({
        className: 'clipboard',
        vertical: true,
        children: [
            entry,
            Widget.Box({
                className: 'header-separator',
            }),
            Widget.Scrollable({
                className: 'scrollable',
                hscroll: 'never',
                child: list,
            }),
        ],
        setup: self => self.hook(App, (_, win, visible) => {
            if (win !== WINDOW_NAME)
                return;

            // doing this twice to get latest results
            items = mkItems();
            list.children = items;

            entry.text = '-';
            entry.text = '';

            if (visible) {
                entry.grab_focus();
            }
            else {
                items = mkItems();
                list.children = items;
            }
        }),
    });
};

export default () => PopupWindow({
    name: WINDOW_NAME,
    transition: 'slide_down',
    child: Clipboard(),
    anchor: [],
    // anchor: options.applauncher.anchor.bind('value'),
});
