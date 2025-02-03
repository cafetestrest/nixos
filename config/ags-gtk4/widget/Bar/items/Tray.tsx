import { Gdk, Widget, Gtk } from "astal/gtk4";
import { bind, Gio } from "astal";
import AstalTray from "gi://AstalTray";

type TrayItem = ReturnType<ReturnType<typeof AstalTray.Tray.get_default>["get_item"]>;

function createMenu(menuModel: Gio.MenuModel, actionGroup: Gio.ActionGroup): Gtk.PopoverMenu {
	const menu: Gtk.PopoverMenu = Gtk.PopoverMenu.new_from_model(menuModel);
	menu.insert_action_group("dbusmenu", actionGroup);
	return menu;
}

const SysTrayItem = (item: TrayItem) => {
	let menu: Gtk.PopoverMenu = createMenu(item.menu_model, item.action_group);

	const button = (
		<button
			cssClasses={["systray-item", "bar__tray-item"]}
			halign={Gtk.Align.CENTER}
			valign={Gtk.Align.CENTER}
			tooltip_markup={bind(item, "tooltip_markup")}
			focus_on_click={false}
			use_underline={false}
			onButtonPressed={(btn, event) => {
				const buttonEvent = event.get_button();

				if (buttonEvent === Gdk.BUTTON_PRIMARY) {
					menu.set_position(Gtk.PositionType.BOTTOM);
					menu.set_parent(btn);
					menu.popup();
				}
				if (buttonEvent === Gdk.BUTTON_SECONDARY) {
					menu.set_position(Gtk.PositionType.BOTTOM);
					menu.set_parent(btn);
					menu.popup();
				}
				if (buttonEvent === Gdk.BUTTON_MIDDLE) {
					item.activate(0, 0);
				}
			}}
		>
			<image gicon={bind(item, "gicon")} halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} />
		</button>
	);

	item.connect("notify::menu-model", () => {
		item.about_to_show()
		const newMenu = createMenu(item.menu_model, item.action_group);
		menu.unparent();
		menu = newMenu;
	});

	item.connect("notify::action-group", () => {
		const newMenu = createMenu(item.menu_model, item.action_group);
		menu.unparent();
		menu = newMenu;
	});

	return button;
};

const setupTray = (box: Gtk.Box) => {
	const systemTray = AstalTray.Tray.get_default();
	const items = new Map<string, ReturnType<typeof SysTrayItem>>();

	const addItem = (id: string) => {
		const item = systemTray.get_item(id);
		if (item) {
			const trayItem = SysTrayItem(item);
			items.set(id, trayItem);
			box.append(trayItem);
			trayItem.show();
		}
	};

	const removeItem = (id: string) => {
		const trayItem = items.get(id);
		if (trayItem) {
			trayItem.unparent();
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
export default () => <box cssClasses={["tray", "container"]} halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} hexpand vexpand vertical setup={setupTray} />;
