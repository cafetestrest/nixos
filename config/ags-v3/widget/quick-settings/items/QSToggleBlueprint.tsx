import { Binding } from "ags/state";

type ToggleProps = {
    className: string | Binding<string[]>;
    clicked?: () => void;
    icon: string | Binding<string>;
    label: string | Binding<string>;
}

export default ({ className, clicked, icon, label }: ToggleProps) => {
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
                </box>
            </button>
        </box>
    );
}
