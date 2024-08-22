{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.tray-icons-reloaded;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.tray-icons-reloaded.enable = mkEnableOption "Enables tray-icons-reloaded Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.tray-icons-reloaded
    ];
  };
}
