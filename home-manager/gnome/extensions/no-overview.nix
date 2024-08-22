{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.no-overview;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.no-overview.enable = mkEnableOption "Enables no-overview Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.no-overview
    ];
  };
}
