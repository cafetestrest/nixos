{ config, lib, pkgs, modulesPath, ... }:

let
  inherit (import ../../variables.nix)
    grubHardDriveForVM
    configurationLimit;
in
{
  imports = [
    ../configuration.nix
    ../packages.nix
    # Include the results of the hardware scan.
    ./hardware-configuration.nix
    ../../modules/gnome/packages.nix
    ../../modules/gnome/fonts.nix
    ../vm/spice-virt-manager.nix #tools for VM copy/paste clipboard
  ];

  # Bootloader for VM.
  boot.loader.grub.enable = true;
  boot.loader.grub.device = "${grubHardDriveForVM}";
  boot.loader.grub.useOSProber = true;
  boot.loader.grub.configurationLimit = configurationLimit;
}
