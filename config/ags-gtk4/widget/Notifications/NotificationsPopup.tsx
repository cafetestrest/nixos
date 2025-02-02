import Notification from "./Notification";
import Notifd from "gi://AstalNotifd";
import { Gtk, Gdk, Astal } from "astal/gtk4";
import { Subscribable } from "astal/binding";
import { bind, timeout, Variable } from "astal";

export const namespace = "notifications-popup";
const TIMEOUT_DELAY = 5000;

class PopupNotificationsMap implements Subscribable {
	private map: Map<number, Gtk.Widget> = new Map();
	private var: Variable<Array<Gtk.Widget>> = Variable([]);

	private notifiy() {
		this.var.set([...this.map.values()].reverse());
	}

	constructor() {
		const notifd = Notifd.get_default();

		notifd.connect("notified", (_, id) => {
			this.set(
				id,
				Notification({
					notification: notifd.get_notification(id)!,
					onHoverLost: () => {
						const widget = this.map.get(id);

						if (widget) {
							this.delete(id)
						}
					},
					setup: (self) => {
						timeout(TIMEOUT_DELAY, () => {
							windowVisible.set(false);

							const widget = this.map.get(id);

							if (widget) {
								this.delete(id)
							}
						});
					},
				}),
			);
		});
		notifd.connect("resolved", (_, id) => {
            const widget = this.map.get(id);

			if (widget) {
				this.delete(id)
			}
		});
	}

	private set(key: number, value: Gtk.Widget) {
		windowVisible.set(true);

		this.map.get(key)?.unparent();
		this.map.set(key, value);
		this.notifiy();
	}

	private delete(key: number) {
		windowVisible.set(false);

		this.map.get(key)?.unparent();
		this.map.delete(key);
		this.notifiy();
	}

	get() {
		return this.var.get();
	}

	subscribe(callback: (list: Array<Gtk.Widget>) => void) {
		return this.var.subscribe(callback);
	}
}

const windowVisible = Variable(false);

export default (monitor: Gdk.Monitor) => {
	const notifs = new PopupNotificationsMap();

	return (
		<window
			visible={bind(windowVisible)}
			layer={Astal.Layer.OVERLAY}
			marginTop={20}
			cssClasses={["NotificationsPopup"]}
			namespace={namespace}
			anchor={Astal.WindowAnchor.TOP}
			gdkmonitor={monitor}
		>
			<box cssClasses={[namespace]} spacing={8} vertical={true} noImplicitDestroy>
				{bind(notifs)}
			</box>
		</window>
	);
};
