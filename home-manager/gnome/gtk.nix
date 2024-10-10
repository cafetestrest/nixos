{ config, pkgs, lib, vars, ... }:

with lib;

let
  cfg = config.module.gnome.gtk-config;
  gtkThemePackageCfg = config.module.gnome.gtkThemePackage;
  cursorPackageCfg = config.module.gnome.cursorPackage;
  preferDarkThemeCfg = config.module.gnome.preferDarkTheme;
in
{
  options = {
    module.gnome.gtk-config.enable = mkEnableOption "Enables GTK config";
    module.gnome.cursorPackage = mkOption {
      type = types.package;
      description = "GTK Cursor Package to be included when enabled";
      default = pkgs.apple-cursor;
    };
    module.gnome.gtkThemePackage = mkOption {
      type = types.package;
      description = "GTK Theme Package to be included when enabled";
      default = (pkgs.orchis-theme.override { border-radius = 3; tweaks = [ "compact" "macos" "submenu" ];});
    };
    module.gnome.preferDarkTheme = mkOption {
      type = types.int;
      description = "Which mode to prefer when enabled";
      default = 1;
    };
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      gnome.eog
      shotwell                #photo editor for gnome
      gtkThemePackageCfg
    ];

    gtk = {
        enable = true;

        font.name = "${vars.gtk.gtkFontName}";

        theme = {
            name = "${vars.gtk.gtkTheme}";
            package = gtkThemePackageCfg;
        };

        iconTheme = {
            name = "${vars.gtk.gtkIconTheme}";
        };

        cursorTheme = {
          name = "${vars.gtk.cursorTheme}";
          package = cursorPackageCfg;
          size = 24;
        };

        gtk3.extraConfig = {
            gtk-application-prefer-dark-theme=preferDarkThemeCfg;
        };

        gtk4.extraConfig = {
            gtk-application-prefer-dark-theme=preferDarkThemeCfg;
        };
    };

    xdg.configFile = {
      "gtk-4.0/assets".source = "${config.gtk.theme.package}/share/themes/${config.gtk.theme.name}/gtk-4.0/assets";
      "gtk-4.0/gtk.css".source = "${config.gtk.theme.package}/share/themes/${config.gtk.theme.name}/gtk-4.0/gtk.css";
      "gtk-4.0/gtk-dark.css".source = "${config.gtk.theme.package}/share/themes/${config.gtk.theme.name}/gtk-4.0/gtk-dark.css";
    };

    home = {
    #   sessionVariables = {
    #       XCURSOR_THEME = "${vars.gtk.cursorTheme}";
    #       XCURSOR_SIZE = vars.gtk.cursorSize;
    #       GTK_THEME = "${vars.gtk.gtkTheme}";
    #   };

      pointerCursor = {
          size = vars.gtk.cursorSize;
          gtk.enable = true;
          # x11.enable = true;
          package = cursorPackageCfg;
          name = "${vars.gtk.cursorTheme}";
      };
    };
  };
}
