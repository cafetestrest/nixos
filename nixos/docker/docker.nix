{ config, lib, pkgs, vars, ... }:

with lib;

let
  cfg = config.module.virtualisation.docker;
in
{
  options = {
    module.virtualisation.docker.enable = mkEnableOption "Enables Docker virtualisation";
  };

  config = mkIf cfg.enable {
    environment.systemPackages = with pkgs; [
      docker
      docker-compose  #TODO
    ];

    users.users.${vars.user} = {
      extraGroups = [ "docker" ];
    };

    # xdebug ports
    networking.firewall.allowedTCPPortRanges = [  #TODO
      { from = 9000; to = 9003; }
    ];
    networking.firewall.allowedUDPPortRanges = [
      { from = 9000; to = 9003; }
    ];

    virtualisation.docker.enable = true;
  };
}
