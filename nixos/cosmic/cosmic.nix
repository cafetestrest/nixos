{ config, lib, pkgs, inputs, ... }:

with lib;

let
  cfg = config.module.desktop-environment.cosmic;
in
{
  options = {
    module.desktop-environment.cosmic.enable = mkEnableOption "Enables Cosmic DE";
  };

  config = mkIf cfg.enable {
  imports = [
    inputs.nixos-cosmic.nixosModules.default
  ];

  nix.settings = {
    substituters = [ "https://cosmic.cachix.org/" ];
    trusted-public-keys = [ "cosmic.cachix.org-1:Dya9IyXD4xdBehWjrkPv6rtxpmMdRel02smYzA85dPE=" ];
  };

  services.desktopManager.cosmic.enable = true;
  # services.displayManager.cosmic-greeter.enable = true;
  # environment.cosmic.excludePackages = with pkgs; [
  #   cosmic-edit
  #   cosmic-files
  #   cosmic-term
  # ];
  };
}
