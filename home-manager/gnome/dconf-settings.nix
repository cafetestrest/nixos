{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    gtkTheme
    gtkFontName
    gtkIconTheme
    cursorTheme;
in
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
      gtk-theme = "${gtkTheme}";

      #fonts
      font-name = "${gtkFontName}";
      document-font-name = "${gtkFontName}";
      monospace-font-name = "Source Code Pro 10";

      #cursor
      cursor-theme = "${cursorTheme}";

      #icon
      icon-theme = "${gtkIconTheme}";

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

    "org/blueman/general" = {
      plugin-list=[
        "!ConnectionNotifier"
        "!StatusNotifierItem"
      ];
    };

    "org/gnome/desktop/app-folders" = {
      folder-children=''['Utilities', 'YaST', '34ef9738-be1a-4e66-82a3-4fca8235702a']'';
    };

    "org/gnome/desktop/app-folders/folders/34ef9738-be1a-4e66-82a3-4fca8235702a" = {
      apps=''['lock.desktop', 'logout.desktop', 'shutdown.desktop', 'sleep.desktop', 'restart.desktop']'';
      name="Unnamed Folder";
    };
  };
}
