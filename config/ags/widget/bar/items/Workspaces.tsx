import { bind, Variable } from "astal";
import { Astal, App, Gdk, Gtk } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";
import { range } from "../../../lib/utils";
import { namespaceOverview, workspaces } from "../../common/Variables";
import WorkspaceButtonAstal, { WorkspaceButtonClass } from "../../overview/WorkspaceButton";

const hyprland = Hyprland.get_default();
const dispatch = (command: string) => hyprland.dispatch("workspace", command);

function WorkspaceButton({ ws, ...props }) {
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
    <WorkspaceButtonAstal
      className={classNames()}
      onDestroy={() => classNames.drop()}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      onClicked={() => ws.focus()}
      id={ws.id}
      {...props}
    >
      <box className={"workspace-dot"} />
    </WorkspaceButtonAstal>
  );
}

export default () => {
  return (
    <eventbox
      className={"Workspaces"}
      onClickRelease={(_, event) => {
        switch (event.button) {
          case Gdk.BUTTON_SECONDARY:
          case Gdk.BUTTON_MIDDLE:
            return App.toggle_window(namespaceOverview);
      }}}
      onScroll={(_, event: Astal.ScrollEvent) => {
        event.delta_y < 0 ? dispatch('+1') : dispatch('-1');
      }}
    >
      <box className={"workspaces-box"}
        setup={(self) => {
          self.hook(hyprland, "event", () => self.children.map((btn: WorkspaceButtonClass) => {
            btn.visible = hyprland.workspaces.some(ws => {
              if (ws.id < workspaces)
                return ws.id +1 >= btn.id

              return ws.id >= btn.id
            });
          }));
        }}
      >
        {range(workspaces).map((i) => (
            <WorkspaceButton ws={Hyprland.Workspace.dummy(i + 1, null)}/>
        ))}
      </box>
    </eventbox>
  );
}
