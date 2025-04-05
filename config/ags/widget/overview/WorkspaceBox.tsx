import { Astal, astalify, Widget, Gtk, type ConstructProps } from "astal/gtk3";
import { property } from "astal/gobject";
import GObject from "gi://GObject";

interface WorkspaceBoxConstructorProps extends Gtk.Box.ConstructorProps {
    attribute: number;
}

export class WorkspaceBoxClass extends astalify(Gtk.Box) {
    #attribute!: number;

    @property(Number)
    set attribute(value: number) {
        this.#attribute = value;
    }
    get attribute() {
        return this.#attribute;
    }

    static { GObject.registerClass(this) }

    constructor(props: ConstructProps<
        WorkspaceBoxClass,
        WorkspaceBoxConstructorProps
    >) {
        super(props as any)
    }
}

const WorkspaceBox = astalify(WorkspaceBoxClass);

export default WorkspaceBox;
