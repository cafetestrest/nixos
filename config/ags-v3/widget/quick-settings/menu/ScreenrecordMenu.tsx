import icons from "../../../lib/icons";
import { qsRevealScreenRecord, setQsRevealScreenRecord, config } from "../../../lib/config";
import { Gtk } from "ags/gtk4";
import ScreenRecordService from "../../../service/ScreenRecordService";

export default () => {
    return (
        <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            revealChild={qsRevealScreenRecord}
        >
            <box
                cssClasses={["qs-menu"]}
                spacing={config.quickSettings.menuSpacing}
                orientation={Gtk.Orientation.VERTICAL}
                marginTop={config.quickSettings.sliderSpacing}
            >
                <image
                    iconName={icons.record}
                    cssClasses={["qs-menu-icon-record"]}
                />
                <label
                    label={"Start recording"}
                    cssClasses={["qs-menu-label"]}
                />
                <box
                    cssClasses={["qs-menu-content"]}
                    spacing={config.quickSettings.menuSpacing}
                    orientation={Gtk.Orientation.VERTICAL}
                >
                    <box>
                        <image iconName={icons.audio.mic.high} />
                        <label label={"Record audio"} />
                        <switch
                            hexpand={true}
                            halign={Gtk.Align.END}
                            active={false}
                            onNotifyActive={(self) => ScreenRecordService.setAudioRecord(self.active)}
                            $={self => {
                                qsRevealScreenRecord.subscribe(() => {
                                    self.active = false;
                                });
                            }}
                        />
                    </box>
                    <box>
                        <image iconName={icons.select} />
                        <label label={"Record only selected size"} />
                        <switch
                            hexpand={true}
                            halign={Gtk.Align.END}
                            active={false}
                            onNotifyActive={(self) => ScreenRecordService.setRecordSelected(self.active)}
                            $={self => {
                                qsRevealScreenRecord.subscribe(() => {
                                    self.active = false;
                                });
                            }}
                        />
                    </box>
                    <box
                        spacing={config.quickSettings.menuSpacing}
                        hexpand={true}
                        halign={Gtk.Align.END}
                    >
                        <button
                            cssClasses={["menu-button", "outlined"]}
                            focusOnClick={false}
                            onClicked={() => {
                                setQsRevealScreenRecord(false);
                            }}
                        >
                            <label
                                halign={Gtk.Align.CENTER}
                                valign={Gtk.Align.CENTER}
                                label={"Cancel"}
                            />
                        </button>
                        <button
                            cssClasses={["menu-button", "filled"]}
                            focusOnClick={false}
                            onClicked={() => {
                                setQsRevealScreenRecord(false);
                                ScreenRecordService.start();
                            }}
                        >
                            <label
                                halign={Gtk.Align.CENTER}
                                valign={Gtk.Align.CENTER}
                                label={"Start"}
                            />
                        </button>
                    </box>
                </box>
            </box>
        </revealer>
    );
}
