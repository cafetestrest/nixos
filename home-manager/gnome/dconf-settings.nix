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
        "super-key@tommimon.github.com"
        "useless-gaps@pimsnel.com"
        #"pop-shell@system76.com"
      ];
    };

    "org/gnome/desktop/interface" = {
      #monospace-font-name = "MesloLGS Nerd Font Mono 10";
      font-name = "":
      clock-show-seconds = true;
      clock-show-weekday = true;
      color-scheme = "prefer-dark";
    };

    "org.gnome.desktop.peripherals.keyboard" = {
      numlock-state = true;
    };

  };
}