{ config, pkgs, lib, modulesPath, vars, ... }:

{
  # Bootloader.
  # boot.loader.systemd-boot.enable = true;
  # boot.loader.efi.canTouchEfiVariables = true;
  #boot.loader.efi.efiSysMountPoint = "${vars.efiSysMountPoint}";
  # boot.loader.systemd-boot.configurationLimit = vars.configurationLimit;

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
      systemd-boot.configurationLimit = vars.configurationLimit;
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
