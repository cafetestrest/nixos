import { Gdk, Widget, Gtk } from "astal/gtk3";
import { bind, Gio } from "astal";
import AstalTray from "gi://AstalTray";

type TrayItem = ReturnType<ReturnType<typeof AstalTray.Tray.get_default>["get_item"]>;

function createMenu(menuModel: Gio.MenuModel, actionGroup: Gio.ActionGroup): Gtk.Menu {
	const menu: Gtk.Menu = Gtk.Menu.new_from_model(menuModel);
	menu.insert_action_group("dbusmenu", actionGroup);
	return menu;
}

const SysTrayItem = (item: TrayItem) => {
	let menu: Gtk.Menu = createMenu(item.menu_model, item.action_group);

	const button = (
		<button
			className="systray-item bar__tray-item"
			halign={Gtk.Align.CENTER}
			valign={Gtk.Align.CENTER}
			tooltip_markup={bind(item, "tooltip_markup")}
			focus_on_click={false}
			use_underline={false}
			onClick={(btn, event) => {
				if (event.button === Gdk.BUTTON_PRIMARY) {
					menu?.popup_at_widget(btn, Gdk.Gravity.EAST, Gdk.Gravity.WEST, null);
				}
				if (event.button === Gdk.BUTTON_SECONDARY) {
					menu?.popup_at_widget(btn, Gdk.Gravity.EAST, Gdk.Gravity.WEST, null);
				}
				if (event.button === Gdk.BUTTON_MIDDLE) {
					item.activate(0, 0);
				}
			}}
		>
			<icon gicon={bind(item, "gicon")} halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} />
		</button>
	);

	item.connect("notify::menu-model", () => {
		item.about_to_show()
		const newMenu = createMenu(item.menu_model, item.action_group);
		menu.destroy();
		menu = newMenu;
	});

	item.connect("notify::action-group", () => {
		const newMenu = createMenu(item.menu_model, item.action_group);
		menu.destroy();
		menu = newMenu;
	});

	return button;
};

const setupTray = (box: Widget.Box) => {
	const systemTray = AstalTray.Tray.get_default();
	const items = new Map<string, ReturnType<typeof SysTrayItem>>();

	const addItem = (id: string) => {
		const item = systemTray.get_item(id);
		if (item) {
			const trayItem = SysTrayItem(item);
			items.set(id, trayItem);
			box.add(trayItem);
			trayItem.show();
		}
	};

	const removeItem = (id: string) => {
		const trayItem = items.get(id);
		if (trayItem) {
			trayItem.destroy();
			items.delete(id);
		}
	};

	systemTray
		.get_items()
		.sort((a, b) => a.item_id.localeCompare(b.item_id))
		.forEach((item) => addItem(item.item_id));
	systemTray.connect("item_added", (_, id) => addItem(id));
	systemTray.connect("item_removed", (_, id) => removeItem(id));
};

// using custom tray from https://github.com/gitmeED331/agsv2/blob/3f667521cf36e97fe0ec77b536f15d0352795fbf/modules/Widgets/Tray.tsx
// used only as example https://github.com/Aylur/astal/blob/ebcccc4ae13f690220374497f932f58ec5fd7cfd/examples/js/simple-bar/widget/Bar.tsx#L11-L25
// menubutton does not support currently right/middle click and does not update about_to_show() automatically
export default () => <box className={"tray container"} halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} expand vertical setup={setupTray} />;
