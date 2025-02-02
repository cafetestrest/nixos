import { App, Astal, Widget, hook } from "astal/gtk4";
import { scrimWindowNames, transparentScrimWindowNames } from "../lib/variables";
import { activePopupWindows } from "../lib/utils";
import { revealLightstripColor } from "../widget/ControlCenter/items/LightstripColor";
import { revealScreenRecord } from "../widget/ControlCenter/pages/Main";
import { revealSinks } from "../widget/ControlCenter/items/Volume";
import { revealScreenShot } from "../widget/ControlCenter/items/ScreenshotMenu";

type PopupWindowProps = {
    scrimType: "transparent" | "opaque";
    className?: string;
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
        cssClasses={["popup-window", `${className}`]}
        application={application}
        layer={layer}
        keymode={keymode}
        visible={visible}
        {...props}
        setup={(self) => {
            // problem when change bar size via margin/padding live
            // https://github.com/wmww/gtk4-layer-shell/issues/60
            self.set_default_size(1, 1);

            const windowNames = scrimType === "transparent" ? transparentScrimWindowNames : scrimWindowNames;
            windowNames.set([...windowNames.get(), self.name]);

            hook(self, self, "notify::visible", () => {
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
