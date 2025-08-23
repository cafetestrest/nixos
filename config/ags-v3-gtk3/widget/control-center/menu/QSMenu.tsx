import { Gtk } from "ags/gtk3";

type ButtonProps = JSX.IntrinsicElements["button"] & {
    buttonType?: "filled" | "tonal" | "outlined" | "text";
  child: JSX.Element
  className: string
}

export default ({
    classname,
    bindVariable,
    content
}: {
    classname: string,
    // bindVariable: Variable<boolean>,
    bindVariable: any, //todo add proper type
    content: Gtk.Widget[]
}) => {
    return (
        <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            revealChild={bindVariable}
        >
            <box class={`menu ${classname}`} vertical={true} children={content} />
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
		class={`menu-button ${buttonType} ${className}`}
		focusOnClick={false}
		{...props}
	>
		{child}
	</button>
);
