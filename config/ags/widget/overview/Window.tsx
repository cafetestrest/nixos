import { Astal, Gtk, Gdk } from "astal/gtk3";
import cairo from 'cairo';
import icons, { substitutions } from "../../lib/icons";
import { getHyprlandClientIcon } from "../bar/items/Taskbar";
import {
    overviewScale,
} from "../common/Variables";
import AstalHyprland from "gi://AstalHyprland";
import { hideOverview } from "./OverviewPopupWindow";

const Hyprland = AstalHyprland.get_default();
const TARGET = [Gtk.TargetEntry.new("text/plain", Gtk.TargetFlags.SAME_APP, 0)]

/**
  * @param {import('gi://Gtk?version=3.0').default.Widget} widget
  * @returns {any} - missing cairo type
  */
function createSurfaceFromWidget(widget) {
    const alloc = widget.get_allocation()
    const surface = new cairo.ImageSurface(
        cairo.Format.ARGB32,
        alloc.width,
        alloc.height,
    )
    const cr = new cairo.Context(surface)
    cr.setSourceRGBA(255, 255, 255, 0)
    cr.rectangle(0, 0, alloc.width, alloc.height)
    cr.fill()
    widget.draw(cr)
    return surface
}

const focus = (address: string) => Hyprland.dispatch("focuswindow", `address:${address}`);
const close = (address: string) => Hyprland.dispatch("closewindow", `address:${address}`);

export default ({ address, size: [w, h], class: c, title }) => (
	<button
		className={"client"}
		tooltipText={`${title}`}
		onClickRelease={(_, event) => {
			if (!address) {
				return;
			}

			switch (event.button) {
				case Gdk.BUTTON_PRIMARY:
					focus(address)
					return hideOverview();
				case Gdk.BUTTON_SECONDARY:
					return close(address);
				case Gdk.BUTTON_MIDDLE:
					return close(address);
			}
		}}
		setup={(btn) => {
			btn.hook(btn, "drag-data-get", (_w, _c, data) => data.set_text(address, address.length));
			btn.hook(btn, "drag-begin", (_, context) => {
				Gtk.drag_set_icon_surface(context, createSurfaceFromWidget(btn));
				btn.toggleClassName('hidden', true);
			});
			btn.hook(btn, "drag-end", () => btn.toggleClassName('hidden', false));
			btn.drag_source_set(Gdk.ModifierType.BUTTON1_MASK, TARGET, Gdk.DragAction.COPY);
		}}
        attribute={address}
	>
		<icon
			css={`
				min-width: ${w * overviewScale * 0.77}px;
            	min-height: ${h * overviewScale * 0.72}px;
			`}
			setup={(self) => {
                const cls = c;
                const icon = substitutions.icons[cls]
                    ? substitutions.icons[cls]
                    : Astal.Icon.lookup_icon(cls)
                        ? cls
                        : icons.fallback.executable;

				self.set_icon(getHyprlandClientIcon(c, icon));
			}}
		/>
	</button>
);
