import { Astal, Gdk, Gtk } from "ags/gtk3";
import App from "ags/gtk3/app";
import Hyprland from "gi://AstalHyprland";
import { range } from "../../../lib/utils";
import { enableBarWorkspaces, namespaceOverview, workspaces, overviewEnabled } from "../../common/Variables";
import { createBinding, createComputed, createState } from "ags";

const hyprland = Hyprland.get_default();
const dispatch = (command: string) => hyprland.dispatch("workspace", command);

function workspace(id: number) {
  const hyprland = Hyprland.get_default()
  const get = () => hyprland.get_workspace(id)
      || Hyprland.Workspace.dummy(id, null)

  const [state, setState] = createState(get())

  hyprland.connect("workspace-added", () => setState(get()))
  hyprland.connect("workspace-removed", () => setState(get()))

  return state;
}

function Workspace({ id }: { id: number }) {
  const hyprland = Hyprland.get_default();
  const ws = workspace(id);

  const className = createComputed([
      createBinding(hyprland, "focusedWorkspace"),
      createBinding(hyprland, "clients"),
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
  });

  const largestWorkspaceId = createComputed([
    createBinding(hyprland, "focusedWorkspace"),
    createBinding(hyprland, "clients"),
  ], (focused, clients) => {
    const focusedId = focused.id;

    if (focusedId >= workspaces) {
      return workspaces;
    }

    const maxClientWorkspaceId = clients.reduce((maxId, client) => {
      return client.workspace.id > maxId ? client.workspace.id : maxId;
    }, 0);

    const max = Math.max(focusedId, maxClientWorkspaceId);

    if (max > workspaces) {
      return workspaces;
    }
    return max;
  });

  return <button
      onClicked={() => dispatch(`${id}`)}
      valign={Gtk.Align.CENTER}
      class={className}
      visible={largestWorkspaceId.as(ws => {
        if (id > ws + 1) {
          return false;
        }
        return true;
      })}
  >
    <box class={"workspace-dot"} />
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
      class={"workspaces"}
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
      <box class={"workspaces-box"}>
        {range(workspaces).map(ws => (
          <Workspace
            id={ws}
          />
        ))}
      </box>
    </eventbox>
  );
}
