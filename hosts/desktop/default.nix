{ config, pkgs, lib, modulesPath, ... }:

let
  inherit (import ../../variables.nix)
    efiSysMountPoint
    configurationLimit;
in
{
  imports = [
    ./hardware-configuration.nix      # Include the results of the hardware scan.
    # ./amd-gpu.nix                     # configuration for AMD GPU
    ../configuration.nix              # shared configuration
    ../packages.nix                   # shared packages
    ../../nixos/fish.nix              # fish and its extensions
    ../../nixos/hyprland.nix          # hyprland packages
    ../../nixos/swaylock.nix          # lockscreen packages
    ../../nixos/gtklock.nix           # lockscreen packages
    ../vm/spice-virt-manager.nix      # tools for VM copy/paste clipboard
    ../vm/packages.nix                # virtual manager packages (virt-manager and virt-viewer)
    ../../nixos/docker                # docker, docker-compose and /etc/hosts
    ../../nixos/gdm/background.nix    # background for gdm
    ../../nixos/headsetcontrol.nix    # used to retrieve battery percentage from headset
    # ../../nixos/waybar.nix
  ];

  # Bootloader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
  #boot.loader.efi.efiSysMountPoint = "${efiSysMountPoint}";
  boot.loader.systemd-boot.configurationLimit = configurationLimit;
}
