{ config, pkgs, ... }:

let
  cursor-theme = "macOS-Monterey";
  cursor-package = pkgs.apple-cursor;
in
{
    gtk = {
        enable = true;

        font.name = "Cantarell 11";

        theme = {
            name = "Orchis-Dark";
            # package = pkgs.juno-theme;
        };

        iconTheme = {
            name = "Adwaita";
            package = pkgs.gnome.adwaita-icon-theme;
        };

        cursorTheme = {
            name = cursor-theme;
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
            XCURSOR_THEME = cursor-theme;
            XCURSOR_SIZE = "24";
            # GTK_THEME = gtk-theme;
        };

        pointerCursor = {
            size = 24;
            gtk.enable = true;
            # x11.enable = true;
            package = cursor-package;
            name = cursor-theme;
        };
    };
}
