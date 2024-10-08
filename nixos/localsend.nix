{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.programs.localsend;
in
{
  options = {
    module.programs.localsend.enable = mkEnableOption "Enables localsend";
  };

  config = mkIf cfg.enable {
    networking.firewall.allowedTCPPorts = [ 53317 ];
    networking.firewall.allowedUDPPorts = [ 53317 ];
  };
}
