{ config, lib, pkgs, inputs, ... }:

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
    # inputs.ags.packages.${pkgs.system}.default      #ags flake
    ags
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
