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
  '';

  virtualisation.docker.enable = true;
}
