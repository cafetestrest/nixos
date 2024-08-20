{ config, lib, pkgs, modulesPath, vars, ... }:

{
  # Bootloader for VM.
  boot.loader.grub.enable = true;
  boot.loader.grub.device = "${vars.grubDevice}";
  boot.loader.grub.useOSProber = true;
  boot.loader.grub.configurationLimit = vars.configurationLimit;
}
