import Hyprland from "gi://AstalHyprland";
import { Gtk } from "astal/gtk4";
import { bind } from "astal";
import BarButton from "../BarButton";
import icons, { substitutions } from "../../../lib/icons";
import { lookUpIcon } from "../../../lib/utils";
import Pango from "gi://Pango";

export default () => {
	const hypr = Hyprland.get_default();
	const focused = bind(hypr, "focusedClient");

	const activeWindowData = {
		icon: icons.fallback.executable,
		title: "",
	};

	const icon = focused.as((focused) => {
		if (focused) {
			const cls = focused.class;
			activeWindowData.icon = substitutions.icons[cls]
				? substitutions.icons[cls]
				: lookUpIcon(cls)
					? cls
					: icons.fallback.executable;
		}
		return activeWindowData.icon;
	});

	const title = focused.as((focused) => {
		if (focused) activeWindowData.title = focused.title.toString();
		return activeWindowData.title;
	});

	return (
		<revealer
			transitionType={Gtk.RevealerTransitionType.CROSSFADE}
			transitionDuration={300}
			revealChild={focused.as(Boolean)}
		>
			<BarButton className="bar__active-app">
				<box spacing={8}>
					<image iconName={icon} />
					<label label={title} ellipsize={Pango.EllipsizeMode.END} maxWidthChars={24} />
				</box>
			</BarButton>
		</revealer>
	);
};
