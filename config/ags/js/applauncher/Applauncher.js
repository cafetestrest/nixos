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

            function addTextToList(text, list) {
                const limit = 37;
                const maxLength = 111;

                // If text exceeds 111 characters, trim the start and add "..."
                if (text.length > maxLength) {
                    text = '...' + text.slice(-maxLength + 3); // Keep last 108 characters, replacing the beginning with "..."
                }

                const numLines = Math.ceil(text.length / limit);

                // Loop through the text and add each chunk as a row
                for (let i = 0; i < numLines; i++) {
                    const start = i * limit;
                    const end = start + limit;
                    const rowText = text.slice(start, end);

                    list.add(Widget.Label({
                        className: 'math-result',
                        label: rowText + '',
                    }));
                }
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
                addTextToList(text, list)

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

    function focus() {
        entry.text = ""
        entry.set_position(-1)
        entry.select_region(0, -1)
        entry.grab_focus()
        // favs.reveal_child = true
    }

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
                focus()
                // entry.grab_focus();
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
    // transition: 'slide_down',
    child: Applauncher(),
    // anchor: [],
    // anchor: options.applauncher.anchor.bind('value'),
});
