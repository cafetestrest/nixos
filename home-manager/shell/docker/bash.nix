{ config, pkgs, ... }:

{
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
}
