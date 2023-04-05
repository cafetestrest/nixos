{ config, lib, pkgs, modulesPath, ... }:

let
  inherit (import ../../variables.nix)
  efiSysMountPoint
  configurationLimit;
in
{
  # Bootloader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
  boot.loader.efi.efiSysMountPoint = "${efiSysMountPoint}";
  boot.loader.systemd-boot.configurationLimit = configurationLimit;
}
