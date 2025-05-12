import { Gtk } from "ags/gtk4";
import { Binding } from "ags/state";
import Pango from "gi://Pango?version=1.0";

type ToggleProps = {
    className: string | Binding<string[]> | string[];
    icon: string | Binding<string>;
    label: string | Binding<string>;
    clicked?: () => void;
    onDestory?: () => void;
    arrowIcon?: string | Binding<string>;
}

export default ({ className, icon, label, clicked, arrowIcon, onDestory }: ToggleProps) => {
    return (
        <box>
            <button
                cssClasses={typeof className === "string" ? ["toggles", "control-center-button", `${className}`] : className}
                $clicked={() => {
                    if (clicked) {
                        clicked()
                    }
                }}
                $destroy={() => {
                    if (onDestory) {
                        onDestory()
                    }
                }}
            >
                <box>
                    <image
                        iconName={icon}
                    />
                    <label
                        label={label}
                        ellipsize={Pango.EllipsizeMode.END}
                        maxWidthChars={13}
                    />
                    <box
                        hexpand={true}
                    />
                    {arrowIcon && (
                        <image
                            halign={Gtk.Align.END}
                            iconName={arrowIcon}
                        />
                    )}
                </box>
            </button>
        </box>
    );
}
