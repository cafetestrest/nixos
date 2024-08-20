{ config, pkgs, vars, ... }:

{
  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
    vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
  ];

  # TODO move to own config
  module = {
    bootloader = {
      grub.enable = (vars.modules.bootloader.grub.enable or false);
      systemd-boot.enable = (vars.modules.bootloader.systemd-boot.enable or true);  # default value true bootload systemd-boot
    };
    virtualisation = {
      virt-manager.enable = (vars.modules.virtualisation.virt-manager.enable or false);
      spice-virt-manager.enable = (vars.modules.virtualisation.spice-virt-manager.enable or false);
    };
  };
}
