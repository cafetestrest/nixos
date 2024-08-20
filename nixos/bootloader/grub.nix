{ config, lib, pkgs, vars, ... }:

with lib;

let
  cfg = config.module.bootloader.grub;
in
{
  options = {
    module.bootloader.grub.enable = mkEnableOption "Enables grub bootloader";
  };

  config = mkIf cfg.enable {
    boot.loader.grub.enable = true;
    boot.loader.grub.device = "${vars.grubDevice}";
    boot.loader.grub.useOSProber = true;
    boot.loader.grub.configurationLimit = vars.configurationLimit;
  };
}
