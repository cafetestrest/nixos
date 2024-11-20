{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.tiling-assistant;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.tiling-assistant.enable = mkEnableOption "Enables tiling-assistant Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    # home.packages = with pkgs; [
    #   gnomeExtensions.tiling-assistant
    # ];

    dconf.settings = {
      "org/gnome/shell/extensions/tiling-assistant" = {
        dynamic-keybinding-behavior=3;
        enable-tiling-popup=false;
        tile-bottom-half=["<Super><Shift>Down" "<Super>KP_2"];
        tile-top-half=["<Super><Shift>Up" "<Super>KP_8"];
      };
    };
  };
}
