{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.super-key;
  cfgExtensions = config.module.gnome.extension;
  cfgAlbert = config.module.packages.albert;
in
{
  options = {
    module.gnome.extension.super-key.enable = mkEnableOption "Enables super-key Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.super-key
    ];

    dconf.settings = lib.optionals cfgAlbert.enable {
      "org/gnome/shell/extensions/super-key" = {
        overlay-key-action = "albert toggle";
      };
    };
  };
}
