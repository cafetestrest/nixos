{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.blur-my-shell;
in
{
  options = {
    module.gnome.extension.blur-my-shell.enable = mkEnableOption "Enables blur-my-shell Gnome extension";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      gnomeExtensions.blur-my-shell
    ];

    dconf.settings = {
      "org/gnome/shell/extensions/blur-my-shell/panel" = {
        blur=true;
        brightness=1.0;
        color="(0.0, 0.0, 0.0, 1.0)";
        customize=true;
        override-background=true;
        sigma=0;
        static-blur=true;
        style-panel=2;
      };
    };
  };
}
