import { Gtk } from "astal/gtk3";
import { bind } from "astal";
import icons from "../../../lib/icons";
import { FanProfile, profileName } from "../../../service/FanProfiles";
import FanProfileSerivce from "../../../service/FanProfiles";
import Page from "../Page";

const FanProfileItem = (profile: FanProfile) => (
	<button
		className="control-center__page_item"
		onClicked={() => FanProfileSerivce.setProfile(profile)}
	>
		<box>
			<icon icon={icons.powerprofile[profile]} />
			<label label={profileName(profile)} />
			<icon
				icon={icons.ui.tick}
				hexpand
				halign={Gtk.Align.END}
				visible={bind(FanProfileSerivce, "profile").as(
					(p) => p === profile,
				)}
			/>
		</box>
	</button>
);

export default () => {
	if (FanProfileSerivce)
		return (
			<Page label={"Profiles"}>
				<box vertical spacing={8}>
					<box vertical spacing={4}>
						{FanProfileSerivce.profiles.map(FanProfileItem)}
					</box>
				</box>
			</Page>
		);
};
