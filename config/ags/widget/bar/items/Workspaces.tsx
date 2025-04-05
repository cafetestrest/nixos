import { bind, Variable } from "astal";
import { Astal, App, Gdk, Gtk } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";
import { range } from "../../../lib/utils";
import { enableBarWorkspaces, namespaceOverview, workspaces, overviewEnabled } from "../../common/Variables";

const hyprland = Hyprland.get_default();
const dispatch = (command: string) => hyprland.dispatch("workspace", command);

function workspace(id: number) {
  const hyprland = Hyprland.get_default()
  const get = () => hyprland.get_workspace(id)
      || Hyprland.Workspace.dummy(id, null)

  return Variable(get())
      .observe(hyprland, "workspace-added", get)
      .observe(hyprland, "workspace-removed", get)
}

function Workspace({ id }: { id: number }) {
  const hyprland = Hyprland.get_default()
  const ws = workspace(id)

  const className = Variable.derive([
      bind(hyprland, "focusedWorkspace"),
      bind(hyprland, "clients"),
      ws,
  ], (focused, clients, ws) => {
    const classes = "workspace-button";

    if (focused === ws) {
      return `${classes} active`;
    }
    if (clients.filter(c => c.workspace == ws).length > 0) {
      return `${classes} occupied`;
    }
    return classes;
  })

  const largestWorkspaceId = Variable.derive([
    bind(hyprland, "focusedWorkspace"),
    bind(hyprland, "clients"),
  ], (focused, clients) => {
    const focusedId = focused.id;

    if (focusedId >= 10) {
      return 10;
    }

    const maxClientWorkspaceId = clients.reduce((maxId, client) => {
      return client.workspace.id > maxId ? client.workspace.id : maxId;
    }, 0);

    const max = Math.max(focusedId, maxClientWorkspaceId);

    if (max > 10) {
      return 10;
    }
    return max;
  })

  return <button
      onDestroy={() => {
          className.drop()
          ws.drop()
          largestWorkspaceId.drop()
      }}
      onClicked={() => dispatch(`${id}`)}
      valign={Gtk.Align.CENTER}
      className={className()}
      visible={bind(largestWorkspaceId).as(ws => {
        if (id > ws + 1) {
          return false;
        }
        return true;
      })}
  >
    <box className={"workspace-dot"} />
  </button>
}

export default () => {
  if (enableBarWorkspaces === false) {
    return (
        <box visible={false} />
    );
  }

  return (
    <eventbox
      className={"workspaces"}
      onClickRelease={(_, event) => {
        if (!overviewEnabled) {
          return false;
        }

        switch (event.button) {
          case Gdk.BUTTON_SECONDARY:
          case Gdk.BUTTON_MIDDLE:
            return App.toggle_window(namespaceOverview);
      }}}
      onScroll={(_, event: Astal.ScrollEvent) => {
        event.delta_y < 0 ? dispatch('+1') : dispatch('-1');
      }}
    >
      <box className={"workspaces-box"}>
        {range(workspaces).map(ws => (
          <Workspace
            id={ws}
          />
        ))}
      </box>
    </eventbox>
  );
}
