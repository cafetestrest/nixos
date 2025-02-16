import { App, Astal, Widget } from "astal/gtk3";
import { scrimWindowNames, transparentScrimWindowNames } from "../lib/variables";
import { activePopupWindows } from "../lib/utils";
import { revealLightstripColor } from "../widget/ControlCenter/items/LightstripColor";
import { revealScreenRecord } from "../widget/ControlCenter/pages/Main";
import { revealSinks } from "../widget/ControlCenter/items/Volume";
import { revealScreenShot } from "../widget/ControlCenter/items/ScreenshotMenu";

type PopupWindowProps = {
    scrimType: "transparent" | "opaque";
} & Widget.WindowProps;

const PopupWindow = ({
    application = App,
    layer = Astal.Layer.OVERLAY,
    keymode = Astal.Keymode.EXCLUSIVE,
    visible = false,
    child,
    scrimType,
    setup,
    className,
    ...props
}: PopupWindowProps) => (
    <window
        className={`popup-window ${className}`}
        application={application}
        layer={layer}
        keymode={keymode}
        visible={visible}
        {...props}
        setup={(self) => {
            const windowNames = scrimType === "transparent" ? transparentScrimWindowNames : scrimWindowNames;
            windowNames.set([...windowNames.get(), self.name]);

            self.hook(self, "notify::visible", () => {
                if (activePopupWindows(scrimType).length === 0) {
                    const scrimWindow = App.get_window(`${scrimType}-scrim`);
                    scrimWindow?.set_visible(false);

                    if (self.name === "control-center") {
                        revealLightstripColor.set(false);
                        revealScreenRecord.set(false);
                        revealSinks.set(false);
                        revealScreenShot.set(false);
                    }
                }
            });

            if (setup) setup(self);
        }}
    >
        {child}
    </window>
);

export default PopupWindow
