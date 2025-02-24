import { bind, Variable } from "astal";
import { Astal, App, Gdk, Gtk, hook } from "astal/gtk4";
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
      const classes = ["workspace-button"];

      const active = fws.id == ws.id;
      if (active) {
          classes.push("active");
      }

      const occupied = hyprland.get_workspace(ws.id)?.get_clients().length > 0;
      if (occupied) {
          classes.push("occupied");
      }
      return classes;
    },
  );

  return (
    <WorkspaceButtonAstal
      cssClasses={classNames()}
      onDestroy={() => classNames.drop()}
      valign={Gtk.Align.CENTER}
      halign={Gtk.Align.CENTER}
      onClicked={() => ws.focus()}
      id={ws.id}
      {...props}
    >
      <box cssClasses={["workspace-dot"]} />
    </WorkspaceButtonAstal>
  );
}

export default () => {
  return (
    <box
      cssClasses={["Workspaces"]}
      onButtonPressed={(_, event: Gdk.ButtonEvent) => {
        switch (event.get_button()) {
          case Gdk.BUTTON_SECONDARY:
          case Gdk.BUTTON_MIDDLE:
            return App.toggle_window(namespaceOverview);
      }}}
      onScroll={(_, dx: number, dy: number) => {
        dy < 0 ? dispatch('+1') : dispatch('-1');
      }}
    >
      <box cssClasses={["workspaces-box"]}
        setup={(self) => {
          hook(self, hyprland, "event", () => (self.children as WorkspaceButtonClass[]).map((btn) => {
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
    </box>
  );
}
