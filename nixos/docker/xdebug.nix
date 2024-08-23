{ config, lib, ... }:

with lib;

let
  cfg = config.module.virtualisation.docker.xdebug-ports;
in
{
  options = {
    module.virtualisation.docker.xdebug-ports.enable = mkEnableOption "Enables xdebug-ports";
  };

  config = mkIf cfg.enable {
    # xdebug ports
    networking.firewall.allowedTCPPortRanges = [
      { from = 9000; to = 9003; }
    ];
    networking.firewall.allowedUDPPortRanges = [
      { from = 9000; to = 9003; }
    ];
  };
}
