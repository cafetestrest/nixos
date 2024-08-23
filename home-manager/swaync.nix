{ config, lib, pkgs, ... }:

{
  # TODO
  home.packages = with pkgs; [
    swaynotificationcenter     #notifications
  ];

  home.file = {
    #swaync config
    ".config/swaync/config.json" = {
      source = ../config/swaync/config.json;
    };

    #swaync style
    ".config/swaync/style.css" = {
      source = ../config/swaync/style.css;
    };
  };
}
