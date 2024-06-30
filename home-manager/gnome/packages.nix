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
  #   # logic that allows to switch to unstable (use fcitx5 instead of deprecated fcitx-engines)
  #   # #https://discourse.nixos.org/t/error-when-upgrading-nixos-related-to-fcitx-engines/26940/10
  # nixpkgs.overlays = [
  #   (self: super: {
  #     fcitx-engines = pkgs.fcitx5;
  #   })
  # ];

  home.packages = with pkgs; [
    gnome.gnome-tweaks        #gnome tweaks app
    gnome.gnome-themes-extra  #for building orchis theme (with sassc)
    gnome.dconf-editor        #gnome dconf editor app
    gnome.eog
    # xpad                      #sticky notes
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

  home.sessionVariables.GTK_THEME = "${gtkTheme}";
}
