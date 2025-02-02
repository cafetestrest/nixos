import { Gtk } from "astal/gtk4";
import { ButtonProps } from "astal/gtk4/widget";

export enum BarButtonStyle {
	transparent = "transparent",
	primary = "primary",
	primaryContainer = "primary_container",
}

type Props = ButtonProps & {
	buttonStyle?: BarButtonStyle;
	child?: JSX.Element; // when only one child is passed
	className?: string;
};

export default ({
	child,
	buttonStyle,
	className,
	onClicked,
	...props
}: Props) => {
	return (
		<button
			cssClasses={["bar__item", "bar__button", `${buttonStyle || ""}`, `${className}`]}
			onClicked={onClicked}
			valign={Gtk.Align.CENTER}
			{...props}
		>
			{child}
		</button>
	);
};
