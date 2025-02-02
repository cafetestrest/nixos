import icons from "../../lib/icons";
import { controlCenterPage } from "./index";
import { Gtk } from "astal/gtk4";
import { Binding } from "astal";

type PageProps = {
	label: string;
	child?: JSX.Element;
	scanning?: Binding<boolean>;
	refresh?: () => void;
};

export default ({ label, child, scanning, refresh = undefined }: PageProps) => {
	return (
		<box
			name={label.toLowerCase()}
			cssClasses={["control-center__page", `${label.toLowerCase()}`]}
			vertical={true}
		>
			<centerbox cssClasses={["control-center__page_header"]}>
				<button
					hexpand={false}
					halign={Gtk.Align.START}
					cssClasses={["control-center__page_header_button"]}
					onClicked={() => controlCenterPage.set("main")}
				>
					<image iconName={icons.ui.arrow.left} cssClasses={["page-icon"]} />
				</button>
				<label
					cssClasses={["control-center__page_header_title"]}
					halign={Gtk.Align.CENTER}
					hexpand={true}
					label={label}
				/>
				{refresh ? (
					<button
						halign={Gtk.Align.END}
						hexpand={false}
						cssClasses={["control-center__page_header_button"]}
						onClicked={refresh}
					>
						<image hexpand={false} iconName={icons.ui.refresh} cssClasses={["page-icon"]} />
					</button>
				) : (
					<box />
				)}
			</centerbox>
			<Gtk.ScrolledWindow vexpand={true} cssClasses={["control-center__page_content"]}>
				{child}
			</Gtk.ScrolledWindow>
		</box>
	);
};
