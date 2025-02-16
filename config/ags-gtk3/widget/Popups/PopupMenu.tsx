import { App, Astal, Gdk } from "astal/gtk3";
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
			className={"PopupMenu"}
			name={name}
			namespace={namespace}
			visible={false}
			onKeyPressEvent={(self, event) => {
				if (event.get_keyval()[1] === Gdk.KEY_Escape) {
					App.toggle_window(self.name);
				}
			}}
		>
			<box
				className={`popup-menu ${label.toLowerCase()}`}
				spacing={12}
				vertical
			>
				<box className="popup-menu__header">
					<label label={label} />
				</box>
				<scrollable className="popup-menu__content" vexpand={true}>
					{child}
				</scrollable>
			</box>
		</PopupWindow>
	);
};
