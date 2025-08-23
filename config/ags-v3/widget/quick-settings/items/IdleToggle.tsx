import icons from "../../../lib/icons";
import QSToggleBlueprint from "../items/QSToggleBlueprint";
import Service, { profileName } from "../../../service/IdleService";
import { createBinding } from "ags";

export default () => {
    if (!Service) {
        return (
            <box cssClasses={["empty-toggle"]}/>
        );
    }

    const profile = createBinding(Service, "profile");

    return (
        <QSToggleBlueprint
            className={profile.as(p => p ? ["toggles", "control-center-button", "active"] : ["toggles", "control-center-button", "inactive"])}
            icon={profile.as((p) => icons.idle[p])}
            label={profile.as((p) => profileName(p))}
            clicked={() => {
                Service && Service.nextProfile()
            }}
        />
    );
}
