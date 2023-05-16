{ config, lib, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  environment.systemPackages = with pkgs; [
    unstable.swaynotificationcenter     #notifications
  ];

  home-manager.users.${user} = {
    home.file = {
      # #swaync config
      # ".config/swaync/config.json" = {
      #   source = ./config/config.json;
      # };

      # #swaync style
      # ".config/swaync/style.css" = {
      #   source = ./config/style.css;
      # };
    };
  };
}
