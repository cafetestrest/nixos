{ config, lib, ... }:

with lib;

let
  cfg = config.module.shell.docker;
  cfgFish = config.module.shell.fish;
  cfgBash = config.module.shell.bash;
in
{
  options = {
    module.shell.docker.enable = mkEnableOption "Enables docker aliases";
  };

  config = mkMerge [
    (mkIf (cfg.enable && cfgFish.enable) {
      programs.fish = {
        functions = {
          dockerpruneall = {
            body = ''
              docker system prune -a --volumes
              docker builder prune -a
              docker image prune -a
              docker volume prune
              docker network prune
              docker container prune
              echo "Removed all unused containers, networks, images, volumes and builder cache"
            '';
          };

          dockerkill = {
            body = ''
              docker stop (docker ps -a -q)
              echo "Stopping all running containers"
              docker rm (docker ps -a -q)
              echo "Removed all stopped containers"
            '';
          };
        };
      };
    })

    (mkIf (cfg.enable && cfgBash.enable) {
      programs.bash = {
        bashrcExtra = ''
          function dockerpruneall () {
            docker system prune -a --volumes
            docker builder prune -a
            docker image prune -a
            docker volume prune
            docker network prune
            docker container prune
          }

          function dockerkill () {
            docker stop $(docker ps -a -q)
            docker rm $(docker ps -a -q)
          }
        '';
      };
    })
  ];
}
