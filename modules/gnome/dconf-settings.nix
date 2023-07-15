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
      #fonts
      #font-name = "Ubuntu 11";
      #document-font-name = "Ubuntu 11";

      #cursor
      cursor-theme = "macOS-Monterey";

      #clock in top bar
      clock-show-seconds = true;
      clock-show-weekday = true;

      #dark theme
      color-scheme = "prefer-dark";
    };

    "org/gnome/desktop/wm/preferences" = {
      #titlebar-font = "Ubuntu Bold 11";
      # button-layout = "close,minimize,maximize:appmenu";
      button-layout = "close,minimize:appmenu";
      action-double-click-titlebar = "none";
    };

    "org/gnome/desktop/peripherals/keyboard" = {
      numlock-state = true;
      remember-numlock-state = true;
    };

  };
}
