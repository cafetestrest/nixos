{ config, pkgs, lib, modulesPath, ... }:

let
  inherit (import ../../../variables.nix)
    efiSysMountPoint
    configurationLimit;
in
{
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
