{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.gsconnect;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.gsconnect.enable = mkEnableOption "Enables gsconnect Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.gsconnect
    ];
  };
}
