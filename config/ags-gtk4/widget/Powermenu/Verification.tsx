import PopupWindow from "../../common/PopupWindow";
import PowermenuService from "../../service/Powermenu";
import { spacing } from "../../lib/variables";
import { Gdk, Gtk, hook } from "astal/gtk4";
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
			onKeyPressed={(_, keyval) => {
				if (keyval === Gdk.KEY_Escape) {
					toggleWindow(namespace);
				}
			}}
			setup={(self) =>
				hook(self, self, "notify::visible", () => {
					button.ref!.grab_focus();
				})
			}
		>
			<box spacing={spacing * 2} vertical cssClasses={[namespace]}>
				<label
					halign={Gtk.Align.START}
					cssClasses={["verification__title"]}
					label={bind(PowermenuService, "title")}
				/>
				<label
					halign={Gtk.Align.START}
					cssClasses={["verification__description"]}
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
