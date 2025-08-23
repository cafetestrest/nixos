import { Gtk, Gdk, Astal } from "ags/gtk3";
// import { Subscribable} from "astal/binding";
// import { Binding } from "astal";
import icons from "../../../lib/icons";
import { qsRevertRevealerStatus, qsToggleRevealer } from "../../common/Variables";

// type QSToggleProps = {
// 	icon: Widget.IconProps["icon"] | Binding<string>;
// 	label?: Widget.LabelProps["label"] | [Subscribable<unknown>, () => string];
// 	onPrimaryClick?: () => void;
// 	className?: [Subscribable<unknown>, () => string] | Binding<string> | string;
//     hasArrow?: boolean;
//     arrowIcon?: Widget.IconProps["icon"] | Binding<string>;
//     revelaer?: string;
// } & Widget.ButtonProps; // todo add types

export default ({
	className,
	onPrimaryClick,
    icon,
	label,
    hasArrow,
    arrowIcon,
    revelaer,
	...props
}) => {
    if (arrowIcon === undefined) {
        arrowIcon = icons.ui.arrow.right;
    }

    return (
        <button
            class={className}
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
            onKeyReleaseEvent={(_, e) => {
                const event = e as unknown as Gdk.Event;
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
                        hexpand={true}
                    />
                )}
                {hasArrow && (
                    <icon
                        halign={Gtk.Align.END}
                        icon={arrowIcon}
                    />
                )}
            </box>
        </button>
    );
}
