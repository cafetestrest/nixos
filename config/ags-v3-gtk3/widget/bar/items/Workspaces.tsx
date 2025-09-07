import { Astal, Gdk, Gtk } from "ags/gtk3";
import App from "ags/gtk3/app";
import Hyprland from "gi://AstalHyprland";
import { range } from "../../../lib/utils";
import { createBinding, createComputed, createState } from "ags";
import { config } from "../../../lib/config";

const hyprland = Hyprland.get_default();
const dispatch = (command: string) => hyprland.dispatch("workspace", command);
const numberOfWorkspaces = config.hyprland.workspaceNumber;

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

    if (focusedId >= numberOfWorkspaces) {
      return numberOfWorkspaces;
    }

    const maxClientWorkspaceId = clients.reduce((maxId, client) => {
      return client.workspace.id > maxId ? client.workspace.id : maxId;
    }, 0);

    const max = Math.max(focusedId, maxClientWorkspaceId);

    if (max > numberOfWorkspaces) {
      return numberOfWorkspaces;
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
  if (!config.hyprland.enabled) {
      return <box visible={false} />
  };

  return (
    <eventbox
      class={"workspaces"}
      onClickRelease={(_, event) => {
        if (!config.overview.enabled) {
          return false;
        }

        switch (event.button) {
          case Gdk.BUTTON_SECONDARY:
          case Gdk.BUTTON_MIDDLE:
            return App.toggle_window(config.overview.namespace);
      }}}
      onScroll={(_, event: Astal.ScrollEvent) => {
        event.delta_y < 0 ? dispatch('+1') : dispatch('-1');
      }}
    >
      <box class={"workspaces-box"}>
        {range(numberOfWorkspaces).map(ws => (
          <Workspace
            id={ws}
          />
        ))}
      </box>
    </eventbox>
  );
}
