{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.services.nix-diff;
in
{
  options = {
    module.services.nix-diff.enable = mkEnableOption "Enables nix-diff on rebuild";
    # TODO disable when this gets merged: https://github.com/NixOS/nixpkgs/pull/208902
  };

  config = mkIf cfg.enable {
    system.activationScripts.diff = ''
      if [[ -e /run/current-system ]]; then
        ${pkgs.nix}/bin/nix store diff-closures /run/current-system "$systemConfig"
      fi
    '';
  };
}
