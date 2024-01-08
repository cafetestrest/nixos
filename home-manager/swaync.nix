{ config, lib, pkgs, ... }:

{
  home.packages = with pkgs; [
    swaynotificationcenter     #notifications
  ];

  home.file = {
    #swaync config
    ".config/swaync/config.json" = {
      source = ./config/config.json;
    };

    #swaync style
    ".config/swaync/style.css" = {
      source = ./config/style.css;
    };
  };
}
