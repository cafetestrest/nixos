import { property, register } from "astal/gobject";
import { Gtk, astalify } from "astal/gtk4";

export interface WorkspaceButtonConstructorProps extends Gtk.Button.ConstructorProps {
    id: number;
}

@register()
export class WorkspaceButtonClass extends Gtk.Button {
    @property(Number)
    declare id: number

    constructor(props?: Partial<WorkspaceButtonConstructorProps>) {
        super(props);
    }
}

export const WorkspaceButtonAstal = astalify<WorkspaceButtonClass, WorkspaceButtonConstructorProps>(WorkspaceButtonClass, {
    getChildren(widget) {
        return [widget.child];
    },
    setChildren(widget, children) {
        widget.child = children[0];
    },
});

export default WorkspaceButtonAstal;
