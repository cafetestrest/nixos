import { bind, Variable } from "astal"
import { App, Gtk, Astal, Gdk } from "astal/gtk3";
import NightlightButton from "./NightlightButton";
import IdleButton from "./IdleButton";

export const qsTogglesPage = Variable("qs-page-first");

function FirstPage() {
    return (
      <box
        className={"qs-page"}
        name={"qs-page-first"}
        vertical
      >
        <box>
            <button label={"1"} onClicked={() => qsTogglesPage.set("qs-page-second")}/>
            <NightlightButton />
            <IdleButton />
        </box>
        <box>
            <button label={"4"}/>
            <button label={"5"}/>
            <button label={"6"}/>
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
        <box className={"qs-toggles"}>
            <stack
                visibleChildName={qsTogglesPage()}
                transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
            >
                <FirstPage />
                <SecondPage />
            </stack>
        </box>
    );
}
