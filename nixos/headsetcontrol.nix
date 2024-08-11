{ config, pkgs, ... }:

{
  imports = [
    ./udev/headsetcontrol-udev.nix
  ];
}
