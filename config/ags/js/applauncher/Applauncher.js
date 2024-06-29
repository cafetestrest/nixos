import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import PopupWindow from '../misc/PopupWindow.js';
import AppItem from './AppItem.js';
import icons from '../icons.js';
import { launchApp } from '../utils.js';
import options from '../options.js';

const WINDOW_NAME = 'applauncher';

const Applauncher = () => {
    const mkItems = () => [
        // Widget.Separator({ hexpand: true }),
        ...Applications.query('').flatMap(app => Widget.Revealer({
            setup: w => w.attribute = { app, revealer: w },
            child: Widget.Box({
                vertical: true,
                children: [
                    // Widget.Separator({ hexpand: true }),
                    AppItem(app),
                    // Widget.Separator({ hexpand: true }),
                ],
            }),
        })),
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
        on_accept: ({ text }) => {
            const list = Applications.query(text || '');
            if (list[0]) {
                App.toggleWindow(WINDOW_NAME);
                launchApp(list[0]);
            }
        },
        on_change: ({ text }) => items.map(item => {
            function containsMathOperation(text) {
                // Define a regular expression to match mathematical operators
                const mathOperationRegex = /[+\-*/]/;

                // Use the test method to check if the text contains a math operation
                return mathOperationRegex.test(text);
            }

            let mathResult = null;

            if (containsMathOperation(text)) {
                try {
                    mathResult = eval(text);
                } catch (error) {
                    // do nothing
                }
            }

            list.children.map(item => {
                if (item.app)
                    item.visible = item.app.match(text);

                // remove old records
                if (item.class_name === 'math-result')
                    item.destroy()
            });

            if (containsMathOperation(text) && mathResult) {
                list.add(Widget.Label({
                    className: 'math-result',
                    label: text + '',
                }));

                list.add(Widget.Label({
                    className: 'math-result',
                    label: '' + mathResult,
                }));

                // logic to go over all items in the list, if it contains class math-result it should be visible
                list.children.map(item => {
                    if (item.class_name === 'math-result') {
                        item.visible = true;
                    }
                });
            }

            if (item.attribute) {
                const { app, revealer } = item.attribute;
                revealer.reveal_child = app.match(text);
            }
        }),
    });

    return Widget.Box({
        className: 'applauncher',
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
    anchor: [],
    child: Applauncher(),
});
