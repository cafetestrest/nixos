{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.bluetooth-battery-meter;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.bluetooth-battery-meter.enable = mkEnableOption "Enables Bluetooth Battery Meter Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.bluetooth-battery-meter
    ];

    dconf.settings = {
      "org/gnome/shell/extensions/Bluetooth-Battery-Meter" = {
        enable-battery-indicator-text = true;
        enable-battery-level-text = true;
        swap-icon-text = false;
      };
    };
  };
}
