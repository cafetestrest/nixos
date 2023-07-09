{ config, lib, pkgs, modulesPath, ... }:

let
  inherit (import ../../variables.nix)
    grubHardDriveForVM
    configurationLimit;
in
{
  imports = [
    ../configuration.nix              # shared configuration
    ../packages.nix                   # shared packages
    
    ./hardware-configuration.nix      # Include the results of the hardware scan. (generated from fresh install on virt-manager)

    ../../modules/gnome/packages.nix  # gnome packages
    ../../modules/modules/fonts       # fonts

    ../../modules/gnome/extensions.nix# gnome extensions

    ../../modules/hyprland            # hyprland packages

    ../vm/spice-virt-manager.nix      # tools for VM copy/paste clipboard
  ];

  # Bootloader for VM.
  boot.loader.grub.enable = true;
  boot.loader.grub.device = "${grubHardDriveForVM}";
  boot.loader.grub.useOSProber = true;
  boot.loader.grub.configurationLimit = configurationLimit;
}
