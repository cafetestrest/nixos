{ config, lib, pkgs, modulesPath, ... }:

let
  inherit (import ../../variables.nix)
    efiSysMountPoint
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

    #../vm/virt-manager.nix       # Turn this on for VM only
    ../vm/packages.nix #on VM can disable this one
  ];

  # Bootloader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
  boot.loader.efi.efiSysMountPoint = "${efiSysMountPoint}";
  boot.loader.systemd-boot.configurationLimit = configurationLimit;
}
