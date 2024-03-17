{ config, pkgs, lib, modulesPath, ... }:

let
  inherit (import ../../../variables.nix)
    efiSysMountPoint
    configurationLimit;
in
{
  imports = [
    ./hardware-configuration.nix      # Include the results of the hardware scan.
    # ./amd-gpu.nix                     # configuration for AMD GPU
    ../configuration.nix              # shared configuration
    ../packages.nix                   # shared packages
    ../../fish.nix                    # fish and its extensions
    ../../hyprland.nix                # hyprland packages
    ../../swaylock.nix                # lockscreen packages
    ../../gtklock.nix                 # lockscreen packages
    ../vm/spice-virt-manager.nix      # tools for VM copy/paste clipboard
    ../vm/packages.nix                # virtual manager packages (virt-manager and virt-viewer)
    ../../docker                      # docker, docker-compose and /etc/hosts
    ../../gdm/background.nix          # background for gdm
    ../../headsetcontrol.nix          # used to retrieve battery percentage from headset
    # ../../waybar.nix
  ];

  # Bootloader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
  #boot.loader.efi.efiSysMountPoint = "${efiSysMountPoint}";
  boot.loader.systemd-boot.configurationLimit = configurationLimit;
}
