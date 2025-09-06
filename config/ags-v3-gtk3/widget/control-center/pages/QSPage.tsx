import { Gtk } from "ags/gtk3";
import { setQsPage } from "../../../lib/config";
import icons from "../../../lib/icons";

type PageProps = {
	label: string;
	child?: JSX.Element;
	refresh?: () => void;
};

export default ({ label, child, refresh = undefined }: PageProps) => {
	return (
		<box
			name={label.toLowerCase()}
			class={`qs-page ${label.toLowerCase()}`}
			vertical={true}
			$type="named"
		>
			<centerbox class={"qs-page-header"} spacing={12}>
				<button
					hexpand={false}
					halign={Gtk.Align.START}
					class={"qs-page-header-button"}
					onClicked={() => setQsPage("main")}
				>
					<icon icon={icons.ui.arrow.left} class={"page-icon"} />
				</button>
				<label
					class={"qs-page-header-title"}
					halign={Gtk.Align.CENTER}
					hexpand={true}
					label={label}
				/>
				{refresh ? (
					<button
						halign={Gtk.Align.END}
						hexpand={false}
						class={"qs-page-header-button"}
						onClicked={refresh}
					>
						<icon hexpand={false} icon={icons.ui.refresh} class={"page-icon"} />
					</button>
				) : (
					<box visible={false}/>
				)}
			</centerbox>
			<scrollable vexpand={true} class={"qs-page-content"}>
				{child}
			</scrollable>
		</box>
	);
};
