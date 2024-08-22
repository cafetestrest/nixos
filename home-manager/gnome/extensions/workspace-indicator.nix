{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.workspace-indicator;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.workspace-indicator.enable = mkEnableOption "Enables workspace-indicator Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.workspace-indicator
    ];
  };
}
