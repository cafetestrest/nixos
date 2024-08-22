{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.appindicator;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.appindicator.enable = mkEnableOption "Enables appindicator Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.appindicator
    ];
  };
}
