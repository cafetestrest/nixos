import { bind, Variable } from "astal"
import { App, Gtk, Astal, Gdk } from "astal/gtk3";
import NightlightToggle from "./NightlightToggle";
import IdleToggle from "./IdleToggle";
import { qsTogglesPage } from "../../common/Variables";
import MicrophoneToggle from "./MicrophoneToggle";
import DNDToggle from "./DNDToggle";

function QSSpaceBetweenToggles() {
  return (
    <box className={"toggles-space"} />
  );
}

function QSSpaceBetweenToggleBoxes() {
  return (
    <box className={"toggles-box-space"} />
  );
}

function FirstPage() {
  return (
    <box
      className={"qs-page"}
      name={"qs-page-first"}
      vertical
    >
      <box>
        <IdleToggle />
        {/* todo move later */}
        {/* <BluetoothToggle /> */}
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
        <QSSpaceBetweenToggles/>
        {/* <ScreenRecordToggle /> */}
      </box>
    </box>
  );
}

function SecondPage() {
  return (
    <box
      className={"qs-page"}
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
      <box
        halign={Gtk.Align.CENTER}
      >
        <button label={"."} onClicked={() => qsTogglesPage.set("qs-page-first")}/>
        <button label={"."} onClicked={() => qsTogglesPage.set("qs-page-second")}/>
      </box>
    </box>
  );
}
