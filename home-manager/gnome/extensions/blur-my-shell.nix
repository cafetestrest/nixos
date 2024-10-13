{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.blur-my-shell;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.blur-my-shell.enable = mkEnableOption "Enables blur-my-shell Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.blur-my-shell
    ];

    dconf.settings = {
      "org/gnome/shell/extensions/blur-my-shell/panel" = {
        brightness=0.59999999999999998;
        pipeline="pipeline_default";
        sigma=30;
        style-panel=2;
      };
    };
  };
}
