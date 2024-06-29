{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    gtkTheme;
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

    (orchis-theme.override {
        border-radius = 3;
        tweaks = [ "compact" "macos" "submenu" ];
    })
  ];

  home.sessionVariables.GTK_THEME = "${gtkTheme}";
}
