{ config, lib, pkgs, modulesPath, ... }:

let
  inherit (import ../../variables.nix)
    efiSysMountPoint
    configurationLimit;
in
{
  imports = [
    ../configuration.nix              # shared configuration
    ../packages.nix                   # shared packages
    
    ./hardware-configuration.nix      # Include the results of the hardware scan.
    ../../modules/gnome/packages.nix  # gnome packages

    ../../modules/hyprland            # hyprland packages

    ../../modules/gnome/fonts.nix     # fonts gnome

    ../vm/spice-virt-manager.nix      # tools for VM copy/paste clipboard
    ../vm/packages.nix                # virtual manager packages (virt-manager and virt-viewer)
  ];

  # Bootloader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
  boot.loader.efi.efiSysMountPoint = "${efiSysMountPoint}";
  boot.loader.systemd-boot.configurationLimit = configurationLimit;
}
