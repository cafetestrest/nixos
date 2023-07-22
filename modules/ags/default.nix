{ config, lib, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  nixpkgs.overlays = [
    (final: prev:
      {
        ags = prev.callPackage ../overlays/ags { };
      }
    )
  ];

  environment.systemPackages = with pkgs; [
    ags
    socat
  ];

  home-manager.users.${user} = {
    home.file = {
      # ".config/ags" = {
      #   source = ./ags;
      # };
    };
  };
}
