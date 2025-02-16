import { Gtk } from "astal/gtk3"
import { bind } from "astal"
import Battery from "gi://AstalBattery"

export default () => {
    const bat = Battery.get_default()
    let BLOCKS = 8;

    return (
        <box className={"Battery"}
            visible={bind(bat, "isPresent")}
        >
            <levelbar
                className={"battery-levelbar"}
                css={bind(bat).as((l) => {
                    switch (l) {
                        case 0.1:
                            return `.empty, .filled { background: linear-gradient(90deg, #FF3B30 10%, #000000 5%); }`;
                        case 0.2:
                            return `.empty, .filled { background: linear-gradient(90deg, #FF5F42 20%, #000000 5%); }`;
                        case 0.3:
                            return `.empty { background: linear-gradient(90deg, #FF7B3E 30%, #000000 5%); } .filled {background: unset;}`;
                        case 0.4:
                            return `.empty { background: linear-gradient(90deg, #FF9500 40%, #000000 5%); } .filled {background: unset;}`;
                        case 0.5:
                            return `.empty { background: linear-gradient(90deg, #FFA733 50%, #000000 5%); } .filled {background: unset;}`;
                        case 0.6:
                            return `.empty, .filled { background: linear-gradient(90deg, #FFCC00 60%, #000000 5%); }`;
                        case 0.7:
                            return `.empty, .filled { background: linear-gradient(90deg, #D6E600 70%, #000000 5%); }`;
                        case 0.8:
                            return `.empty, .filled { background: linear-gradient(90deg, #AEEA00 80%, #000000 5%); }`;
                        case 0.9:
                            return `.empty, .filled { background: linear-gradient(90deg, #34C759 90%, #000000 5%); }`;
                        case 1:
                            return `.empty, .filled { background: linear-gradient(90deg, #01CE81, #098A5A 100%); }`;
                    }
                })}
                orientation={Gtk.Orientation.HORIZONTAL}
                inverted
                halign={Gtk.Align.CENTER}
                valign={Gtk.Align.CENTER}
                maxValue={BLOCKS}
                mode={Gtk.LevelBarMode.CONTINUOUS}
                // hasTooltip
                // onQueryTooltip={(self, x, y, kbtt, tooltip) => {
                //     // tooltip.set_custom(theTooltip);
                //     return true;
                // }}
                value={bind(battery, "percentage").as((p) => p * BLOCKS)}
            />
        </box>
    );
}
