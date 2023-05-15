{ config, lib, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  environment.systemPackages = with pkgs; [
    docker
    docker-compose
  ];

  users.users.${user} = {
    extraGroups = [ "docker" ];
  };

  networking.extraHosts =
  ''
   127.0.0.1 ::1 magento.test
   172.17.0.1 host.docker.internal
  '';

  # xdebug ports
  networking.firewall.allowedTCPPortRanges = [
    { from = 9000; to = 9003; }
  ];
  networking.firewall.allowedUDPPortRanges = [
    { from = 9000; to = 9003; }
  ];

  virtualisation.docker.enable = true;
}
