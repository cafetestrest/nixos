import { Gtk, Widget } from "astal/gtk3";
import { bind, Variable } from "astal";

type ButtonProps = Widget.ButtonProps & {
	buttonType?: "filled" | "tonal" | "outlined" | "text";
	child?: JSX.Element; // when only one child is passed
};

export default ({
    classname,
    bindVariable,
    content
}: {
    classname: string,
    bindVariable: Variable<boolean>,
    content: Gtk.Widget[]
}) => {
    return (
        <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            revealChild={bind(bindVariable)}
        >
            <box className={`menu ${classname}`} vertical children={content} />
        </revealer>
    );
}

export const MenuButton = ({
	className,
	buttonType = "filled",
	child,
	focusOnClick,
	...props
}: ButtonProps) => (
	<button
		className={`menu-button ${buttonType} ${className}`}
		focusOnClick={false}
		{...props}
	>
		{child}
	</button>
);
