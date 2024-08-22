{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.fuzzy-app-search;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.fuzzy-app-search.enable = mkEnableOption "Enables fuzzy-app-search Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.fuzzy-app-search
    ];
  };
}
