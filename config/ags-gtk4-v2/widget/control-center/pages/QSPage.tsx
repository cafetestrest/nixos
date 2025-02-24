import { Gtk } from "astal/gtk4";
import { qsPage } from "../../common/Variables";
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
			cssClasses={["qs-page", `${label.toLowerCase()}`]}
			vertical={true}
		>
			{/* //todo spacing */}
			<centerbox cssClasses={["qs-page-header"]} spacing={12}>
				<button
					hexpand={false}
					halign={Gtk.Align.START}
					cssClasses={["qs-page-header-button"]}
					onClicked={() => qsPage.set("main")}
				>
					<image iconName={icons.ui.arrow.left} cssClasses={["page-icon"]} />
				</button>
				<label
					cssClasses={["qs-page-header-title"]}
					halign={Gtk.Align.CENTER}
					hexpand={true}
					label={label}
				/>
				{refresh ? (
					<button
						halign={Gtk.Align.END}
						hexpand={false}
						cssClasses={["qs-page-header-button"]}
						onClicked={refresh}
					>
						<image hexpand={false} iconName={icons.ui.refresh} cssClasses={["page-icon"]} />
					</button>
				) : (
					<box visible={false}/>
				)}
			</centerbox>
			<Gtk.ScrolledWindow vexpand={true} cssClasses={["qs-page-content"]}>
				{child}
			</Gtk.ScrolledWindow>
		</box>
	);
};
