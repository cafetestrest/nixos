{ config, lib, pkgs, ... }:

{
  programs.kitty = {
    enable = true;
  };

  xdg.configFile."kitty/kitty.conf" = {
    source = ../config/terminal/kitty/kitty.conf;
  };

  # kitty folder
  # xdg.configFile."kitty" = {
  #   source = ../config/terminal/kitty;
  #   recursive = true;
  # };
}
