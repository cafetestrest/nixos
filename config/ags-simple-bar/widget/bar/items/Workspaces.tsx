import { bind, Variable } from "astal"
import { App, Gdk, Gtk, Widget } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland"
import { range } from "../../../lib/utils";
import { namespaceOverview } from "../../common/Variables";

export const numOfWS = Variable(0);

type WsButtonProps = Widget.ButtonProps & {
    ws: Hyprland.Workspace;
    attribute?: number;
};

function WorkspaceButton({ ws, ...props }: WsButtonProps) {
    const hyprland = Hyprland.get_default();
    const classNames = Variable.derive(
      [bind(hyprland, "focusedWorkspace"), bind(hyprland, "clients")],
      (fws, _) => {
        let classes = "workspace-button";
  
        const active = fws.id == ws.id;
        if (active) {
            classes = `${classes} active`;
        }
  
        const occupied = hyprland.get_workspace(ws.id)?.get_clients().length > 0;
        if (occupied) {
            classes = `${classes} occupied`;
        }
        return classes;
      },
    );
  
    return (
      <button
        className={classNames()}
        onDestroy={() => classNames.drop()}
        valign={Gtk.Align.CENTER}
        halign={Gtk.Align.CENTER}
        onClicked={() => ws.focus()}
        // onClickRelease={(_, event) => {
        //   switch (event.button) {
        //     case Gdk.BUTTON_SECONDARY:
        //     case Gdk.BUTTON_MIDDLE:
        //       return App.get_window(namespaceOverview);
        // }}}
				attribute={ws.id}
        {...props}
      >
        <box className={"workspace-dot"} />
      </button>
    );
  }

  export default () => {
    const hyprland = Hyprland.get_default();

    return (
      <eventbox
        className={"Workspaces"}
      >
        <box className={"workspaces-box"}
          setup={(self) => {
            self.hook(hyprland, "event", () => self.children.map(btn => {
              btn.visible = hyprland.workspaces.some(ws => {
                if (ws.id < 10)
                  return ws.id +1 >= btn.attribute
  
                return ws.id >= btn.attribute
              });
            }));
          }}
        >
          {range(10).map((i) => (
              <WorkspaceButton ws={Hyprland.Workspace.dummy(i + 1, null)}/>
          ))}
        </box>
      </eventbox>
    );
}
