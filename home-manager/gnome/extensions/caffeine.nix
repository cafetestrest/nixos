{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.caffeine;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.caffeine.enable = mkEnableOption "Enables caffeine Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.caffeine
    ];

    dconf.settings = {
      "org/gnome/shell/extensions/caffeine" = {
        enable-fullscreen = false;
        show-indicator="always";
        toggle-shortcut=["<Alt>c"];
      };
    };
  };
}
