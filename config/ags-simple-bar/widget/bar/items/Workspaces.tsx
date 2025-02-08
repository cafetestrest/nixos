import { bind, Variable } from "astal"
import { App, Gdk, Gtk, Widget } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland"
import { range } from "../../../lib/utils";

export const numOfWS = Variable(0);

type WsButtonProps = Widget.ButtonProps & {
    ws: Hyprland.Workspace;
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
        {...props}
      />
    );
  }

  export default () => {
    const hyprland = Hyprland.get_default();

    Variable.derive(
      [bind(hyprland, "focusedWorkspace"), bind(hyprland, "workspaces")],
      (fws, workspaces) => {
        let highestOccupied = 0;
      
        for (const ws of workspaces) {
          if (ws?.get_clients().length > 0 && ws.id > highestOccupied) {
            highestOccupied = ws.id;
          }
        }
      
        if (fws.id > 9) {
          numOfWS.set(9);
          return 9;
        }
      
        if (highestOccupied > fws.id) {
          const highestOccupiedNum = Math.max(1, Math.min(highestOccupied, 9));
          numOfWS.set(highestOccupiedNum);
          return highestOccupiedNum;
        }
      
        const wsnum = Math.max(1, Math.min(fws.id, 9));
        numOfWS.set(wsnum);
        return wsnum;
      }
    );

    return (
      <box className={"Workspaces"} spacing={4}
      >
        {bind(numOfWS).as((w) => {
            return range(w).map((i) => (
                <WorkspaceButton ws={Hyprland.Workspace.dummy(i + 1, null)} label={i+1+""}/>
            ))
        })}
      </box>
    );
}
