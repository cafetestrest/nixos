import { Gtk, Gdk, Astal } from "ags/gtk3";
import icons from "../../../lib/icons";
import { qsRevertRevealerStatus, qsToggleRevealer } from "../../common/Variables";
import { Accessor } from "ags";

type QSToggleProps = JSX.IntrinsicElements["button"] & {
    icon: string | Accessor<string> | undefined;
    className?: Accessor<any> | string;
    onPrimaryClick?: () => void;
    hasArrow?: boolean;
    arrowIcon?: string | Accessor<string> | undefined;
    revelaer?: string;
}

export default ({
	className,
	onPrimaryClick,
    icon,
	label,
    hasArrow,
    arrowIcon,
    revelaer,
	...props
}: QSToggleProps) => {
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
