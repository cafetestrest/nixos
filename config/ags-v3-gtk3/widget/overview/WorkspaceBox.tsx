import { property, GType, register } from "gnim/gobject";
import { Astal } from "ags/gtk3";

export namespace WorkspaceBox {
    export interface Props extends Astal.Box.ConstructorProps {
    attribute: number
  }
}

@register()
export class WorkspaceBox extends Astal.Button {
  declare static $gtype: GType<WorkspaceBox>

  @property(Number) attribute = 0

  constructor({ attribute, ...props }: WorkspaceBox.Props) {
    super({
        ...props,
    })
    this.attribute = attribute
  }
}
