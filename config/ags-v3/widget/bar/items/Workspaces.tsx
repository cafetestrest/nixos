import AstalHyprland from "gi://AstalHyprland";
import { config } from "../../../lib/config";
import { range, throttle } from "../../../lib/utils";
import { createState, createBinding, createComputed } from "ags";
import { Gtk } from "ags/gtk4";

const workspaces = config.hyprland.numberOfWorkspaces;

function workspace(id: number) {
    const hyprland = AstalHyprland.get_default();

    const get = () => hyprland.get_workspace(id)
        || AstalHyprland.Workspace.dummy(id, null);

    const [state, setState] = createState(get())

    hyprland.connect("workspace-added", () => setState(get()))
    hyprland.connect("workspace-removed", () => setState(get()))

    return state
}

function WorkspaceButton({ id }: { id: number }) {
    const hyprland = AstalHyprland.get_default();
    const ws = workspace(id);
    const dispatch = (command: string) => hyprland.dispatch("workspace", command);

    const largestWorkspaceId = createComputed(
        [createBinding(hyprland, "focusedWorkspace"), createBinding(hyprland, "clients")],
        (focused, clients) => {
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
        },
    );

    const classNames = createComputed(
        [createBinding(hyprland, "focusedWorkspace"), createBinding(hyprland, "clients"), ws],
        (focused, clients, ws) => {
            const classes = ["workspace-button"];

            if (focused === ws) {
                classes.push("active");
            }

            if (clients.filter(c => c.workspace == ws).length > 0) {
                classes.push("occupied");
            }

            return classes;
        },
    );

    return (
        <button
            cssClasses={classNames}
            visible={largestWorkspaceId.as(ws => id <= ws + 1)}
            valign={Gtk.Align.CENTER}
            onClicked={() => dispatch(`${id}`)}
        >
            <box
                cssClasses={["workspace-dot"]}
            />
        </button>
    );
}

export default () => {
    if (!config.hyprland.enabled) {
        return <box visible={false} />
    };

    const hyprland = AstalHyprland.get_default();

    const scroll = throttle(200, (dy: number) => hyprland.dispatch("workspace", dy > 0 ? "-1" : "+1"));

    const scrollController = new Gtk.EventControllerScroll({
        flags: Gtk.EventControllerScrollFlags.VERTICAL,
    });

    return (
        <box
            cssClasses={["workspaces"]}
            $={self => {
                scrollController.connect('scroll', (_, dx, dy) => {
                    scroll(dy);
                });
    
                self.add_controller(scrollController);
            }}
        >
            {range(workspaces).map(ws => <WorkspaceButton id={ws} />)}
        </box>
    );
}
