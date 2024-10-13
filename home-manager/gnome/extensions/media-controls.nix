{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.media-controls;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.media-controls.enable = mkEnableOption "Enables media-controls Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.media-controls
    ];

    dconf.settings = {
      "org/gnome/shell/extensions/mediacontrols" = {
        colored-player-icon=false;
      };
    };
  };
}
