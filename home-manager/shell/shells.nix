{ config, pkgs, ... }:

{
  imports =
    [
      ./aliases.nix
      ./fish.nix
      ./bashrc.nix
      ./omf/commands.nix
      ./omf/plugins.nix
  ];
}
