{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    cursorSize
    cursorTheme
    gtkTheme
    gtkIconTheme
    gtkFontName
    user;

  cursor-package = pkgs.apple-cursor;
in
{
    gtk = {
        enable = true;

        font.name = "${gtkFontName}";

        theme = {
            name = "${gtkTheme}";
            # package = pkgs.juno-theme;
        };

        iconTheme = {
            name = "${gtkIconTheme}";
            package = pkgs.gnome.adwaita-icon-theme;
        };

        cursorTheme = {
            name = "${cursorTheme}";
            package = cursor-package;
        };

        gtk3.extraConfig = {
            gtk-application-prefer-dark-theme=1;
        };

        gtk4.extraConfig = {
            gtk-application-prefer-dark-theme=1;
        };
    };

    home = {
        sessionVariables = {
            XCURSOR_THEME = "${cursorTheme}";
            XCURSOR_SIZE = cursorSize;
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
