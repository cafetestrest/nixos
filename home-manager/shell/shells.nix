{ config, pkgs, ... }:

{
  imports =
    [
      ./aliases.nix
      ./fish.nix
      ./bashrc.nix
  ];
}
