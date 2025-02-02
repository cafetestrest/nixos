import { App, Gtk, Widget } from "astal/gtk4";
import AstalApps from "gi://AstalApps?version=0.1";
import { namespace } from ".";
import Pango from "gi://Pango";

export const MathResult = (mathText: string) => {
    return (
        <box halign={Gtk.Align.CENTER} vertical>
            <label label={mathText} cssClasses={["math-result"]} />
        </box>
    );
};

export const MathResultWithQueryText = (mathText: string, query: string) => {
    const characterLimitPerRow = 43; // Define character limit per row
    const totalCharacterLimit = 111; // Define total character limit

    // Truncate the query if it exceeds the total character limit
    if (query.length > totalCharacterLimit) {
        query = "..." + query.slice(-totalCharacterLimit + 3);
    }

    // Split the query into chunks based on the character limit per row
    const splitTextIntoRows = (text: string, limit: number): string[] => {
        const rows: string[] = [];
        for (let i = 0; i < text.length; i += limit) {
            rows.push(text.slice(i, i + limit));
        }
        return rows;
    };

    const rows = splitTextIntoRows(query, characterLimitPerRow);

    // Create labels for each row and add them dynamically
    const queryLabels = rows.map((rowText, index) => (
        <label label={rowText} cssClasses={["math-query"]} />
    ));

    // Return the final structure
    return (
        <box halign={Gtk.Align.CENTER} vertical>
            <box vertical>{queryLabels}</box>
            <label label={mathText} cssClasses={["math-result"]} />
        </box>
    );
};

export default (app: AstalApps.Application) => {
	const title = new Gtk.Label({
		cssClasses: ["title"],
		label: app.name,
		xalign: 0,
		valign: Gtk.Align.CENTER,
		ellipsize: Pango.EllipsizeMode.END,
	});

	const description = new Gtk.Label({
		cssClasses: ["description"],
		label: app.description || "",
		wrap: true,
		xalign: 0,
		ellipsize: Pango.EllipsizeMode.END,
	});

	const icon = new Gtk.Image({
		iconName: app.iconName || "",
	});

	const textBox = Widget.Box({
		vertical: true,
		valign: Gtk.Align.CENTER,
		children: app.description ? [title, description] : [title],
	});

	const AppItem = Widget.Button({
		cssClasses: ["app-launcher__item"],
		on_clicked: () => {
			App.toggle_window(namespace);
			app.launch();
		},
		child: Widget.Box({
			spacing: 8,
			children: [icon, textBox],
		}),
	});

	return Object.assign(AppItem, {
		app,
	});
};
