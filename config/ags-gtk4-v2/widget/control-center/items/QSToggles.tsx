import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import NightlightToggle from "./NightlightToggle";
import IdleToggle from "./IdleToggle";
import { qsTogglesPage, qsRevertRevealerStatus } from "../../common/Variables";
import MicrophoneToggle from "./MicrophoneToggle";
import DNDToggle from "./DNDToggle";
import { QSSpaceBetweenToggleBoxes, QSSpaceBetweenToggles } from "../pages/QSMainPage";
import BluetoothToggle from "./BluetoothToggle";
import ScreenRecordToggle from "./ScreenRecordToggle";
import QSScreenRecordMenu from "../menu/QSScreenRecordMenu";
import NetworkToggle from "./NetworkToggle";
import ScreenshotToggle from "./ScreenshotToggle";
import QSScreenshotMenu from "../menu/QSScreenshotMenu";
import LightstripToggle from "./LightstripToggle";
import QSLightstripMenu from "../menu/QSLightstripMenu";
import ColorPickerToggle from "./ColorPickerToggle";
import NoteToggle from "./NoteToggle";

function QSEmptyButton() {
  return (
    <box cssClasses={["toggles", "empty"]}/>
  );
}

function FirstPage() {
  return (
    <box
      cssClasses={["qs-toggles-page"]}
      name={"qs-page-first"}
      vertical={true}
    >
      <box>
        <BluetoothToggle />
        <QSSpaceBetweenToggles/>
        <NightlightToggle />
      </box>

      <QSSpaceBetweenToggleBoxes/>

      <box>
        <MicrophoneToggle />
        <QSSpaceBetweenToggles/>
        <ScreenshotToggle />
      </box>
      <QSScreenshotMenu />

      <QSSpaceBetweenToggleBoxes/>

      <box>
        <IdleToggle />
        <QSSpaceBetweenToggles/>
        <LightstripToggle />
      </box>
    </box>
  );
}

function SecondPage() {
  return (
    <box
      cssClasses={["qs-toggles-page"]}
      name={"qs-page-second"}
      vertical={true}
    >
      <box>
        <NetworkToggle />
        <QSSpaceBetweenToggles/>
        <ScreenRecordToggle />
      </box>
      <QSScreenRecordMenu />

      <QSSpaceBetweenToggleBoxes/>

      <box>
        <DNDToggle />
        <QSSpaceBetweenToggles/>
        <ColorPickerToggle />
      </box>

      <QSSpaceBetweenToggleBoxes/>

      <box>
        <NoteToggle />
        <QSSpaceBetweenToggles/>
        <QSEmptyButton />
      </box>
    </box>
  );
}

export default () => {
  return (
    <box
      cssClasses={["qs-toggles"]}
      vertical={true}
    >
      <stack
        visibleChildName={qsTogglesPage()}
        transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
      >
        <FirstPage />
        <SecondPage />
      </stack>

      <QSLightstripMenu />

      <box
        halign={Gtk.Align.CENTER}
        cssClasses={["qs-pages-box"]}
      >
        <button
          cssClasses={bind(qsTogglesPage).as((page) => {
            if (page === "qs-page-first") {
              return ["workspace-button", "active"];
            }
            return ["workspace-button"];
          })}
          onClicked={() => {
            qsRevertRevealerStatus("");
            qsTogglesPage.set("qs-page-first");
          }}
        >
          <box cssClasses={["workspace-dot"]} />
        </button>
        <button
          cssClasses={bind(qsTogglesPage).as((page) => {
            if (page === "qs-page-second") {
              return ["workspace-button", "active"];
            }
            return ["workspace-button"];
          })}
          onClicked={() => {
            qsRevertRevealerStatus("");
            qsTogglesPage.set("qs-page-second");
          }}
        >
          <box cssClasses={["workspace-dot"]} />
        </button>
      </box>
    </box>
  );
}
