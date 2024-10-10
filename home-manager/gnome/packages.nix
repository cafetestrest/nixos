{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.packages;
in
{
  options = {
    module.gnome.packages.enable = mkEnableOption "Enables GNOME packages";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      gnome.gnome-tweaks        #gnome tweaks app
      gnome.dconf-editor        #gnome dconf editor app
      # gnome-themes-extra  #for building orchis theme (with sassc)
      # xpad                      #sticky notes
    ];
  };
}
