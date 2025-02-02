import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import PopupWindow from "../../common/PopupWindow";

export const namespace = "popup-window";

type PopupMenuProps = {
	label: string;
	child?: JSX.Element;
};

export default ({ label, child }: PopupMenuProps) => {
	const name = `popup-${label.toLowerCase()}`;

	return (
		<PopupWindow
			layer={Astal.Layer.OVERLAY}
			keymode={Astal.Keymode.EXCLUSIVE}
			application={App}
			scrimType="opaque"
			className="PopupMenu"
			name={name}
			namespace={namespace}
			visible={false}
			onKeyPressed={(_, keyval) => {
				if (keyval === Gdk.KEY_Escape) {
					App.toggle_window(namespace);
				}
			}}
		>
			<box
				cssClasses={["popup-menu", `${label.toLowerCase()}`]}
				spacing={12}
				vertical
			>
				<box cssClasses={["popup-menu__header"]}>
					<label label={label} />
				</box>
				<Gtk.ScrolledWindow cssClasses={["popup-menu__content"]} vexpand={true}>
					{child}
				</Gtk.ScrolledWindow>
			</box>
		</PopupWindow>
	);
};
