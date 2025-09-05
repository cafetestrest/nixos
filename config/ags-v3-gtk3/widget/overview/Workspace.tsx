import { Gtk, Astal, Gdk } from "ags/gtk3";
import AstalHyprland from "gi://AstalHyprland";
import {
  overviewScale,
	workspaces,
} from "../common/Variables";
import { createBinding, For, createConnection, With, createComputed } from "ags";
import cairo from 'cairo';
import { hideOverview } from "./OverviewPopupWindow";
import { getClassIcon } from "../../lib/utils";

type WorkspaceType = {
  workspace: AstalHyprland.Workspace;
  hyprland: AstalHyprland.Hyprland;
}

const FALLBACK_HEIGHT = 1080;
const FALLBACK_WIDTH = 1920;
const scale = (n: number) => Math.max(0, n * overviewScale);
const TARGET = [Gtk.TargetEntry.new("text/plain", Gtk.TargetFlags.SAME_APP, 0)]

/**
 * @param {import('gi://Gtk?version=3.0').default.Widget} widget
 * @returns {any} - missing cairo type
 */
function createSurfaceFromWidget(widget: Gtk.Button) {
	const alloc = widget.get_allocation()
	const surface = new cairo.ImageSurface(
		cairo.Format.ARGB32,
		alloc.width,
		alloc.height,
	)
	const cr = new cairo.Context(surface)
	cr.setSourceRGBA(255, 255, 255, 0)
	cr.rectangle(0, 0, alloc.width, alloc.height)
	cr.fill()
	widget.draw(cr)
	return surface
}

function Client({ client }: { client: AstalHyprland.Client }) {
  const icon = createBinding(client, "class").as((c) => {
    return getClassIcon(c);
  });

  return (
    <Gtk.Button
      halign={Gtk.Align.START}
      valign={Gtk.Align.START}
	    class={"client"}
      marginTop={createBinding(client, "y").as(scale)}
      marginStart={createBinding(client, "x").as(scale)}
      widthRequest={createBinding(client, "width").as(scale)}
      heightRequest={createBinding(client, "height").as(scale)}
      onButtonPressEvent={(_, e) => {
        const event = e as unknown as Gdk.Event;
  
        switch (event.get_button()[1]) {
          case Gdk.BUTTON_PRIMARY:
            client.focus();
            return hideOverview();
          case Gdk.BUTTON_SECONDARY:
            return client.kill();
          case Gdk.BUTTON_MIDDLE:
            return client.kill();
        }
      }}
	    onDragDataGet={(source: Gtk.Button, arg0: Gdk.DragContext, arg1: Gtk.SelectionData, arg2: number, arg3: number) => {
		    arg1.set_text(client.address, client.address.length);
	    }}
	    onDragBegin={(source: Gtk.Button, arg0: Gdk.DragContext) => {
        Gtk.drag_set_icon_surface(arg0, createSurfaceFromWidget(source))
        Astal.widget_toggle_class_name(source, "hidden", true);
      }}
      onDragEnd={(source: Gtk.Button, arg0: Gdk.DragContext) => {
        Astal.widget_toggle_class_name(source, "hidden", false);
      }}
      $={(self) => {
        self.drag_source_set(Gdk.ModifierType.BUTTON1_MASK, TARGET, Gdk.DragAction.COPY)
      }}
    >
      <Gtk.Image iconName={icon} />
    </Gtk.Button>
  );
}

function Workspace({ workspace, hyprland }: WorkspaceType) {
  const monitor = createBinding(workspace, "monitor");
  const clients = createBinding(workspace, "clients");

  const movetoworkspacesilent = (workspace: number, address: string) =>
    hyprland.dispatch("movetoworkspacesilent", `${workspace}, address:0x${address}`);

  return (
    <Gtk.Box
      onDragDataReceived={(source: Gtk.Box, arg0: Gdk.DragContext, arg1: number, arg2: number, arg3: Gtk.SelectionData, arg4: number, arg5: number) => {
        const address = new TextDecoder().decode(arg3.get_data())
        movetoworkspacesilent(workspace.id, address);
      }}
      $={(self) => {
        self.drag_dest_set(Gtk.DestDefaults.ALL, TARGET, Gdk.DragAction.COPY)
      }}
	  >
      <Gtk.Overlay>
        <Gtk.Box
          heightRequest={monitor((m) => scale(m?.height || FALLBACK_HEIGHT))}
          widthRequest={monitor((m) => scale(m?.width || FALLBACK_WIDTH))}
  				class={"eventbox"}
        />
        <For each={clients}>
          {(client) => <Client $type="overlay" client={client} />}
        </For>
      </Gtk.Overlay>
    </Gtk.Box>
  );
}

export default function Overview() {
  const hyprland = AstalHyprland.get_default();

  const workspace = (id: number) => {
    const get = () =>
      hyprland.get_workspace(id + 1) ||
      AstalHyprland.Workspace.dummy(id + 1, null);

    return createConnection(
      get(),
      [hyprland, "workspace-added", get],
      [hyprland, "workspace-removed", get],
    );
  };

	const focusedMonitor = hyprland.get_focused_monitor();

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

  return (
    <Gtk.Box>
      {Array.from({ length: workspaces }, (_, id) => (
        <Gtk.Box
          class={"workspace"}
          css={`
            min-width: ${scale(focusedMonitor.width || FALLBACK_WIDTH)}px;
            min-height: ${scale(focusedMonitor.height || FALLBACK_HEIGHT)}px;
          `}
          visible={largestWorkspaceId.as(ws => {
            if (id > ws) {
              return false;
            }
            return true;
          })}
        >
          <With value={workspace(id)}>
            {(ws) => <Workspace workspace={ws} hyprland={hyprland} />}
          </With>
        </Gtk.Box>
      ))}
    </Gtk.Box>
  );
}
