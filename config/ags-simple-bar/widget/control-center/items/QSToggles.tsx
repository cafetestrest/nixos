import { bind, Variable } from "astal"
import { App, Gtk, Astal, Gdk } from "astal/gtk3";
import NightlightToggle from "./NightlightToggle";
import IdleToggle from "./IdleToggle";
import { qsTogglesPage } from "../../common/Variables";
import MicrophoneToggle from "./MicrophoneToggle";
import DNDToggle from "./DNDToggle";
import { QSSpaceBetweenToggleBoxes, QSSpaceBetweenToggles } from "../pages/QSMainPage";
import BluetoothToggle from "./BluetoothToggle";
import ScreenRecordToggle from "./ScreenRecordToggle";
import QSScreenRecordMenu from "../menu/QSScreenRecordMenu";

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
      vertical
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
        <DNDToggle />
      </box>

      <QSSpaceBetweenToggleBoxes/>

      <box>
        <IdleToggle />
        <QSSpaceBetweenToggles/>
        {/* <QSEmptyButton /> */}
        <ScreenRecordToggle />
      </box>
    </box>
  );
}

function SecondPage() {
  return (
    <box
      className={"qs-toggles-page"}
      name={"qs-page-second"}
      vertical
    >
      <box>
        <button label={"11"} onClicked={() => qsTogglesPage.set("qs-page-first")}/>
        <button label={"22"}/>
        <button label={"33"}/>
      </box>
      <box>
        <button label={"44"}/>
        <button label={"55"}/>
        <button label={"66"}/>
      </box>
    </box>
  );
}

export default () => {
  return (
    <box
      className={"qs-toggles"}
      vertical
    >
      <stack
        visibleChildName={qsTogglesPage()}
        transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
      >
        <FirstPage />
        <SecondPage />
      </stack>

      <QSScreenRecordMenu />

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
          onClicked={() => qsTogglesPage.set("qs-page-first")}
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
          onClicked={() => qsTogglesPage.set("qs-page-second")}
        >
          <box className={"workspace-dot"} />
        </button>
      </box>
    </box>
  );
}
