{ config, pkgs, ... }:

{
  dconf.settings = {
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
  };
}
