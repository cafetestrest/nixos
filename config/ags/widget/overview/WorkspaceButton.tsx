import { Astal, astalify, type ConstructProps } from "astal/gtk3";
import { property } from "astal/gobject";
import GObject from "gi://GObject";

interface WorkspaceButtonConstructorProps extends Astal.Button.ConstructorProps {
    id: number;
}

export class WorkspaceButtonClass extends Astal.Button {
    #id!: number;

    @property(Number)
    set id(value: number) {
        this.#id = value;
    }
    get id() {
        return this.#id;
    }

    static { GObject.registerClass(this) }

    constructor(props: ConstructProps<
        WorkspaceButtonClass,
        WorkspaceButtonConstructorProps
    >) {
        super(props as any)
    }
}

const WorkspaceButtonAstal = astalify(WorkspaceButtonClass);

export default WorkspaceButtonAstal;
