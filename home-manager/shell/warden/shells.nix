{ config, lib, ... }:

with lib;

{
  options = {
    module.shell.warden.enable = mkEnableOption "Enables warden aliases";
  };

  imports =
    [
      ./aliases.nix
      ./fish.nix
      ./bash.nix
  ];
}
