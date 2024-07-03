{ config, pkgs, lib, ... }:

let
  inherit (import ../../variables.nix)
    cursorSize
    cursorTheme
    gtkIconTheme
    gtkFontName
    gtkTheme;

    orchis = (pkgs.orchis-theme.override {
      border-radius = 3;
      tweaks = [ "compact" "macos" "submenu" ];
    });

  cursor-package = pkgs.apple-cursor;
in
{
  home.packages = with pkgs; [
    gnome.eog
    shotwell                #photo editor for gnome
    orchis
  ];

  gtk = {
      enable = true;

      font.name = "${gtkFontName}";

      theme = {
          name = "${gtkTheme}";
          package = orchis;
      };

      iconTheme = {
          name = "${gtkIconTheme}";
      };

      cursorTheme = {
          name = "${cursorTheme}";
      };

      gtk3.extraConfig = {
          gtk-application-prefer-dark-theme=1;
      };

      gtk4.extraConfig = {
          gtk-application-prefer-dark-theme=1;
      };
  };

  xdg.configFile = {
    "gtk-4.0/assets".source = "${config.gtk.theme.package}/share/themes/${config.gtk.theme.name}/gtk-4.0/assets";
    "gtk-4.0/gtk.css".source = "${config.gtk.theme.package}/share/themes/${config.gtk.theme.name}/gtk-4.0/gtk.css";
    "gtk-4.0/gtk-dark.css".source = "${config.gtk.theme.package}/share/themes/${config.gtk.theme.name}/gtk-4.0/gtk-dark.css";
  };

  home = {
    sessionVariables = {
        XCURSOR_THEME = "${cursorTheme}";
        XCURSOR_SIZE = cursorSize;
        GTK_THEME = "${gtkTheme}";
    };

    pointerCursor = {
        size = cursorSize;
        gtk.enable = true;
        # x11.enable = true;
        package = cursor-package;
        name = "${cursorTheme}";
    };
  };
}
