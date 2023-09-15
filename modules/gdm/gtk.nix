{ config, pkgs, ... }:

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

        gtk3.extraConfig = {
            Settings = ''
                gtk-application-prefer-dark-theme=1
            '';
        };

        gtk4.extraConfig = {
            Settings = ''
                gtk-application-prefer-dark-theme=1
            '';
        };
    };

    home.pointerCursor = {
        size = 24;
        gtk.enable = true;
        # x11.enable = true;
        package = pkgs.apple-cursor;
        name = "macOS-Monterey";
    };
}
