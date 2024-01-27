{ config, pkgs, ... }:

{
  dconf.settings = {
    "org/gnome/shell" = {
      favorite-apps = [
        "terminator.desktop"
        "chromium-browser.desktop"
        "org.gnome.Nautilus.desktop"
        "org.gnome.TextEditor.desktop"
      ];
    };

    "org/gnome/desktop/interface" = {
      #theme
      gtk-theme = "Orchis-Dark";

      #fonts
      font-name = "Cantarell 11";
      document-font-name = "Cantarell 11";
      monospace-font-name = "Source Code Pro 10";

      #cursor
      cursor-theme = "macOS-Monterey";

      #icon
      icon-theme = "Adwaita";

      #clock in top bar
      clock-show-seconds = true;
      clock-show-weekday = true;

      #dark theme
      color-scheme = "prefer-dark";
    };

    "org/gnome/desktop/wm/preferences" = {
      button-layout = "close,minimize:appmenu";
      action-double-click-titlebar = "none";
    };

    "org/gnome/desktop/peripherals/keyboard" = {
      numlock-state = true;
      remember-numlock-state = true;
    };

    "org/gnome/settings-daemon/plugins/color" = {
      night-light-enabled = true;
      night-light-schedule-automatic = true;
      night-light-temperature = "2700";
    };
  };
}
