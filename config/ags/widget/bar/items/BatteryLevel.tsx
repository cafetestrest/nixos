import { Gtk } from "astal/gtk3"
import { bind } from "astal"
import Battery from "gi://AstalBattery"

export default () => {
    const battery = Battery.get_default()
    let BLOCKS = 8;

    const batteryLevel = bind(battery, "percentage");

    return (
        <box className={"Battery"}
            visible={bind(battery, "isPresent")}
        >
            <overlay
                overlay={
                    <label
                        className={"battery-percentage-label"}
                        label={batteryLevel.as(p =>
                            `${Math.floor(p * 100)}`
                        )}
                        css={batteryLevel.as((p) => {
                            const percentage = Math.floor(p * 100);
    
                            switch (true) {
                                case percentage <= 40:
                                    return `color: white; text-shadow: 1px 1px 1px black;`;
                                case percentage <= 60:
                                    return `color: white; text-shadow: 1px 1px 1px black;`;
                                case percentage > 60:
                                default:
                                    return `color: black; text-shadow: 1px 1px 1px white;`;
                            }
                        })}
                    />
                }
            >
                <levelbar
                    className={"battery-levelbar"}
                    css={batteryLevel.as((p) => {
                        const percentage = Math.floor(p * 100);

                        switch (true) {
                            case percentage <= 10:
                                return `.empty { background: linear-gradient(90deg, #FF3B30 ${percentage}%, #000000 5%); } .filled {background: unset;}`;
                            case percentage <= 20:
                                return `.empty { background: linear-gradient(90deg, #FF5F42 ${percentage}%, #000000 5%); } .filled {background: unset;}`;
                            case percentage <= 30:
                                return `.empty { background: linear-gradient(90deg, #FF7B3E ${percentage}%, #000000 5%); } .filled {background: unset;}`;
                            case percentage <= 40:
                                return `.empty { background: linear-gradient(90deg, #FF9500 ${percentage}%, #000000 5%); } .filled {background: unset;}`;
                            case percentage <= 50:
                                return `.empty { background: linear-gradient(90deg, #FFA733 ${percentage}%, #000000 5%); } .filled {background: unset;}`;
                            case percentage <= 60:
                                return `.empty { background: linear-gradient(90deg, #FFCC00 ${percentage}%, #000000 5%); } .filled {background: unset;}`;
                            case percentage <= 70:
                                return `.empty { background: linear-gradient(90deg, #D6E600 ${percentage}%, #000000 5%); } .filled {background: unset;}`;
                            case percentage <= 80:
                                return `.empty { background: linear-gradient(90deg, #AEEA00 ${percentage}%, #000000 5%); } .filled {background: unset;}`;
                            case percentage <= 90:
                                return `.empty { background: linear-gradient(90deg, #34C759 ${percentage}%, #000000 5%); } .filled {background: unset;}`;
                            case percentage > 90:
                            default:
                                return `.empty, .filled { background: linear-gradient(90deg, #01CE81, #098A5A ${percentage}%); }`;
                        }
                    })}
                    orientation={Gtk.Orientation.HORIZONTAL}
                    inverted
                    halign={Gtk.Align.CENTER}
                    valign={Gtk.Align.CENTER}
                    maxValue={BLOCKS}
                    mode={Gtk.LevelBarMode.CONTINUOUS}
                    value={batteryLevel.as((p) => p * BLOCKS)}
                />
            </overlay>
        </box>
    );
}
