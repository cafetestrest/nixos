{ config, lib, pkgs, ... }:

{
  programs.kitty = {
    enable = true;
  };

  xdg.configFile."kitty/kitty.conf" = {
    source = ../config/terminal/kitty/kitty.conf;
  };

  xdg.configFile."kitty/dark.conf".source = "${pkgs.kitty-themes}/share/kitty-themes/themes/VSCode_Dark.conf";

  # xdg.configFile."kitty" = {
  #   source = ../config/terminal/kitty;
  #   # recursive = true;
  # };
}
