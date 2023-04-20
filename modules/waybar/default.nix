{ config, lib, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  environment.systemPackages = with pkgs; [
    waybar
  ];

  home-manager.users.${user} = {
    # home.file = {
    #   ".config/waybar/config" = {
    #     source = ./config/config;
    #   };
    # };
  };
}
