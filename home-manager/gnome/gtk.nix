{ config, pkgs, lib, vars, ... }:

let
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
        XCURSOR_THEME = "${vars.gtk.cursorTheme}";
        XCURSOR_SIZE = vars.gtk.cursorSize;
        GTK_THEME = "${vars.gtk.gtkTheme}";
    };

    pointerCursor = {
        size = vars.gtk.cursorSize;
        gtk.enable = true;
        # x11.enable = true;
        package = cursor-package;
        name = "${vars.gtk.cursorTheme}";
    };
  };
}
