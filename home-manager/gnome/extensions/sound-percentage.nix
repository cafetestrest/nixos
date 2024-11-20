{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.sound-percentage;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.sound-percentage.enable = mkEnableOption "Enables sound-percentage Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.sound-percentage
    ];

    # dconf.settings = {
    #   "org/gnome/shell/extensions/sound-percentage" = {
    #   };
    # };
  };
}
