{ config, lib, pkgs, vars, ... }:

{
  environment.systemPackages = with pkgs; [
    docker
    docker-compose
  ];

  users.users.${vars.user} = {
    extraGroups = [ "docker" ];
  };

  # xdebug ports
  networking.firewall.allowedTCPPortRanges = [
    { from = 9000; to = 9003; }
  ];
  networking.firewall.allowedUDPPortRanges = [
    { from = 9000; to = 9003; }
  ];

  virtualisation.docker.enable = true;
}
