{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.openweather;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.openweather.enable = mkEnableOption "Enables openweather Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.openweather
    ];
  };
}
