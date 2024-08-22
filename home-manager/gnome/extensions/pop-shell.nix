{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.gnome.extension.pop-shell;
  cfgExtensions = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.pop-shell.enable = mkEnableOption "Enables pop-shell Gnome extension";
  };

  config = mkIf (cfg.enable && cfgExtensions.enable) {
    home.packages = with pkgs; [
      gnomeExtensions.pop-shell
    ];

    dconf.settings = {
      "org/gnome/shell/extensions/pop-shell" = {
        active-hint=false;
        active-hint-border-radius=''uint32 16'';
        gap-inner=''uint32 2'';
        gap-outer=''uint32 2'';
        smart-gaps=true;
        snap-to-grid=true;
        tile-by-default=false;
      };
    };
  };
}
