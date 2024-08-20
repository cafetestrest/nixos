{ config, pkgs, vars, ... }:

{
  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
    vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
  ];

  module = {
    virtualisation = {
      virt-manager.enable = vars.modules.virtualisation.virt-manager.enable;
      spice-virt-manager.enable = vars.modules.virtualisation.spice-virt-manager.enable;
    };
  };
}
