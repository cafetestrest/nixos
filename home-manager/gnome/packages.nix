{ config, pkgs, ... }:

{
  #   # logic that allows to switch to unstable (use fcitx5 instead of deprecated fcitx-engines)
  #   # #https://discourse.nixos.org/t/error-when-upgrading-nixos-related-to-fcitx-engines/26940/10
  # nixpkgs.overlays = [
  #   (self: super: {
  #     fcitx-engines = pkgs.fcitx5;
  #   })
  # ];

  # nixpkgs.overlays = [
  #   (final: prev: { 
  #     orchis-theme = (prev.orchis-theme.override {
  #       border-radius = 3;
  #       tweaks = [ "compact" ];
  #     }).overrideAttrs (finalAttrs: {
  #       src = final.fetchFromGitHub {
  #         repo = "Orchis-theme";
  #         owner = "vinceliuice";
  #         rev = "2023-03-18";
  #         hash = "sha256-ixVHQRJXoXuPEsrbWOVMC/qdF3szpxYzC/8kKe47Bs8=";
  #       };
  #     });
  #   })
  # ];

  home.packages = with pkgs; [
    gnome.gnome-tweaks        #gnome tweaks app
    gnome.gnome-themes-extra  #for building orchis theme (with sassc)
    gnome.dconf-editor        #gnome dconf editor app
    gnome.eog
    # xpad                      #sticky notes
    shotwell                #photo editor for gnome
    #orchis-theme            #theme for gnome
  ];
}
