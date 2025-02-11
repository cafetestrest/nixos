import { Gtk } from "astal/gtk3";
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
			className={`qs-page ${label.toLowerCase()}`}
			vertical={true}
		>
			<centerbox className="qs-page-header" spacing={12}>
				<button
					hexpand={false}
					halign={Gtk.Align.START}
					className="qs-page-header-button"
					onClicked={() => qsPage.set("main")}
				>
					<icon icon={icons.ui.arrow.left} className={"page-icon"} />
				</button>
				<label
					className="qs-page-header-title"
					halign={Gtk.Align.CENTER}
					hexpand={true}
					label={label}
				/>
				{refresh ? (
					<button
						halign={Gtk.Align.END}
						hexpand={false}
						className="qs-page-header-button"
						onClicked={refresh}
					>
						<icon hexpand={false} icon={icons.ui.refresh} className={"page-icon"} />
					</button>
				) : (
					<box visible={false}/>
				)}
			</centerbox>
			<scrollable vexpand={true} className="qs-page-content">
				{child}
			</scrollable>
		</box>
	);
};
