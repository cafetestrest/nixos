import { Gtk, Gdk, Widget } from "astal/gtk4";
import { Subscribable} from "astal/binding";
import { Binding } from "astal";
import icons from "../../../lib/icons";
import { qsRevertRevealerStatus, qsToggleRevealer } from "../../common/Variables";

type QSToggleProps = {
	icon: Widget.ImageProps["iconName"] | Binding<string>;
	label?: Widget.LabelProps["label"] | [Subscribable<unknown>, () => string];
	onPrimaryClick?: () => void;
	className?: [Subscribable<unknown>, () => string] | Binding<string> | string;
    hasArrow?: boolean;
    revelaer?: string;
} & Widget.ButtonProps;

export default ({
	cssClasses,
	onPrimaryClick,
    icon,
	label,
    hasArrow,
    revelaer,
	...props
}: QSToggleProps) => {
    return (
        <button
            cssClasses={cssClasses}
            onButtonPressed={(_, event: Gdk.ButtonEvent) => {
				switch (event.get_button()) {
					case Gdk.BUTTON_PRIMARY:
					case Gdk.BUTTON_SECONDARY:
					case Gdk.BUTTON_MIDDLE:
                        if (onPrimaryClick) {
                            qsRevertRevealerStatus(revelaer ?? "");
							onPrimaryClick();
						}
						break;
			}}}
            onKeyPressed={(_, key: number) => {
				if (revelaer && (key === Gdk.KEY_Return || key === Gdk.KEY_space || key === Gdk.KEY_KP_Enter)) {
                    qsRevertRevealerStatus(revelaer ?? "");
                    qsToggleRevealer(revelaer);
				} else if (key === Gdk.KEY_Return || key === Gdk.KEY_space || key === Gdk.KEY_KP_Enter) {
					if (onPrimaryClick) {
						onPrimaryClick();
					}
				}
			}}
            {...props}
        >
            <box
				halign={!label ? Gtk.Align.CENTER : Gtk.Align.FILL}
            >
                <image
                    iconName={icon}
                />
                {label && (
                    <label
                        halign={Gtk.Align.START}
                        label={label}
                        hexpand={true}
                    />
                )}
                {hasArrow && (
                    <image
                        halign={Gtk.Align.END}
                        iconName={icons.ui.arrow.right}
                    />
                )}
            </box>
        </button>
    );
}
