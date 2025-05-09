import Gtk from "gi://Gtk?version=4.0";
import QSMainLayout from "./QSMainLayout";
import { config } from "../../lib/config";
import PopupBlueprint from "../popup/PopupBlueprint";

export default () => {
  return (
    <PopupBlueprint
      class={"quicksettings"}
      name="quicksettings"
      onClose={() => {}}
      marginTop={config.quickSettings.marginTop}
      marginRight={config.quickSettings.marginRight}
      valign={Gtk.Align.START}
      halign={Gtk.Align.END}
    >
      <QSMainLayout />
    </PopupBlueprint>
  );
}
