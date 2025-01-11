import PopupWindow from "../../common/PopupWindow";
import PowermenuService from "../../service/Powermenu";
import { spacing } from "../../lib/variables";
import { Gdk, Gtk } from "astal/gtk3";
import { bind, exec } from "astal";
import { toggleWindow } from "../../lib/utils";
import Button from "../../common/Button";

export const namespace = "verification";

export default () => {
	const button = {};

	return (
		<PopupWindow
			scrimType="opaque"
			name={namespace}
			namespace={namespace}
			onKeyPressEvent={(self, event) => {
				if (event.get_keyval()[1] === Gdk.KEY_Escape) {
					toggleWindow(self.name);
				}
			}}
			setup={(self) =>
				self.hook(self, "notify::visible", () => {
					button.ref!.grab_focus();
				})
			}
		>
			<box spacing={spacing * 2} vertical className={namespace}>
				<label
					halign={Gtk.Align.START}
					className="verification__title"
					label={bind(PowermenuService, "title")}
				/>
				<label
					halign={Gtk.Align.START}
					className="verification__description"
					label={"Are you sure?"}
				/>
				<box hexpand={false} spacing={spacing} halign={Gtk.Align.END}>
					<Button
						buttonType="outlined"
						canFocus
						onClicked={() => toggleWindow(namespace)}
					>
						<label label={"No"} />
					</Button>
					<Button
						canFocus
						onClicked={() => {
							exec(PowermenuService.cmd);
							toggleWindow(namespace);
						}}
						setup={(self) => (button.ref = self)}
					>
						<label label={bind(PowermenuService, "title")} />
					</Button>
				</box>
			</box>
		</PopupWindow>
	);
};
