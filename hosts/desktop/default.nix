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
    ../../modules/gnome/packages.nix  # gnome packages
    # ../../modules/gnome/extensions.nix# gnome extensions
    ../../modules/fish                # fish and its extensions
    ../../modules/scripts             # scripts, place to store all common scripts
    ../../modules/hyprland            # hyprland packages
    ../../modules/fonts               # fonts
    ../vm/spice-virt-manager.nix      # tools for VM copy/paste clipboard
    ../vm/packages.nix                # virtual manager packages (virt-manager and virt-viewer)
    ../../modules/docker              # docker, docker-compose and /etc/hosts
    ../../modules/neovim              # neovim and plugins for it
    ../../modules/mpv                 # mpv video player and its config
    ../../modules/gdm/background      # background for gdm
  ];

  # Bootloader.
  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
  #boot.loader.efi.efiSysMountPoint = "${efiSysMountPoint}";
  boot.loader.systemd-boot.configurationLimit = configurationLimit;
}
