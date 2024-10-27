{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.packages.kitty;
in
{
  options = {
    module.packages.kitty.enable = mkEnableOption "Enables kitty";
  };

  config = mkIf cfg.enable {
    programs.kitty = {
      enable = true;
      package = pkgs.unstable.kitty;
    };

    home.packages = with pkgs; [
      screen
    ];

    xdg.configFile."kitty/kitty.conf" = {
      source = ../config/terminal/kitty/kitty.conf;
    };

    xdg.configFile."kitty/dark.conf".source = "${pkgs.kitty-themes}/share/kitty-themes/themes/VSCode_Dark.conf";

    # xdg.configFile."kitty" = {
    #   source = ../config/terminal/kitty;
    #   # recursive = true;
    # };
  };
}
