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
        extension-index=0;
        extension-position="left";
        max-widget-width=200;
        mouse-actions=''['toggle_play', 'toggle_menu', 'none', 'none', 'none', 'none', 'none', 'none']'';
        show-control-icons=true;
        show-next-icon=true;
        show-prev-icon=true;
        show-seek-back=false;
        show-seek-forward=false;
        show-seperators=false;
        show-sources-menu=false;
        track-label=''['artist', '-', 'track']'';
      };
    };
  };
}
