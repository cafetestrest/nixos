{ config, pkgs, ... }:

{
  imports = [
    ./udev/headsetcontrol-udev.nix
  ];

  environment.systemPackages = with pkgs; [
    headsetcontrol
  ];
}
