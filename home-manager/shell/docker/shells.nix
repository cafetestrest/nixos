{ config, lib, ... }:

with lib;

{
  options = {
    module.shell.docker.enable = mkEnableOption "Enables docker aliases";
  };

  imports =
    [
      ./fish.nix
      ./bash.nix
  ];
}
