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

    # ../../modules/gnome/extensions.nix# gnome extensions

    ../../modules/hyprland            # hyprland packages

    ../../modules/fonts               # fonts

    ../vm/spice-virt-manager.nix      # tools for VM copy/paste clipboard
    ../vm/packages.nix                # virtual manager packages (virt-manager and virt-viewer)

    ../../modules/docker              # docker, docker-compose and /etc/hosts
  ];

  # Bootloader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
  boot.loader.efi.efiSysMountPoint = "${efiSysMountPoint}";
  boot.loader.systemd-boot.configurationLimit = configurationLimit;
}
