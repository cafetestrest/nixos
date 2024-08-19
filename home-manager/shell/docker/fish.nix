{ config, pkgs, ... }:

{
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
}
