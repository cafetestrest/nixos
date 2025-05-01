import { execAsync } from "ags/process";
import icons from "../../../lib/icons";
import QSToggleBlueprint from "../items/QSToggleBlueprint";

export default () => {
    return (
        <QSToggleBlueprint
            className={"note"}
            icon={icons.note}
            label={"Open Note"}
            clicked={() => {
                execAsync(["bash", "-c", "codium ~/Documents/note.md"])
                    .catch((err) => console.error(err))
            }}
        />
    );
}
