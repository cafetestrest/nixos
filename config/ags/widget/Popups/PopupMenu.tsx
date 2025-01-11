import { App, Astal } from "astal/gtk3";
import PopupWindow from "../../common/PopupWindow";

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
			namespace={"popup-window"}
			visible={false}
			onKeyPressEvent={(self, event) => {
				const [keyEvent, keyCode] = event.get_keycode();
				if (keyEvent && keyCode == 9) {
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
