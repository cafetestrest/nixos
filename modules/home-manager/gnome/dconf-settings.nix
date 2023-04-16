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

      disable-user-extensions = false;
      enabled-extensions = [
        "user-theme@gnome-shell-extensions.gcampax.github.com"
        "workspace-indicator@gnome-shell-extensions.gcampax.github.com"
        "trayIconsReloaded@selfmade.pl"
        "rounded-window-corners@yilozt"
        "openweather-extension@jenslody.de"
        "no-overview@fthx"
        "gTile@vibou"
        "gsconnect@andyholmes.github.io"
        "gnome-fuzzy-app-search@gnome-shell-extensions.Czarlie.gitlab.com"
        "executor@raujonas.github.io"
        "dash-to-panel@jderose9.github.com"
        "caffeine@patapon.info"
        "blur-my-shell@aunetx"
        #"super-key@tommimon.github.com"
        "useless-gaps@pimsnel.com"
        #"pop-shell@system76.com"
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
      button-layout = "close,minimize,maximize:appmenu";
      action-double-click-titlebar = "none";
    };

    "org/gnome/desktop/peripherals/keyboard" = {
      numlock-state = true;
    };

  };
}