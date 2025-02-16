import { Gtk, Gdk, Widget, Astal } from "astal/gtk3";
import { Subscribable} from "astal/binding";
import { Binding } from "astal";
import icons from "../../../lib/icons";
import { qsRevertRevealerStatus, qsToggleRevealer } from "../../common/Variables";

type QSToggleProps = {
	icon: Widget.IconProps["icon"] | Binding<string>;
	label?: Widget.LabelProps["label"] | [Subscribable<unknown>, () => string];
	onPrimaryClick?: () => void;
	className?: [Subscribable<unknown>, () => string] | Binding<string>;
    hasArrow?: boolean;
    revelaer?: string;
} & Widget.ButtonProps;

export default ({
	className,
	onPrimaryClick,
    icon,
	label,
    hasArrow,
    revelaer,
	...props
}: QSToggleProps) => {
    return (
        <button
            className={className}
            onClickRelease={(_, event: Astal.ClickEvent) => {
				switch (event.button) {
					case Gdk.BUTTON_PRIMARY:
					case Gdk.BUTTON_SECONDARY:
					case Gdk.BUTTON_MIDDLE:
                        if (onPrimaryClick) {
                            qsRevertRevealerStatus(revelaer ?? "");
							onPrimaryClick();
						}
						break;
			}}}
            onKeyReleaseEvent={(_, event) => {
				const key = event.get_keyval()[1];
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
                <icon
                    icon={icon}
                />
                {label && (
                    <label
                        halign={Gtk.Align.START}
                        label={label}
                        hexpand
                    />
                )}
                {hasArrow && (
                    <icon
                        halign={Gtk.Align.END}
                        icon={icons.ui.arrow.right}
                    />
                )}
            </box>
        </button>
    );
}
