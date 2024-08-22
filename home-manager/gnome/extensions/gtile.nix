{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.gtile;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.gtile.enable = mkEnableOption "Enables gtile Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.gtile
    ];

    dconf.settings = {
      "org/gnome/shell/extensions/gtile" = {
        show-icon=false;
        theme="Default";
      };
    };
  };
}
