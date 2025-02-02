import { Gtk } from "astal/gtk4";
import { BoxProps } from "astal/gtk4/widget";

export enum BarItemStyle {
	transparent = "transparent",
	primary = "primary",
	primaryContainer = "primary_container",
}

type Props = BoxProps & {
	itemStyle?: BarItemStyle;
	child?: JSX.Element; // when only one child is passed
	className?: string;
};

export default ({ child, itemStyle, className, ...props }: Props) => {
	return (
		<box
			cssClasses={["bar__item", `${itemStyle || ""}`, `${className}`]}
			valign={Gtk.Align.CENTER}
			{...props}
		>
			{child}
		</box>
	);
};
