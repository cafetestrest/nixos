import { property, register } from "astal/gobject";
import { Astal, astalify } from "astal/gtk4";

interface WorkspaceBoxConstructorProps extends Astal.Box.ConstructorProps {
    id: number;
    attribute?: (clients: any) => void;
}

@register()
export class WorkspaceBoxClass extends Astal.Box {
    @property(Number)
    declare id: number

    constructor(props?: Partial<WorkspaceBoxConstructorProps>) {
        super(props);
    }
}

const WorkspaceBoxAstal = astalify<WorkspaceBoxClass, WorkspaceBoxConstructorProps>(WorkspaceBoxClass, {
    getChildren(widget) {
        return [widget.child];
    },
    setChildren(widget, children) {
        widget.child = children[0];
    },
});

export default WorkspaceBoxAstal;
