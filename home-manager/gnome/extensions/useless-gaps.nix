{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.useless-gaps;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.useless-gaps.enable = mkEnableOption "Enables useless-gaps Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.useless-gaps              #missing in gnome 45
    ];

    dconf.settings = {
      "org/gnome/shell/extensions/useless-gaps" = {
        gap-size=15;
        no-gap-when-maximized=true;
      };
    };
  };
}
