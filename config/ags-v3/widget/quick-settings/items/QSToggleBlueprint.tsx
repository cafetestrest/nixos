import { Gtk } from "ags/gtk4";
import { Binding } from "ags/state";

type ToggleProps = {
    className: string | Binding<string[]>;
    icon: string | Binding<string>;
    label: string | Binding<string>;
    clicked?: () => void;
    arrowIcon?: string | Binding<string>;
}

export default ({ className, icon, label, clicked, arrowIcon }: ToggleProps) => {
    return (
        <box>
            <button
                cssClasses={typeof className === "string" ? ["toggles", "control-center-button", `${className}`]: className}
                $clicked={() => {
                    if (clicked) {
                        clicked()
                    }
                }}
            >
                <box>
                    <image
                        iconName={icon}
                    />
                    <label
                        label={label}
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
