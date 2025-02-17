import { Astal, astalify, type ConstructProps } from "astal/gtk3";
import { property } from "astal/gobject";
import GObject from "gi://GObject"

interface WorkspaceBoxConstructorProps extends Astal.Box.ConstructorProps {
    id: number;
    attribute?: (clients: any) => void;
}

export class WorkspaceBox extends Astal.Box {
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
        WorkspaceBox,
        WorkspaceBoxConstructorProps
    >) {
        super(props as any)
    }
}

const WorkspaceBoxAstal = astalify(WorkspaceBox);

export default WorkspaceBoxAstal;
