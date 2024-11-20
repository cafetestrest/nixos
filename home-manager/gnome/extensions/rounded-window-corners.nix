{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.rounded-window-corners;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.rounded-window-corners.enable = mkEnableOption "Enables rounded-window-corners Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.rounded-window-corners-reborn
    ];
  };
}
