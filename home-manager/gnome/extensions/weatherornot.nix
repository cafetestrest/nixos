{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.weatherornot;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.weatherornot.enable = mkEnableOption "Enables weatherornot Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.weather-or-not
    ];

    dconf.settings = {
      "org/gnome/shell/extensions/weatherornot" = {
        position = "clock-right-centered";
      };
    };
  };
}
