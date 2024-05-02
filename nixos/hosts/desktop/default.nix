{ config, pkgs, lib, modulesPath, ... }:

let
  inherit (import ../../../variables.nix)
    efiSysMountPoint
    configurationLimit;
in
{
  imports = [
    ./hardware-configuration.nix      # Include the results of the hardware scan.
    ./amd-gpu.nix                     # configuration for AMD GPU
    ../configuration.nix              # shared configuration
    ../packages.nix                   # shared packages
    ../../fish.nix                    # fish and its extensions
    ../../hyprland.nix                # hyprland packages
    # ../../swaylock.nix                # lockscreen packages
    # ../../gtklock.nix                 # lockscreen packages
    # ../vm/spice-virt-manager.nix      # tools for VM copy/paste clipboard
    # ../vm/packages.nix                # virtual manager packages (virt-manager and virt-viewer)
    ../../docker                      # docker, docker-compose and /etc/hosts
    ../../gdm/background.nix          # background for gdm
    ../../headsetcontrol.nix          # used to retrieve battery percentage from headset
    # ../../waybar.nix
  ];

  # Bootloader.
  # boot.loader.systemd-boot.enable = true;
  # boot.loader.efi.canTouchEfiVariables = true;
  #boot.loader.efi.efiSysMountPoint = "${efiSysMountPoint}";
  # boot.loader.systemd-boot.configurationLimit = configurationLimit;

  # Boot
  boot =
  {
    # Stay up-to-date on the kernel.
    bootspec.enable = true;

    # Boot Loader
    loader =
    {
      # timeout = 0;
      systemd-boot.editor = false;
      systemd-boot.enable = true;
      systemd-boot.configurationLimit = configurationLimit;
      efi.canTouchEfiVariables = true;
    };

    # Silent Boot
    kernelParams = [
      "quiet"
      "splash"
      "vga=current"
      "rd.systemd.show_status=false"
      "rd.udev.log_level=3"
      "udev.log_priority=3"
      "boot.shell_on_fail"
    ];

    # Plymouth
    consoleLogLevel = 0;
    initrd.verbose = false;
    # plymouth.enable = true;
  };
}
