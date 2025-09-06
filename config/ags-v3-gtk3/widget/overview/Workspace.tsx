import { Gtk, Astal, Gdk } from "ags/gtk3";
import AstalHyprland from "gi://AstalHyprland";
import { config } from "../../lib/config";
import { createBinding, For, createConnection, With, createComputed } from "ags";
import cairo from 'cairo';
import { getClassIcon } from "../../lib/utils";

type WorkspaceType = {
  workspace: AstalHyprland.Workspace;
  hyprland: AstalHyprland.Hyprland;
}

const FALLBACK_HEIGHT = 1080;
const FALLBACK_WIDTH = 1920;
const scale = (n: number) => Math.max(0, n * config.overview.overviewScale);
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
      onClicked={() => client.focus()}
	    onDragDataGet={(source: Gtk.Button, context: Gdk.DragContext, selection: Gtk.SelectionData, arg2: number, arg3: number) => {
        const data = client.address + `;${client.workspace.id}`;
		    selection.set_text(data, data.length);
	    }}
	    onDragBegin={(source: Gtk.Button, context: Gdk.DragContext) => {
        Gtk.drag_set_icon_surface(context, createSurfaceFromWidget(source))
        Astal.widget_toggle_class_name(source, "hidden", true);
      }}
      onDragEnd={(source: Gtk.Button, context: Gdk.DragContext) => {
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

  return (
    <Gtk.Box
      onDragDataReceived={(source: Gtk.Box, context: Gdk.DragContext, x: number, y: number, selection: Gtk.SelectionData, info: number, time: number) => {
        const data = new TextDecoder().decode(selection.get_data());
        if (!data.includes(";")) {
          print("Data in wrong format:", data);
          return;
        }

        const [address, workspaceId] = data.split(";");

        if (workspaceId == workspace.id.toString()) {
          // Find dragged client
          const draggedClient = workspace.clients.find(c => c.address === address);
          if (!draggedClient) {
            print("Dragged client not found:", address);
            return;
          }

          // Hit-test for a target client at drop location
          const clientAtDrop = workspace.clients.find(c => {
            const cx = scale(c.x);
            const cy = scale(c.y);
            const cw = scale(c.width);
            const ch = scale(c.height);
            return x >= cx && x <= cx + cw && y >= cy && y <= cy + ch;
          });

          if (draggedClient.floating) {
            // Floating client: move freely to drop point
            hyprland.dispatch("focuswindow", `address:0x${address}`);
            // Move to relative coordinates inside workspace
            const dx = x - scale(draggedClient.x);
            const dy = y - scale(draggedClient.y);
            hyprland.dispatch("movewindowpixel", `${dx} ${dy}, address:0x${address}`);
          } else if (clientAtDrop && clientAtDrop.address !== draggedClient.address) {
            // Tiled client: swap with target
            let direction: "l" | "r" | "u" | "d" = "r";
            if (clientAtDrop.x < draggedClient.x) direction = "l";
            else if (clientAtDrop.x > draggedClient.x) direction = "r";
            else if (clientAtDrop.y < draggedClient.y) direction = "u";
            else direction = "d";

            hyprland.dispatch("focuswindow", `address:0x${address}`);
            hyprland.dispatch("swapwindow", direction);
          } else {
            // Drop into empty area (do nothing for tiled)
            print("No swap target under drop location.");
          }
        } else {
          // Move to a different workspace
          hyprland.dispatch("movetoworkspacesilent", `${workspace.id}, address:0x${address}`);
        }
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
    const get = () => {

      return hyprland.get_workspace(id + 1) ||
      AstalHyprland.Workspace.dummy(id + 1, null);
    }
      
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
  
    if (focusedId >= config.overview.workspaces) {
      return config.overview.workspaces;
    }
  
    const maxClientWorkspaceId = clients.reduce((maxId, client) => {
      return client.workspace.id > maxId ? client.workspace.id : maxId;
    }, 0);
  
    const max = Math.max(focusedId, maxClientWorkspaceId);
  
    if (max > config.overview.workspaces) {
      return config.overview.workspaces;
    }
    return max;
  });

  return (
    <Gtk.Box>
      {Array.from({ length: config.overview.workspaces }, (_, id) => (
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
