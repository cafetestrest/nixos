{ config, lib, pkgs, inputs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  environment.systemPackages = with pkgs; [
    inputs.ags.packages.${pkgs.system}.default      #ags flake
    socat
    sassc
  ];

  home-manager.users.${user} = {
    home.file = {
      # ".config/ags" = {
      #   source = ./ags;
      # };
    };
  };
}
