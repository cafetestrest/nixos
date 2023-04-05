{ config, lib, pkgs, modulesPath, ... }:

let
  inherit (import ../../variables.nix)
  grubHardDriveForVM;
in
{
  # Bootloader for VM.
  boot.loader.grub.enable = true;
  boot.loader.grub.device = "${grubHardDriveForVM}";
  boot.loader.grub.useOSProber = true;
  boot.loader.grub.configurationLimit = "${configurationLimit}";
}
