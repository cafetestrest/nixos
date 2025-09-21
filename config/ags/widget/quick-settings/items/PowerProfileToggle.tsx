import QSToggle from "./QSToggle";
import { createBinding } from "ags";
import AstalPowerProfiles from "gi://AstalPowerProfiles";

export default () => {
    const allProfiles = [
        "balanced",
        "power-saver",
        "performance",
    ];

    const powerprofiles = AstalPowerProfiles.get_default();
    const profile = createBinding(powerprofiles, "activeProfile");

    const setProfile = (profile: string) => {
        powerprofiles.set_active_profile(profile)
    };

    const nextProfile = () => {
        const current = powerprofiles.activeProfile;
        const idx = allProfiles.indexOf(current);
        const next = allProfiles[(idx + 1) % allProfiles.length];
        setProfile(next);
    };

    return (
        <QSToggle
            className={profile.as((p) => {
                if (p === "performance") {
                    return "toggles quick-settings-button active";
                }
                return "toggles quick-settings-button";
            })}
            onPrimaryClick={nextProfile}
            icon={createBinding(powerprofiles, "iconName")}
            label={profile.as(p => {
                if (p === "power-saver") {
                    return "Power Saver"
                }
                return p.charAt(0).toUpperCase() + p.slice(1);
            })}
            hasArrow={false}
        />
    );
}
