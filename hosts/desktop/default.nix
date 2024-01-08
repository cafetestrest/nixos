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
    ../../modules/fish                # fish and its extensions
    ../../modules/scripts             # scripts, place to store all common scripts
    ../../nixos/hyprland.nix          # hyprland packages
    ../../nixos/swaylock.nix          # lockscreen packages
    ../vm/spice-virt-manager.nix      # tools for VM copy/paste clipboard
    ../vm/packages.nix                # virtual manager packages (virt-manager and virt-viewer)
    ../../modules/docker              # docker, docker-compose and /etc/hosts
    ../../modules/neovim              # neovim and plugins for it
    ../../modules/mpv                 # mpv video player and its config
    ../../nixos/gdm/background.nix    # background for gdm
  ];

  # Bootloader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
  #boot.loader.efi.efiSysMountPoint = "${efiSysMountPoint}";
  boot.loader.systemd-boot.configurationLimit = configurationLimit;
}
