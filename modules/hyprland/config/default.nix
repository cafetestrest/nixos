{ config, pkgs, ... }:

{
  home.file = {
    ".config/hypr/hyprland.conf" = {
      source = ./hyprland.conf;
    };
  };
}
