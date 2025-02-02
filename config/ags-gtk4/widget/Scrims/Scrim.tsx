import { App, Astal, hook } from "astal/gtk4";
import { activePopupWindows, toggleWindow } from "../../lib/utils";

type ScrimProps = {
  scrimType: "transparent" | "opaque";
  className?: string;
};

const Scrim = ({ scrimType, className = "scrim" }: ScrimProps) => (
  <window
    visible={false}
    name={`${scrimType}-scrim`}
    namespace={`${scrimType}-scrim`}
    layer={Astal.Layer.OVERLAY}
    exclusivity={Astal.Exclusivity.IGNORE}
    anchor={
      Astal.WindowAnchor.TOP |
      Astal.WindowAnchor.LEFT |
      Astal.WindowAnchor.RIGHT |
      Astal.WindowAnchor.BOTTOM
    }
    keymode={Astal.Keymode.NONE}
    application={App}
    cssClasses={[className]}
    setup={(self) => {
      hook(self, self, "notify::visible", () => {
        if (!self.visible) {
          activePopupWindows(scrimType).forEach((popup) => {
            toggleWindow(popup.name);
          });
        }
      });
    }}
  >
    <box
      vexpand={true}
      hexpand={true}
      onButtonReleased={(self) => {
        self.parent.visible = false;
      }}
    />
  </window>
);

export default Scrim;
