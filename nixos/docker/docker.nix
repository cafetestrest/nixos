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
      docker-compose
    ];

    users.users.${vars.user} = {
      extraGroups = [ "docker" ];
    };

    virtualisation.docker.enable = true;
  };
}
