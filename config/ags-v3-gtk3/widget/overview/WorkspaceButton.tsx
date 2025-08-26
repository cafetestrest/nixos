import { property, GType, register } from "gnim/gobject";
import { Astal } from "ags/gtk3";

export namespace WorkspaceButton {
    export interface Props extends Astal.Button.ConstructorProps {
    attribute: number
  }
}

@register()
export class WorkspaceButton extends Astal.Button {
  declare static $gtype: GType<WorkspaceButton>

  @property(Number) attribute = 0

  constructor({ attribute, ...props }: WorkspaceButton.Props) {
    super({
        ...props,
    })
    this.attribute = attribute
  }
}

