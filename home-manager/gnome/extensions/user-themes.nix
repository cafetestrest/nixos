{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.user-themes;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.user-themes.enable = mkEnableOption "Enables user-themes Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.user-themes
    ];
  };
}
