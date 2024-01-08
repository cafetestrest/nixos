{ config, pkgs, ... }:

{
  imports =
    [
      ../config/gtklock/config.nix
    ];

  home.file = {
    ".config/gtklock/style.css" = {
      source = ../config/gtklock/style.css;
    };

    #####should stay removed as we are applying the same fix via overlay patch
    # ".config/gtklock/gtklock.ui" = {
    #   source = ../config/gtklock/gtklock.ui;
    # };
  };
}
