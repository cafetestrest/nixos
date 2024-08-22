{ config, pkgs, lib, vars, ... }:

with lib;

let
  orchis = (pkgs.orchis-theme.override {  #TODO move this out
    border-radius = 3;
    tweaks = [ "compact" "macos" "submenu" ];
  });

  cursor-package = pkgs.apple-cursor; #TODO move this out

  cfg = config.module.gnome.gtk-config;
in
{
  options = {
    module.gnome.gtk-config.enable = mkEnableOption "Enables GTK config";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      gnome.eog
      shotwell                #photo editor for gnome
      orchis
    ];

    gtk = {
        enable = true;

        font.name = "${vars.gtk.gtkFontName}";

        theme = {
            name = "${vars.gtk.gtkTheme}";
            package = orchis;
        };

        iconTheme = {
            name = "${vars.gtk.gtkIconTheme}";
        };

        cursorTheme = {
          name = "${vars.gtk.cursorTheme}";
          package = cursor-package;
          size = 24;
        };

        gtk3.extraConfig = {
            gtk-application-prefer-dark-theme=1;  #TODO move out
        };

        gtk4.extraConfig = {
            gtk-application-prefer-dark-theme=1;
        };
    };

    xdg.configFile = {  #TODO move out
      "gtk-4.0/assets".source = "${config.gtk.theme.package}/share/themes/${config.gtk.theme.name}/gtk-4.0/assets";
      "gtk-4.0/gtk.css".source = "${config.gtk.theme.package}/share/themes/${config.gtk.theme.name}/gtk-4.0/gtk.css";
      "gtk-4.0/gtk-dark.css".source = "${config.gtk.theme.package}/share/themes/${config.gtk.theme.name}/gtk-4.0/gtk-dark.css";
    };

    # home = {
    #   sessionVariables = {
    #       XCURSOR_THEME = "${vars.gtk.cursorTheme}";
    #       XCURSOR_SIZE = vars.gtk.cursorSize;
    #       GTK_THEME = "${vars.gtk.gtkTheme}";
    #   };

    #   pointerCursor = {
    #       size = vars.gtk.cursorSize;
    #       gtk.enable = true;
    #       # x11.enable = true;
    #       package = cursor-package;
    #       name = "${vars.gtk.cursorTheme}";
    #   };
    # };
  };
}
