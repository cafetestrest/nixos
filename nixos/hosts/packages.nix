{ config, pkgs, vars, ... }:

{
  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
    vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
  ];

  # TODO move to own config
  module = {
    configuration.enable = (vars.modules.configuration.enable or true);  # default value true for configuration.nix
    bootloader = {
      grub.enable = (vars.modules.bootloader.grub.enable or false);
      systemd-boot.enable = (vars.modules.bootloader.systemd-boot.enable or true);  # default value true bootload systemd-boot
    };
    drive = {
      ssd.enable = (vars.modules.drive.ssd.enable or false);
    };
    virtualisation = {
      virt-manager.enable = (vars.modules.virtualisation.virt-manager.enable or false);
      spice-virt-manager.enable = (vars.modules.virtualisation.spice-virt-manager.enable or false);
    };
  };
}
