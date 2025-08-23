import { astalify, Gtk, type ConstructProps } from "astal/gtk3";
import { property } from "astal/gobject";
import GObject from "gi://GObject";

interface WorkspaceButtonConstructorProps extends Gtk.Button.ConstructorProps {
    attribute: number;
}

class WorkspaceButtonClass extends astalify(Gtk.Button) {
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
        WorkspaceButtonClass,
        WorkspaceButtonConstructorProps
    >) {
        super(props as any)
    }
}

const WorkspaceButton = astalify(WorkspaceButtonClass);

export default WorkspaceButton;
