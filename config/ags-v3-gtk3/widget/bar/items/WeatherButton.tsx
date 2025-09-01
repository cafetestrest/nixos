import { Astal, Gdk } from "ags/gtk3";
import App from "ags/gtk3/app";
import { enableBarWeather, namespaceWeather } from "../../common/Variables";
import { fetchWeather, updatedAt, weather } from "../../../service/WeatherService";

export default () => {
    if (enableBarWeather === false) {
        return (
            <box visible={false} />
        );
    }

    return <button
        onClicked={() => App.toggle_window(namespaceWeather)}
        onClickRelease={(self, event) => {
            switch (event.button) {
                case Gdk.BUTTON_SECONDARY:
                case Gdk.BUTTON_MIDDLE:
                    fetchWeather();
            }
        }}
        class={"weather bar-button"}
        label={weather((w) => {
            let tooltip = w;
            let indicator = "";

            if (!tooltip)
                return indicator;

            tooltip.forEach(w => {
                if (w.indicator)
                    indicator = w.indicator
            });

            return indicator;
        })}
        tooltipText={updatedAt}
        visible={weather((w) => w !== null && w.length > 0)}
        $={(self) => {
            const window = App.get_window(namespaceWeather);
            if (window) {
                window.connect("notify::visible", () => {
                    Astal.widget_toggle_class_name(self, "active", window.visible);
                });
            }
        }}
    />
}
