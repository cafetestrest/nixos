import { Gtk } from "astal/gtk3";
import { bind, Variable } from "astal";

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
