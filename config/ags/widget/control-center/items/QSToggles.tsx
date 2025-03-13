import { bind } from "astal";
import { Gtk } from "astal/gtk3";
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
import ColorToggle from "./ColorToggle";

function QSEmptyButton() {
  return (
    <box className={"toggles empty"}/>
  );
}

function FirstPage() {
  return (
    <box
      className={"qs-toggles-page"}
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
      className={"qs-toggles-page"}
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
        <ColorToggle />
        {/* <QSEmptyButton /> */}
      </box>
    </box>
  );
}

export default () => {
  return (
    <box
      className={"qs-toggles"}
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
        className={"qs-pages-box"}
      >
        <button
          className={bind(qsTogglesPage).as((page) => {
            if (page === "qs-page-first") {
              return "workspace-button active";
            }
            return "workspace-button";
          })}
          onClicked={() => {
            qsRevertRevealerStatus("");
            qsTogglesPage.set("qs-page-first");
          }}
        >
          <box className={"workspace-dot"} />
        </button>
        <button
          className={bind(qsTogglesPage).as((page) => {
            if (page === "qs-page-second") {
              return "workspace-button active";
            }
            return "workspace-button";
          })}
          onClicked={() => {
            qsRevertRevealerStatus("");
            qsTogglesPage.set("qs-page-second");
          }}
        >
          <box className={"workspace-dot"} />
        </button>
      </box>
    </box>
  );
}
