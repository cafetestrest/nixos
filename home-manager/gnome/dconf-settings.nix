{ config, lib, vars, ... }:

with lib;

let
  cfg = config.module.gnome.dconf-settings;
  favoriteAppsCfg = config.module.gnome.favoriteApps;
  hyprlandCfg = config.module.hypr.hyprland;
in
{
  options = {
    module.gnome.dconf-settings.enable = mkEnableOption "Enables GTK dconf settings";

    module.gnome.favoriteApps = mkOption {
      type = types.listOf types.str;
      description = "List of favorite applications in GNOME Shell";
      default = [ "org.gnome.Nautilus.desktop" "org.gnome.TextEditor.desktop" ];
    };
  };

  config = mkIf cfg.enable {
    dconf.settings = {
      "org/gnome/shell" = {
        favorite-apps = favoriteAppsCfg;
      };

      "org/gnome/desktop/interface" = {
        #theme
        gtk-theme = "${vars.gtk.gtkTheme}";

        #fonts
        font-name = lib.mkForce "${vars.gtk.gtkFontName}";
        document-font-name = lib.mkForce "${vars.gtk.gtkFontName}";
        monospace-font-name = "Ubuntu Sans Mono 13";

        #cursor
        cursor-theme = "${vars.gtk.cursorTheme}";

        #icon
        icon-theme = "${vars.gtk.gtkIconTheme}";

        #clock in top bar
        clock-show-seconds = true;
        clock-show-weekday = true;

        #dark theme
        # color-scheme = "prefer-dark";
      };

      "org/gnome/desktop/wm/preferences" = {
        button-layout = if hyprlandCfg.enable
          then "close,minimize:appmenu"
          else "close,minimize,maximize:appmenu";
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

      # disables Low Disk Space on "boot" notification due to dual boot
      "org/gnome/settings-daemon/plugins/housekeeping" = {
        ignore-paths=[
          "/boot"
        ];
      };
    };
  };
}
